import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, ChevronDown, Menu, X } from 'lucide-react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { images } from './assets'
import americasMap from './americas-map.svg'
import client01 from './assets/client-logos/client-01.png'
import colgateLogo from './assets/client-logos/colgate.png'
import givaudanLogo from './assets/client-logos/givaudan.png'
import iffLogo from './assets/client-logos/iff.png'
import jafraLogo from './assets/client-logos/jafra.png'
import lorealLogo from './assets/client-logos/loreal.png'
import pgLogo from './assets/client-logos/pg.png'
import client08 from './assets/client-logos/client-08.png'
import firmenichLogo from './assets/client-logos/firmenich.png'
import saborTealLogo from './assets/client-logos/sabor-2026-teal.png'
import client11 from './assets/client-logos/client-11.png'
import client12 from './assets/client-logos/client-12.png'
import saborRedLogo from './assets/client-logos/sabor-2026-red.png'

const services = [
  {
    number: '01',
    title: 'Estudios con consumidores',
    short: 'Descubrimos cómo las personas perciben, recuerdan y prefieren productos, aromas y sabores.',
    detail: 'Entendemos cómo el consumidor final percibe, siente y recuerda un aroma, sabor o producto.',
    image: images.consumers,
    imageAlt: 'Personas evaluando muestras de producto en una conversación guiada',
    methods: ['Focus Groups', 'Estudios 1 a 1', 'Sniff Tests', 'Uso en casa'],
    uses: ['Validación de producto', 'Benchmark competitivo', 'Preferencia', 'Comprensión del consumidor'],
  },
  {
    number: '02',
    title: 'Optimización de perfumes y sabores',
    short: 'Encontramos el equilibrio entre percepción, desempeño sensorial y costo.',
    detail: 'Encontramos el punto óptimo entre percepción, desempeño sensorial y costo.',
    image: images.perfume,
    imageAlt: 'Tiras olfativas e ingredientes junto a muestras de perfumería',
    methods: ['Reducción de costos', 'Dosificación óptima', 'Validación sensorial', 'Desarrollo conceptual'],
  },
  {
    number: '03',
    title: 'Evaluación sensorial',
    short: 'Medimos atributos sensoriales con paneles, protocolos y análisis estadístico.',
    detail: 'Medimos y describimos objetivamente las propiedades sensoriales que determinan la experiencia del producto.',
    image: images.sensory,
    imageAlt: 'Participantes en una evaluación sensorial controlada',
    methods: ['QDA', 'Pruebas hedónicas', 'Umbral sensorial', 'TDS'],
  },
  {
    number: '04',
    title: 'Paneles de expertos',
    short: 'Formamos paneles capaces de reconocer diferencias sensoriales consistentes.',
    detail: 'Seleccionamos, entrenamos y coordinamos paneles capaces de detectar diferencias que un consumidor convencional no puede identificar consistentemente.',
    image: images.flavors,
    imageAlt: 'Muestras de sabores organizadas para una prueba comparativa',
    methods: ['Selección', 'Entrenamiento', 'Paneles de consumidores', 'Paneles internos'],
  },
  {
    number: '05',
    title: 'Proyectos a medida',
    short: 'Diseñamos el estudio y las herramientas alrededor de la pregunta.',
    detail: 'Cuando un reto no encaja en una metodología existente, diseñamos el estudio, protocolo y herramientas desde cero.',
    image: images.analysis,
    imageAlt: 'Análisis de resultados de investigación sobre una mesa de trabajo',
    methods: ['Equipos especiales', 'Preparación de muestras', 'Protocolos propios', 'Estudios integrales'],
  },
]

const process = [
  ['01', 'Definir', 'La pregunta de negocio'],
  ['02', 'Investigar', 'El contexto y las personas'],
  ['03', 'Evaluar', 'La experiencia sensorial'],
  ['04', 'Analizar', 'Lo que revelan los datos'],
  ['05', 'Recomendar', 'La siguiente decisión'],
]

type ClientLogo = { id: string, name: string, src: string, viewBox: string, tone?: 'badge-teal' | 'badge-red' }

const clientRows: ClientLogo[][] = [
  [
    { id: '01', name: 'Logotipo de cliente CID', src: client01, viewBox: '179 199 1698 1637' },
    { id: 'colgate', name: 'Colgate', src: colgateLogo, viewBox: '20 726 1951 539' },
    { id: 'givaudan', name: 'Givaudan', src: givaudanLogo, viewBox: '22 775 1957 450' },
    { id: 'iff', name: 'IFF', src: iffLogo, viewBox: '203 203 1594 1594' },
    { id: 'jafra', name: 'Jafra', src: jafraLogo, viewBox: '197 732 1606 742' },
    { id: 'loreal', name: 'L’Oréal', src: lorealLogo, viewBox: '180 180 1653 1653' },
    { id: 'pg', name: 'P&G', src: pgLogo, viewBox: '261 280 1465 1461' },
  ],
  [
    { id: '08', name: 'Emblema de cliente CID', src: client08, viewBox: '177 355 1640 1213' },
    { id: 'firmenich', name: 'Firmenich', src: firmenichLogo, viewBox: '83 739 1821 519' },
    { id: 'sabor-teal', name: 'Sabor del Año 2026', src: saborTealLogo, viewBox: '270 166 1448 1666', tone: 'badge-teal' },
    { id: '11', name: 'Logotipo geométrico de cliente CID', src: client11, viewBox: '279 273 1424 1430' },
    { id: '12', name: 'Emblema de cliente CID con toro', src: client12, viewBox: '250 238 1552 1533' },
    { id: 'sabor-red', name: 'Sabor del Año 2026', src: saborRedLogo, viewBox: '202 88 1584 1826', tone: 'badge-red' },
  ],
]

function ScrollReveals({ pathname }: { pathname: string }) {
  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionPreference.matches || !('IntersectionObserver' in window)) return
    const selector = [
      '.hero-copy > *', '.hero-visual', '.about-hero-inner > *',
      '.intro-photo', '.intro-copy', '.section-heading', '.service-preview-card',
      '.method-copy', '.process-step', '.clients-section h2', '.brand-marquee',
      '.closing-inner', '.page-hero-grid > *', '.services-intro', '.service-row',
      '.history-item', '.belief-heading', '.belief-story', '.founder-image', '.founder-copy', '.presence-heading', '.presence-layout > *',
      '.contact-copy', '.contact-form',
    ].join(',')
    const targets = Array.from(document.querySelectorAll<HTMLElement>(selector))
    targets.forEach((element) => {
      const siblings = element.parentElement?.children
      if (siblings && (element.matches('.hero-copy > *, .about-hero-inner > *, .service-preview-card, .process-step, .history-item'))) {
        const index = Array.from(siblings).indexOf(element)
        element.style.setProperty('--reveal-delay', `${Math.min(index * 45, 160)}ms`)
      }
      element.classList.add('reveal-on-scroll')
    })
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.02, rootMargin: '0px 0px 10% 0px' })
    targets.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [pathname])
  return null
}

const solidLogoMatrix = '0 0 0 0 .35  0 0 0 0 .43  0 0 0 0 .45  0 0 0 1 0'
const tealBadgeMatrix = '0 .45 0 0 .18  0 .52 0 0 .22  0 .48 0 0 .25  0 0 0 1 0'
const redBadgeMatrix = '.45 0 0 0 .18  .52 0 0 0 .22  .48 0 0 0 .25  0 0 0 1 0'

function BrandMarquee({ brands, direction }: { brands: ClientLogo[], direction: 'left' | 'right' }) {
  return <div className={`brand-marquee brand-marquee-${direction}`} aria-label={brands.map(brand => brand.name).join(', ')}>
    <div className="brand-marquee-track">
      {[0, 1].map((copy) => <div className="brand-marquee-group" aria-hidden={copy === 1} key={copy}>
        {brands.map((brand) => {
          const filterId = `client-tone-${direction}-${copy}-${brand.id}`
          const matrix = brand.tone === 'badge-teal' ? tealBadgeMatrix : brand.tone === 'badge-red' ? redBadgeMatrix : solidLogoMatrix
          return <span className={`client-logo ${brand.tone ? 'is-badge' : ''}`} key={`${copy}-${brand.id}`}>
            <svg viewBox={brand.viewBox} role="img" aria-label={brand.name} preserveAspectRatio="xMidYMid meet">
              <defs><filter id={filterId} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={matrix} />{!brand.tone && <feComponentTransfer><feFuncA type="gamma" amplitude="1" exponent=".35" offset="0" /></feComponentTransfer>}</filter></defs>
              <image href={brand.src} width="2000" height="2000" filter={`url(#${filterId})`} />
            </svg>
          </span>
        })}
      </div>)}
    </div>
  </div>
}

function PageLoadIntro() {
  const [visible, setVisible] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    if (!visible) return
    const timer = window.setTimeout(() => setVisible(false), 2500)
    return () => window.clearTimeout(timer)
  }, [visible])

  if (!visible) return null
  return <div className="site-intro" aria-hidden="true">
    <div className="site-intro-content">
      <span className="site-intro-kicker">PERSONAS · INSIGHTS · OPORTUNIDADES</span>
      <span className="site-intro-wordmark">CID<span>CONSULTORES</span></span>
      <span className="site-intro-line"><span /></span>
    </div>
  </div>
}

function Brand() {
  return <Link to="/" className="brand" aria-label="CID Consultores, ir a inicio">
    <span className="brand-mark">C<span className="brand-i">I</span>D<span className="brand-dot" /></span>
    <span className="brand-sub">CONSULTORES</span>
    <span className="brand-divider" />
    <span className="brand-claim">PERSONAS<br />INSIGHTS<br />OPORTUNIDADES</span>
  </Link>
}

function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { setOpen(false) }, [pathname])
  return <header className="site-header">
    <div className="container nav-inner">
      <Brand />
      <nav className={open ? 'nav-links is-open' : 'nav-links'} aria-label="Navegación principal">
        <NavLink to="/" end>Inicio</NavLink>
        <NavLink to="/servicios">Servicios</NavLink>
        <NavLink to="/nosotros">Nosotros</NavLink>
        <Link to="/nosotros#contacto" onClick={() => setOpen(false)}>Contacto</Link>
        <Link className="nav-mobile-cta" to="/nosotros#contacto">Hablar con un consultor <ArrowRight size={16} /></Link>
      </nav>
      <Link className="button button-navy nav-cta" to="/nosotros#contacto">Hablar con un consultor <ArrowUpRight size={16} /></Link>
      <button className="menu-toggle" type="button" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </div>
  </header>
}

function Footer() {
  return <footer className="footer">
    <div className="container footer-top">
      <div><Brand /><p>Investigación que convierte percepción en decisiones de negocio.</p></div>
      <div className="footer-links"><Link to="/">Inicio</Link><Link to="/servicios">Servicios</Link><Link to="/nosotros">Nosotros</Link><Link to="/nosotros#contacto">Contacto</Link></div>
      <div className="footer-contact"><span>CIUDAD DE MÉXICO, MÉXICO</span><a href="mailto:contacto@cidconsultores.com">contacto@cidconsultores.com</a></div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} CID Consultores</span><span>Personas. Insights. Oportunidades.</span></div>
  </footer>
}

function SectionTag({ children }: { children: string }) { return <span className="section-tag"><i />{children}</span> }

function ButtonLink({ to, children, variant = 'teal' }: { to: string, children: React.ReactNode, variant?: 'teal' | 'outline' | 'light' }) {
  return <Link className={`button button-${variant}`} to={to}>{children}<ArrowUpRight size={17} strokeWidth={1.7} /></Link>
}

function ImagePanel({ src, alt, className = '' }: { src: string, alt: string, className?: string }) {
  return <div className={`image-panel ${className}`}><img src={src} alt={alt} loading="lazy" /></div>
}

function ClosingCTA() {
  return <section className="closing-cta">
    <div className="closing-orbit orbit-one" /><div className="closing-orbit orbit-two" />
    <div className="container closing-inner"><span className="mini-label">CONVERSEMOS</span><h2>Cada producto genera una percepción.<br /><em>Hagamos que trabaje a tu favor.</em></h2><ButtonLink to="/nosotros#contacto" variant="light">Cuéntanos sobre tu proyecto</ButtonLink></div>
  </section>
}

function HomePage() {
  return <>
    <section className="home-hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <SectionTag>INVESTIGACIÓN QUE IMPULSA DECISIONES</SectionTag>
          <h1>Transformamos<br />percepción en<br /><em>estrategia.</em></h1>
          <p>Investigación de mercado, consumer insights y evaluación sensorial para convertir lo que las personas perciben, sienten y prefieren en decisiones de negocio.</p>
          <div className="hero-actions"><ButtonLink to="/servicios">Conocer servicios</ButtonLink><ButtonLink to="/nosotros#contacto" variant="outline">Hablar con un consultor</ButtonLink></div>
        </div>
        <div className="hero-visual"><img src={images.hero} alt="Investigadora evaluando una muestra aromática en una composición editorial" fetchPriority="high" /><div className="hero-visual-label label-top">CONSUMIDORES<br />PERCEPCIÓN<br />AROMAS<br />SABORES</div><div className="hero-visual-label label-bottom">EXPLORAR <span>→</span> MEDIR <span>→</span> ENTENDER <span>→</span> DECIDIR</div></div>
      </div>
    </section>
    <section className="section intro-section"><div className="container intro-grid"><div className="intro-photo"><ImagePanel src={images.sensory} alt="Participantes evaluando muestras sensoriales" /><div className="photo-index">01 / EXPERTISE SENSORIAL</div></div><div className="intro-copy"><SectionTag>EXPERTISE SENSORIAL</SectionTag><h2>Entender al consumidor va más allá de preguntar si algo <em>le gusta.</em></h2><p>Combinamos investigación, ciencia sensorial y experiencia para entender qué atributos realmente impulsan la percepción y preferencia del consumidor.</p><Link className="text-link" to="/nosotros">Conoce a CID <ArrowUpRight size={18} /></Link></div></div></section>
    <section className="section services-preview"><div className="container"><div className="section-heading"><SectionTag>NUESTROS SERVICIOS</SectionTag><h2>Soluciones diseñadas<br /><em>alrededor de cada reto.</em></h2></div><div className="service-preview-grid">{[services[0], services[2], services[4]].map((service) => <Link to="/servicios" className="service-preview-card" key={service.number}><div className="service-preview-image"><img src={service.image} alt={service.imageAlt} loading="lazy" /></div><div className="service-preview-content"><span>{service.number} / CAPACIDAD</span><ArrowUpRight size={21} strokeWidth={1.4} /><h3>{service.title}</h3><p>{service.short}</p></div></Link>)}</div><Link className="text-link preview-more" to="/servicios">Ver todos los servicios <ArrowUpRight size={18} /></Link></div></section>
    <section className="section method-section"><div className="container method-grid"><div className="method-copy"><SectionTag>NUESTRA FORMA DE TRABAJAR</SectionTag><h2>De una pregunta de negocio a una <em>decisión clara.</em></h2><p>Partimos del reto, elegimos la metodología adecuada y transformamos hallazgos en recomendaciones concretas.</p><ImagePanel src={images.analysis} alt="Equipo analizando gráficos y resultados de muestras" className="method-photo" /></div><div className="process-list">{process.map(([n, title, desc]) => <div className="process-step" key={n}><span className="process-number">{n}</span><div><h3>{title}</h3><p>{desc}</p></div><ArrowDownRight size={21} strokeWidth={1.3} /></div>)}</div></div></section>
    <section className="clients-section"><div className="container"><p>UNA TRAYECTORIA CON MARCAS DE DISTINTAS INDUSTRIAS</p><h2>Marcas que han confiado en CID</h2></div><div className="client-marquees"><BrandMarquee brands={clientRows[0]} direction="left" /><BrandMarquee brands={clientRows[1]} direction="right" /></div></section>
    <ClosingCTA />
  </>
}

function ServicesPage() {
  const [active, setActive] = useState('01')
  const [scrollTarget, setScrollTarget] = useState<string | null>(null)
  const rowButtons = useRef<Record<string, HTMLButtonElement | null>>({})
  useEffect(() => {
    if (!scrollTarget || scrollTarget !== active) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const narrowViewport = window.innerWidth <= 800
    const timer = window.setTimeout(() => {
      rowButtons.current[scrollTarget]?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: narrowViewport ? 'start' : 'center' })
    }, reducedMotion ? 0 : 390)
    return () => window.clearTimeout(timer)
  }, [active, scrollTarget])
  return <>
    <section className="page-hero services-hero"><div className="container page-hero-grid"><div><SectionTag>CAPACIDADES</SectionTag><h1>Investigación diseñada para responder <em>preguntas reales.</em></h1><p>No partimos de una metodología. Partimos de la pregunta que tu negocio necesita resolver.</p></div><div className="page-hero-image"><img src={images.flavors} alt="Muestras comparativas de sabores y aromas" /></div></div></section>
    <section className="services-index section"><div className="container"><div className="services-intro"><span>LO QUE PODEMOS HACER</span><p>Unimos la investigación con el criterio sensorial para responder a cada reto con la profundidad que necesita.</p></div><div className="service-accordion">{services.map(service => <article className={`service-row ${active === service.number ? 'is-active' : ''}`} key={service.number}><button ref={(element) => { rowButtons.current[service.number] = element }} type="button" aria-controls={`service-panel-${service.number}`} aria-expanded={active === service.number} onClick={() => { const next = active === service.number ? '' : service.number; setActive(next); setScrollTarget(next || null) }}><span className="service-row-number">{service.number}</span><span className="service-row-title">{service.title}</span><span className="service-row-toggle"><ChevronDown size={21} strokeWidth={1.6} /></span></button><div className="service-panel" id={`service-panel-${service.number}`} aria-hidden={active !== service.number}><div className="service-panel-inner"><div className="service-row-body"><div className="service-row-photo"><img src={service.image} alt={service.imageAlt} loading="lazy" /></div><div className="service-row-detail"><p>{service.detail}</p><div className="method-chips">{service.methods.map(method => <span key={method}><Check size={13} />{method}</span>)}</div>{service.uses && <div className="service-uses"><h4>CUÁNDO UTILIZARLO</h4><p>{service.uses.join(' · ')}</p></div>}</div></div></div></div></article>)}</div></div></section>
    <section className="tailored-note"><div className="container tailored-grid"><span>0 FÓRMULAS GENÉRICAS</span><h2>La metodología correcta empieza con una buena pregunta.</h2><ButtonLink to="/nosotros#contacto" variant="outline">Hablar con CID</ButtonLink></div></section>
    <ClosingCTA />
  </>
}

const history = [
  ['Años 90', 'Fundación en Ciudad de México.'],
  ['Evolución', 'De estudios con consumidores a consultoría sensorial.'],
  ['Expansión', 'Alianzas y proyectos en América Latina.'],
  ['Hoy', '30+ años, presencia en 8 países y proyectos a la medida.'],
]

const beliefStories = [
  { number: '01', title: 'Escuchar el contexto', text: 'La percepción ocurre en la vida real. El lenguaje y las experiencias de las personas ayudan a formular mejores preguntas.', image: images.consumers, alt: 'Personas compartiendo su experiencia con productos' },
  { number: '02', title: 'Medir lo sensorial', text: 'Aromas, sabores y atributos se observan con protocolos que permiten comparar experiencias de forma consistente.', image: images.sensory, alt: 'Participantes evaluando muestras sensoriales' },
  { number: '03', title: 'Traducir los hallazgos', text: 'La lectura conjunta de personas y datos convierte resultados en criterios útiles para decidir sobre un producto.', image: images.analysis, alt: 'Investigadores analizando resultados y muestras' },
]

const presenceCountries = ['México', 'Estados Unidos', 'Guatemala', 'Colombia', 'Perú', 'Brasil', 'Chile', 'Argentina']

function ContactForm() {
  const [sent, setSent] = useState(false)
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const subject = encodeURIComponent(`Consulta CID: ${String(data.get('empresa') || 'nuevo proyecto')}`)
    const body = encodeURIComponent(`Nombre: ${data.get('nombre')}\nEmpresa: ${data.get('empresa')}\nEmail: ${data.get('email')}\nTipo de estudio: ${data.get('estudio')}\nIndustria: ${data.get('industria')}\n\nMensaje:\n${data.get('mensaje')}`)
    window.location.href = `mailto:contacto@cidconsultores.com?subject=${subject}&body=${body}`
    setSent(true)
  }
  return <form className="contact-form" onSubmit={handleSubmit}><div className="form-two"><label>Nombre<input name="nombre" placeholder="Tu nombre" required /></label><label>Empresa<input name="empresa" placeholder="Nombre de tu empresa" required /></label></div><label>Email<input name="email" type="email" placeholder="correo@empresa.com" required /></label><div className="form-two"><label>Tipo de estudio<span className="select-wrap"><select name="estudio" defaultValue="" required><option value="" disabled>Selecciona una opción</option><option>Estudios con consumidores</option><option>Evaluación sensorial</option><option>Panel de expertos</option><option>Optimización de insumos</option><option>Proyecto a medida</option><option>No lo sé aún</option></select><ChevronDown size={17} /></span></label><label>Industria<span className="select-wrap"><select name="industria" defaultValue="" required><option value="" disabled>Selecciona una opción</option><option>Perfumería / Fragancias</option><option>Sabores / Alimentos</option><option>Cuidado personal</option><option>Productos del hogar</option><option>Bebidas</option><option>Otra</option></select><ChevronDown size={17} /></span></label></div><label>Mensaje<textarea name="mensaje" rows={4} placeholder="Cuéntanos qué necesitas entender..." required /></label><button className="button button-teal" type="submit">Enviar consulta <ArrowUpRight size={17} /></button>{sent && <p className="form-feedback" role="status">Se abrirá tu aplicación de correo para enviar la consulta.</p>}</form>
}

function AboutPage() {
  const { hash } = useLocation()
  useEffect(() => { if (hash === '#contacto') setTimeout(() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }), 80) }, [hash])
  return <>
    <section className="page-hero about-hero"><div className="container about-hero-inner"><SectionTag>CID CONSULTORES</SectionTag><h1>Más de 30 años<br /><em>entendiendo percepción.</em></h1><p>CID nació en Ciudad de México con una especialización inusual: entender cómo las personas perciben aromas, sabores y productos, y convertir ese conocimiento en decisiones útiles para las marcas.</p><div className="about-hero-photo"><img src={images.consumers} alt="Grupo de consumidores conversando sobre productos" /></div></div></section>
    <section className="section history-section"><div className="container"><div className="section-heading"><SectionTag>UNA HISTORIA DE ESPECIALIZACIÓN</SectionTag><h2>Experiencia que evoluciona<br /><em>con cada pregunta.</em></h2></div><div className="history-grid">{history.map(([period, text], i) => <div className="history-item" key={period}><span>{String(i + 1).padStart(2, '0')}</span><h3>{period}</h3><p>{text}</p></div>)}</div></div></section>
    <section className="section belief-section"><div className="container"><div className="belief-heading"><SectionTag>UNA FORMA DE MIRAR</SectionTag><h2>La percepción se entiende desde <em>más de un ángulo.</em></h2><p>En CID conectamos la voz del consumidor, la evaluación sensorial y el análisis para comprender qué hay detrás de una preferencia.</p></div><div className="belief-grid">{beliefStories.map((story) => <article className="belief-story" key={story.number}><div className="belief-photo"><img src={story.image} alt={story.alt} loading="lazy" /></div><div className="belief-story-heading"><span>{story.number}</span><h3>{story.title}</h3></div><p>{story.text}</p></article>)}</div></div></section>
    <section className="section founder-section"><div className="container founder-grid"><div className="founder-image"><img src={images.perfume} alt="Manos evaluando materias primas y tiras olfativas" loading="lazy" /><span>IMAGEN CONCEPTUAL / OFICIO SENSORIAL</span></div><div className="founder-copy"><SectionTag>LA VISIÓN DETRÁS DE CID</SectionTag><h2>Una vida dedicada a entender <em>los sentidos.</em></h2><h3>José Luis</h3><span className="founder-role">FUNDADOR Y PERFUMISTA SENIOR</span><p>Con más de 50 años de experiencia en perfumería y sabores, José Luis ha construido una trayectoria alrededor de la evaluación sensorial, las materias primas y el entendimiento del consumidor.</p><p>Su visión dio origen a CID: combinar rigor científico, experiencia sensorial y criterio estratégico.</p></div></div></section>
    <section className="section presence-section"><div className="container"><div className="presence-heading"><SectionTag>PRESENCIA</SectionTag><h2>Conocimiento local.<br /><em>Perspectiva regional.</em></h2><p>Una mirada nacida en Ciudad de México y enriquecida por proyectos en distintos mercados de América.</p></div><div className="presence-layout"><div className="presence-map"><img src={americasMap} alt="Mapa de América con México, Estados Unidos, Guatemala, Colombia, Perú, Brasil, Chile y Argentina destacados" loading="lazy" /><span>ORIGEN EN CIUDAD DE MÉXICO</span></div><div className="presence-list"><strong>08</strong><span>PAÍSES EN NUESTRA TRAYECTORIA</span><div className="country-list">{presenceCountries.map((country, index) => <div key={country}><small>{String(index + 1).padStart(2, '0')}</small><span>{country}</span></div>)}</div></div></div></div></section>
    <section className="section contact-section" id="contacto"><div className="container contact-grid"><div className="contact-copy"><SectionTag>CONTACTO</SectionTag><h2>Hablemos de tu <em>próximo proyecto.</em></h2><p>Cuéntanos qué necesitas entender. Te ayudaremos a definir la mejor forma de investigarlo.</p><div className="contact-info"><span>ESCRÍBENOS</span><a href="mailto:contacto@cidconsultores.com">contacto@cidconsultores.com <ArrowUpRight size={18} /></a><span>ENCUÉNTRANOS</span><p>Ciudad de México, México</p></div></div><ContactForm /></div></section>
  </>
}

function AnimatedPages() {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [phase, setPhase] = useState<'idle' | 'leaving' | 'entering'>('idle')

  useEffect(() => {
    if (location.pathname === displayLocation.pathname) {
      if (location.key !== displayLocation.key) setDisplayLocation(location)
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayLocation(location)
      setPhase('idle')
      return
    }
    setPhase('leaving')
    const timer = window.setTimeout(() => {
      setDisplayLocation(location)
      setPhase('entering')
    }, 220)
    return () => window.clearTimeout(timer)
  }, [location, displayLocation.pathname, displayLocation.key])

  useEffect(() => {
    if (phase !== 'entering') return
    const timer = window.setTimeout(() => setPhase('idle'), 480)
    return () => window.clearTimeout(timer)
  }, [phase])

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [displayLocation.pathname])

  return <>
    <ScrollReveals pathname={displayLocation.pathname} />
    <main className={`page-stage ${phase === 'idle' ? '' : `is-${phase}`}`}>
      <Routes location={displayLocation}>
        <Route path="/" element={<HomePage />} />
        <Route path="/servicios" element={<ServicesPage />} />
        <Route path="/nosotros" element={<AboutPage />} />
      </Routes>
    </main>
  </>
}

export default function App() {
  return <><PageLoadIntro /><Header /><AnimatedPages /><Footer /></>
}
