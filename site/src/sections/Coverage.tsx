import SectionHead from '../components/SectionHead'
import { useReveal } from '../hooks'

// Capital cities, real coordinates, plotted equirectangular.
const cities = [
  { country: 'Myanmar', city: 'Naypyidaw', lat: 19.76, lon: 96.07, anchor: 'end' },
  { country: 'Laos', city: 'Vientiane', lat: 17.97, lon: 102.6, anchor: 'start' },
  { country: 'Vietnam', city: 'Hanoi', lat: 21.03, lon: 105.85, anchor: 'start' },
  { country: 'Cambodia', city: 'Phnom Penh', lat: 11.56, lon: 104.92, anchor: 'start' },
  { country: 'Malaysia', city: 'Kuala Lumpur', lat: 3.14, lon: 101.69, anchor: 'end' },
  { country: 'Singapore', city: 'Singapore', lat: 1.35, lon: 103.82, anchor: 'start' },
  { country: 'Brunei', city: 'Bandar Seri Begawan', lat: 4.94, lon: 114.95, anchor: 'middle' },
  { country: 'Philippines', city: 'Manila', lat: 14.6, lon: 120.98, anchor: 'end' },
  { country: 'Indonesia', city: 'Jakarta', lat: -6.2, lon: 106.85, anchor: 'middle' },
] as const

const W = 600
const H = 560
const LON0 = 92
const LON1 = 124
const LAT0 = -9
const LAT1 = 24
const px = (lon: number) => ((lon - LON0) / (LON1 - LON0)) * W
const py = (lat: number) => ((LAT1 - lat) / (LAT1 - LAT0)) * H
const bkk = { x: px(100.5), y: py(13.75) }

export default function Coverage() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="coverage" className="section coverage">
      <div className="container coverage-layout">
        <SectionHead
          kicker="Coverage"
          title={
            <>
              Bangkok sits at the <em>centre</em> of Southeast Asia. So do we.
            </>
          }
        >
          Our inspectors reach factories in all ten ASEAN countries quickly. This saves you inspection and transport
          cost and time. Our bilingual engineers also remove the language and culture barriers of working offshore.
        </SectionHead>

        <div className="map reveal" ref={ref}>
          <svg viewBox={`-90 -10 ${W + 110} ${H + 40}`} role="img" aria-label="Map of the ten ASEAN countries II covers, with Bangkok at the centre">
            <defs>
              <radialGradient id="hub" r="50%">
                <stop offset="0" stopColor="#f2c879" stopOpacity="0.9" />
                <stop offset="1" stopColor="#f2c879" stopOpacity="0" />
              </radialGradient>
              <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.07)" />
              </pattern>
            </defs>
            <rect width={W} height={H} fill="url(#dots)" />
            {[60, 140, 240].map((r) => (
              <circle key={r} className="map-range" cx={bkk.x} cy={bkk.y} r={r} />
            ))}
            {cities.map((c, i) => {
              const x = px(c.lon)
              const y = py(c.lat)
              const mx = (bkk.x + x) / 2
              const my = (bkk.y + y) / 2
              const dx = x - bkk.x
              const dy = y - bkk.y
              const cx = mx - dy * 0.18
              const cy = my + dx * 0.18
              const lx = c.anchor === 'end' ? x - 12 : c.anchor === 'start' ? x + 12 : x
              const ly = c.anchor === 'middle' ? y + 26 : y + 4
              return (
                <g key={c.country} className="map-city" style={{ ['--i' as string]: i }}>
                  <path className="map-arc" d={`M${bkk.x},${bkk.y} Q${cx},${cy} ${x},${y}`} pathLength={1} />
                  <path className="map-pulse" d={`M${bkk.x},${bkk.y} Q${cx},${cy} ${x},${y}`} pathLength={1} />
                  <circle cx={x} cy={y} r="4.5" className="map-dot" />
                  <text x={lx} y={ly} textAnchor={c.anchor} className="map-label">
                    {c.country}
                  </text>
                </g>
              )
            })}
            <circle cx={bkk.x} cy={bkk.y} r="46" fill="url(#hub)" className="map-hub-glow" />
            <circle cx={bkk.x} cy={bkk.y} r="7" className="map-hub" />
            <text x={bkk.x - 14} y={bkk.y + 4} textAnchor="end" className="map-label is-hub">
              Bangkok · II
            </text>
          </svg>
        </div>
      </div>
    </section>
  )
}
