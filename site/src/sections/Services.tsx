import type { PointerEvent as RPointerEvent } from 'react'
import { services } from '../content'
import Glass from '../effects/Glass'
import SectionHead from '../components/SectionHead'
import { useReveal } from '../hooks'
import { serviceHref } from '../routing'

function tilt(e: RPointerEvent<HTMLElement>) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  el.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`)
  el.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`)
  el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`)
  el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`)
}

function untilt(e: RPointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty('--rx', '0deg')
  e.currentTarget.style.setProperty('--ry', '0deg')
}

// Blueprint backdrop: gives the glass cards something to refract.
export function Blueprint() {
  return (
    <div className="blueprint" aria-hidden>
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <g className="bp-lines">
          <circle cx="930" cy="250" r="190" />
          <circle cx="930" cy="250" r="120" />
          <line x1="700" y1="250" x2="1160" y2="250" />
          <line x1="930" y1="20" x2="930" y2="480" />
          <rect x="80" y="470" width="420" height="250" />
          <line x1="80" y1="740" x2="500" y2="740" />
          <line x1="80" y1="730" x2="80" y2="750" />
          <line x1="500" y1="730" x2="500" y2="750" />
          <path d="M560 700 L760 560 L980 640 L1140 520" />
        </g>
        <text x="290" y="768" className="bp-text">420.00</text>
        <text x="1128" y="242" className="bp-text">Ø 380</text>
      </svg>
    </div>
  )
}

export default function Services() {
  const grid = useReveal<HTMLDivElement>()

  return (
    <section id="services" className="section services">
      <Blueprint />
      <div className="container">
        <SectionHead n="02" label="Services" title="What we do for manufacturers, importers and investors.">
          Choose a service to see what it includes, how booking works and the common questions. Every inspection ends
          with a detailed report within 24 hours.
        </SectionHead>

        <div className="svc-grid reveal-stagger" ref={grid}>
          {services.map((s, i) => (
            <Glass
              key={s.id}
              as="a"
              href={serviceHref(s.id)}
              id={`svc-${s.id}`}
              className={`svc-card ${i === 0 ? 'is-wide' : ''}`}
              radius={8}
              style={{ ['--i' as string]: i }}
              onPointerMove={tilt}
              onPointerLeave={untilt}
            >
              <span className="svc-index">{s.index}</span>
              <span className="svc-title">{s.title}</span>
              <span className="svc-short">{s.short}</span>
              <span className="svc-more">
                Details <span aria-hidden>→</span>
              </span>
            </Glass>
          ))}
        </div>
      </div>
    </section>
  )
}
