import { lazy, Suspense, useEffect, useState } from 'react'
import { services, stats, yearsInService } from '../content'
import Glass from '../effects/Glass'
import { useInView, webglSupported } from '../hooks'
import { focusOrb, orb, releaseOrb } from '../state'
import CountUp from '../components/CountUp'

const HeroScene = lazy(() => import('../effects/HeroScene'))

export default function Hero({ still }: { still: boolean }) {
  const [ref, inView] = useInView<HTMLElement>('80px')
  const [gl] = useState(webglSupported)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const on = (e: PointerEvent) => {
      orb.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      orb.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', on, { passive: true })
    return () => window.removeEventListener('pointermove', on)
  }, [])

  const current = services.find((s) => s.id === active)

  return (
    <section id="top" className="hero" ref={ref}>
      <div className="hero-bg" aria-hidden>
        {gl && (
          <Suspense fallback={null}>
            <HeroScene active={inView} still={still} />
          </Suspense>
        )}
      </div>

      <div className="hero-inner container">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="dot" /> Third-party inspection · Bangkok · ASEAN
          </p>
          <h1 className="display">
            Quality,
            <br />
            <em>inspected</em> since 1989.
          </h1>
          <p className="lead">
            International Inspection (“II”) was Thailand’s first product-safety inspection company. For{' '}
            {yearsInService()} years our engineers have inspected for UL, DEMKO and DEKRA, for the Board of
            Investment, and to your own specifications in all ten ASEAN countries.
          </p>
          <div className="hero-ctas">
            <a className="btn" href="#contact">
              Request an inspection
            </a>
            <a className="btn btn-ghost" href="#services">
              Explore services
            </a>
          </div>

          <div className="hero-focus" onPointerLeave={() => { setActive(null); releaseOrb() }}>
            <p className="mono-label">Point at a service — the lens focuses</p>
            <ul>
              {services.map((s) => (
                <li key={s.id}>
                  <Glass
                    as="a"
                    href={`#svc-${s.id}`}
                    className={`chip ${active === s.id ? 'is-active' : ''}`}
                    radius={999}
                    strength={18}
                    onPointerEnter={() => { setActive(s.id); focusOrb(s.hue) }}
                    onFocus={() => { setActive(s.id); focusOrb(s.hue) }}
                    onBlur={() => { setActive(null); releaseOrb() }}
                  >
                    {s.title}
                  </Glass>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`orb-readout ${current ? 'is-on' : ''}`} aria-live="polite">
          <span className="mono-label">{current ? `Scanning · ${current.index}` : 'Lens idle'}</span>
          <strong>{current ? current.title : 'Ready to inspect'}</strong>
          <span className="readout-body">{current ? current.short : 'Product · Process · Machine · Supplier'}</span>
        </div>
      </div>

      <div className="hero-stats container">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <span className="stat-value">
              {s.format === 'year' ? s.value : <CountUp to={s.value} still={still} />}
              {s.suffix}
            </span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
      <a className="scroll-cue" href="#story" aria-label="Scroll to our story">
        <span />
      </a>
    </section>
  )
}
