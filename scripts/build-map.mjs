import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { geoCentroid, geoGraticule, geoMercator, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'

const atlasPath = fileURLToPath(new URL('../node_modules/world-atlas/countries-110m.json', import.meta.url))
const outputPath = fileURLToPath(new URL('../src/americas-map.svg', import.meta.url))
const atlas = JSON.parse(readFileSync(atlasPath, 'utf8'))
const countries = feature(atlas, atlas.objects.countries).features
const featuredIds = new Set(['840', '484', '320', '170', '604', '076', '152', '032'])
const projection = geoMercator().fitExtent(
  [[30, 25], [750, 650]],
  { type: 'MultiPoint', coordinates: [[-127, 58], [-33, 58], [-33, -57], [-127, -57]] },
)
const path = geoPath(projection).digits(1)
const visibleCountries = countries.filter((country) => {
  const [longitude, latitude] = geoCentroid(country)
  return longitude > -170 && longitude < -28 && latitude > -60 && latitude < 75
})

const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;')
const graticule = path(geoGraticule().step([15, 15])())
const regionPath = (country, fill) => `<path d="${escape(path(country) ?? '')}" fill="${fill}" stroke="#F8F7F2" stroke-width="1.45" stroke-linejoin="round" />`
const regions = visibleCountries.map((country) => regionPath(country, '#DEE8E2')).join('')
const highlights = visibleCountries
  .filter((country) => featuredIds.has(String(country.id).padStart(3, '0')))
  .map((country) => regionPath(country, '#89BDB2'))
  .join('')

const points = [
  ['Estados Unidos', -97, 36],
  ['México', -99, 19],
  ['Guatemala', -90, 15],
  ['Colombia', -74, 4],
  ['Perú', -75, -10],
  ['Brasil', -52, -14],
  ['Chile', -71, -33],
  ['Argentina', -64, -38],
].map(([name, longitude, latitude]) => {
  const [x, y] = projection([longitude, latitude])
  const origin = name === 'México'
  return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${origin ? 7.5 : 5}" fill="${origin ? '#C9933A' : '#0F7B6C'}" stroke="#FFFFFF" stroke-width="2.5" />`
}).join('')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="680" viewBox="0 0 800 680" role="img" aria-labelledby="title desc">
<title id="title">Mapa de presencia de CID en América</title>
<desc id="desc">Estados Unidos, México, Guatemala, Colombia, Perú, Brasil, Chile y Argentina aparecen destacados.</desc>
<defs><clipPath id="frame"><rect x="0" y="0" width="800" height="680" /></clipPath></defs>
<rect width="800" height="680" fill="#EDF2EE" />
<g clip-path="url(#frame)">
<path d="${escape(graticule ?? '')}" fill="none" stroke="#CFDDD5" stroke-width=".7" />
${regions}
${highlights}
${points}
</g>
</svg>`

writeFileSync(outputPath, svg)
console.log(`Created ${outputPath} with ${visibleCountries.length} countries`)
