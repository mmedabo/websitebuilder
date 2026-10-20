import { lazy, Suspense, useEffect, useState } from 'react'
import { representedBodies, services, stats } from '../content'
import Glass from '../effects/Glass'
import { useInView, webglSupported } from '../hooks'
import { focusOrb, orb, releaseOrb } from '../state'
import CountUp from '../components/CountUp'
import type { Variant } from '../variant'

const HeroScene = lazy(() => import('../effects/HeroScene'))
const PhotoScene = lazy(() => import('../effects/PhotoScene'))

// Shown under the WebGL photo while it loads, and on its own without WebGL.
const PHOTO_FALLBACK = './img/bangkok-night-1600.jpg'

export default function Hero({ still, variant }: { still: boolean; variant: Variant }) {
  const photo = variant === 'photo'
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
  const focus = (id: string, hue: number) => {
    setActive(id)
    focusOrb(hue)
  }
  const release = () => {
    setActive(null)
    releaseOrb()
  }

  return (
    <section id="top" className={`hero ${photo ? 'is-photo' : ''}`} ref={ref}>
      <div className="hero-bg" aria-hidden style={photo ? { backgroundImage: `url(${PHOTO_FALLBACK})` } : undefined}>
        {gl && (
          <Suspense fallback={null}>
            {photo ? <PhotoScene active={inView} still={still} /> : <HeroScene active={inView} still={still} />}
          </Suspense>
        )}
      </div>
      {photo && <div className="hero-shade" aria-hidden />}

      <div className="hero-inner container">
        <h1 className="display">
          Quality is our <mark>priority.</mark>
        </h1>

        <div className="hero-grid">
          <p className="hero-intro">
            International Inspection (II) is a third-party inspection company in Bangkok. We started in 1989 as the
            representative of Underwriters Laboratories (UL) in Thailand. Today we inspect for UL, DEMKO and DEKRA,
            for the Board of Investment, and to your own specifications, in all ten ASEAN countries.
          </p>

          <div className="hero-actions">
            <a className="btn" href="#contact">
              Request an inspection
            </a>
            <a className="btn btn-line" href="#services">
              Our services
            </a>
            <p className="represents">
              Representative inspector for{' '}
              {representedBodies.map((b, i) => (
                <span key={b}>
                  <strong>{b}</strong>
                  {i < representedBodies.length - 2 ? ', ' : i === representedBodies.length - 2 ? ' and ' : ''}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="hero-focus" onPointerLeave={release}>
          <ul aria-label="Services">
            {services.map((s) => (
              <li key={s.id}>
                <Glass
                  as="a"
                  href={`#svc-${s.id}`}
                  className={`chip ${active === s.id ? 'is-active' : ''}`}
                  radius={6}
                  strength={14}
                  onPointerEnter={() => focus(s.id, s.hue)}
                  onFocus={() => focus(s.id, s.hue)}
                  onBlur={release}
                >
                  {s.title}
                </Glass>
              </li>
            ))}
          </ul>
          <p className={`orb-note ${current ? 'is-on' : ''}`} aria-live="polite">
            {current ? current.short : 'Point at a service to see what it covers.'}
          </p>
        </div>
      </div>

      <dl className="hero-stats container">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <dt>{s.label}</dt>
            <dd>
              {s.format === 'year' ? s.value : <CountUp to={s.value} still={still} />}
              {s.suffix}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
