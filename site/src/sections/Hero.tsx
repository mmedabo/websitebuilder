import { lazy, Suspense, useEffect, useState } from 'react'
import { locale, representedBodies, services, stats, ui } from '../content'
import { openFinder } from '../components/ServiceFinder'
import Glass from '../effects/Glass'
import { useInView, webglSupported } from '../hooks'
import { focusOrb, orb, releaseOrb } from '../state'
import CountUp from '../components/CountUp'
import { serviceHref } from '../routing'
import type { Variant } from '../variant'

const HeroScene = lazy(() => import('../effects/HeroScene'))
const PhotoScene = lazy(() => import('../effects/PhotoScene'))

// Shown under the WebGL photo while it loads, and on its own without WebGL.
const PHOTO_FALLBACK = `${import.meta.env.BASE_URL}img/bangkok-night-1600.jpg`

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
          {ui.heroTitle}
          <mark>{ui.heroMark}</mark>
        </h1>

        <div className="hero-grid">
          <p className="hero-intro">{ui.heroIntro}</p>

          <div className="hero-actions">
            <a className="btn" href="#contact">
              {ui.heroRequest}
            </a>
            <a className="btn btn-line" href="#services">
              {ui.heroServices}
            </a>
            <button className="finder-cta" onClick={openFinder}>
              <span className="finder-cta-dot" aria-hidden>
                ?
              </span>
              {locale.finder.open}
            </button>
            <p className="represents">
              {ui.represents}{' '}
              {representedBodies.map((b, i) => (
                <span key={b}>
                  <strong>{b}</strong>
                  {i < representedBodies.length - 2 ? ui.listSep : i === representedBodies.length - 2 ? ui.and : ''}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="hero-focus" onPointerLeave={release}>
          <ul aria-label={ui.servicesAria}>
            {services.map((s) => (
              <li key={s.id}>
                <Glass
                  as="a"
                  href={serviceHref(s.id)}
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
            {current ? current.short : ui.orbHint}
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
