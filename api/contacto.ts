// Función serverless de Vercel: recibe el formulario de contacto y lo envía por correo con Resend.
// Variables de entorno: RESEND_API_KEY, CONTACT_TO (destino), CONTACT_FROM (remitente verificado en Resend),
// CONTACT_AUTOREPLY=true (opcional, confirma la recepción al visitante).

type Req = { method?: string, body?: unknown, headers: Record<string, string | string[] | undefined>, socket?: { remoteAddress?: string } }
type Res = { status: (code: number) => Res, json: (body: unknown) => void, setHeader: (name: string, value: string) => void }

const MIN_FILL_MS = 3000
const MAX_PER_HOUR = 5
const hits = new Map<string, number[]>()

const limits: Record<string, number> = { nombre: 120, empresa: 160, email: 200, telefono: 40, servicio: 120, industria: 80, plazo: 80, contacto: 40, mensaje: 4000 }
const labels: Record<string, string> = { nombre: 'Nombre', empresa: 'Empresa', email: 'Email', telefono: 'Teléfono / WhatsApp', servicio: 'Servicio de interés', industria: 'Industria', plazo: 'Cuándo lo necesitan', contacto: 'Medio de contacto preferido', mensaje: 'Qué necesitan' }

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)

function tooMany(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < 3_600_000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX_PER_HOUR
}

async function sendEmail(payload: Record<string, unknown>) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error(`Resend ${response.status}`)
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'method' }) }

  let body: Record<string, unknown>
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body as Record<string, unknown>) ?? {} } catch { return res.status(400).json({ error: 'body' }) }

  // Antispam: los bots que caen aquí reciben "ok" para que no reintenten, pero no se envía nada.
  const forwarded = req.headers['x-forwarded-for']
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown'
  const elapsed = Date.now() - Number(body.t || 0)
  const message = String(body.mensaje ?? '')
  const links = (message.match(/https?:\/\/|www\./gi) ?? []).length
  if (body.web || !(elapsed >= MIN_FILL_MS) || links > 2) return res.status(200).json({ ok: true })
  if (tooMany(ip)) return res.status(429).json({ error: 'rate' })

  const data: Record<string, string> = {}
  for (const key of Object.keys(limits)) data[key] = String(body[key] ?? '').trim().slice(0, limits[key])
  const required = ['nombre', 'empresa', 'email', 'servicio', 'mensaje']
  if (required.some((key) => !data[key]) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return res.status(400).json({ error: 'fields' })

  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) return res.status(500).json({ error: 'config' })

  const rows = Object.keys(labels).filter((key) => data[key]).map((key) => `<tr><td style="padding:6px 14px 6px 0;color:#617086;vertical-align:top"><b>${labels[key]}</b></td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(data[key])}</td></tr>`).join('')
  try {
    await sendEmail({
      from: CONTACT_FROM,
      to: CONTACT_TO.split(',').map((address) => address.trim()),
      reply_to: data.email,
      subject: `Consulta CID · ${data.servicio} · ${data.empresa}`,
      html: `<h2 style="font-family:Georgia,serif;color:#0b1e3d">Nueva consulta desde el sitio</h2><table style="font-family:Arial,sans-serif;font-size:14px;color:#0b1e3d">${rows}</table>`,
    })
    if (process.env.CONTACT_AUTOREPLY === 'true') {
      await sendEmail({
        from: CONTACT_FROM,
        to: [data.email],
        subject: 'Recibimos tu consulta · CID Consultores',
        html: `<p style="font-family:Arial,sans-serif;font-size:14px;color:#0b1e3d">Hola ${escapeHtml(data.nombre)}, gracias por escribirnos. Recibimos tu consulta sobre <b>${escapeHtml(data.servicio)}</b> y te contactaremos pronto.<br><br>CID Consultores</p>`,
      }).catch(() => undefined)
    }
    return res.status(200).json({ ok: true })
  } catch {
    return res.status(502).json({ error: 'send' })
  }
}
