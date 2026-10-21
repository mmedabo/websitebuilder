import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import CountUp from '../components/CountUp'
import { boiSteps, bookingSteps, clientLogos, company, countries, locale, marks, services, stats, ui } from '../content'
import { track } from '../analytics'
import { pageHref } from '../routing'

// Presentation mode: the site's own content as a full-screen deck for II's
// sales meetings. Arrow keys, space, swipe or the buttons move; F toggles
// full screen.
type Slide = { tone: 'paper' | 'blue' | 'ink' | 'yellow'; body: ReactNode }

const BASE = import.meta.env.BASE_URL

export default function PresentPage({ still }: { still: boolean }) {
  const p = locale.present
  const deckRef = useRef<HTMLDivElement>(null)
  const [i, setI] = useState(0)
  const touch = useRef<number | null>(null)

  const slides: Slide[] = [
    {
      tone: 'paper',
      body: (
        <div className="ps-cover">
          <img src={`${BASE}img/ii-logo.png`} alt={company.name} width={180} height={167} />
          <h1 className="display">
            {ui.heroTitle}
            <mark>{ui.heroMark}</mark>
          </h1>
          <p className="ps-sub">
            {company.name} · {p.since}
          </p>
        </div>
      ),
    },
    {
      tone: 'blue',
      body: (
        <>
          <p className="ps-label">{ui.aboutLabel}</p>
          <h2 className="ps-title">{ui.aboutTitle}</h2>
          <dl className="ps-stats">
            {stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>
                  {s.format === 'year' ? s.value : <CountUp to={s.value} still={still} />}
                  {s.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </>
      ),
    },
    {
      tone: 'paper',
      body: (
        <>
          <p className="ps-label">{ui.clientsTitle}</p>
          <h2 className="ps-title">{ui.clientsHeading}</h2>
          <ul className="ps-logos">
            {clientLogos.map((c) => (
              <li key={c.name}>
                <img src={c.logo} alt={c.name} />
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      tone: 'ink',
      body: (
        <>
          <p className="ps-label">{ui.servicesLabel}</p>
          <h2 className="ps-title">{ui.servicesTitle}</h2>
          <ol className="ps-cards">
            {services.map((s) => (
              <li key={s.id}>
                <span className="ps-n">{s.index}</span>
                <strong>{s.title}</strong>
                <span>{s.short}</span>
              </li>
            ))}
          </ol>
        </>
      ),
    },
    {
      tone: 'paper',
      body: (
        <>
          <p className="ps-label">{ui.marksLabel}</p>
          <h2 className="ps-title">{ui.marksTitle}</h2>
          <ul className="ps-marks">
            {marks
              .filter((m) => m.img)
              .map((m) => (
                <li key={m.mark}>
                  <img src={m.img} alt={m.mark} />
                  <span>{m.mark}</span>
                </li>
              ))}
          </ul>
        </>
      ),
    },
    {
      tone: 'yellow',
      body: (
        <>
          <p className="ps-label">{ui.coverageLabel}</p>
          <h2 className="ps-title">{ui.coverageTitle}</h2>
          <ul className="ps-countries">
            {countries.map((c) => (
              <li key={c.value} className={c.value === 'Thailand' ? 'is-home' : ''}>
                {c.label}
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      tone: 'blue',
      body: (
        <>
          <p className="ps-label">{ui.boiLabel}</p>
          <h2 className="ps-title">{ui.boiTitle}</h2>
          <ol className="ps-steps">
            {boiSteps.map((s) => (
              <li key={s.n}>
                <span className="ps-n">{s.n}</span>
                <strong>{s.title}</strong>
                <span>{s.body}</span>
              </li>
            ))}
          </ol>
        </>
      ),
    },
    {
      tone: 'paper',
      body: (
        <>
          <p className="ps-label">{ui.whyLabel}</p>
          <h2 className="ps-title">{ui.whyTitle}</h2>
          <ol className="ps-list">
            {locale.whyUs.map((w, k) => (
              <li key={w.title}>
                <span className="ps-n">{String(k + 1).padStart(2, '0')}</span>
                <strong>{w.title}</strong>
              </li>
            ))}
          </ol>
        </>
      ),
    },
    {
      tone: 'ink',
      body: (
        <>
          <p className="ps-label">{ui.bookingLabel}</p>
          <h2 className="ps-title">{ui.bookingTitle}</h2>
          <ol className="ps-steps is-five">
            {bookingSteps.map((s, k) => (
              <li key={s.title}>
                <span className="ps-n">{k + 1}</span>
                <strong>{s.title}</strong>
              </li>
            ))}
          </ol>
        </>
      ),
    },
    {
      tone: 'yellow',
      body: (
        <div className="ps-contact">
          <p className="ps-label">{ui.contactLabel}</p>
          <h2 className="ps-title">{ui.contactTitle}</h2>
          <p className="ps-big">{company.email}</p>
          <p className="ps-big">{company.phones.map((x) => x.label).join(' · ')}</p>
          <address>
            <strong>{company.name}</strong>
            {company.address.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </address>
        </div>
      ),
    },
  ]
  const n = slides.length

  const go = useCallback((to: number) => setI(Math.max(0, Math.min(n - 1, to))), [n])
  const fullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else deckRef.current?.requestFullscreen?.().catch(() => {})
  }

  useEffect(() => {
    track('present_open')
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) (e.preventDefault(), setI((x) => Math.min(n - 1, x + 1)))
      else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) (e.preventDefault(), setI((x) => Math.max(0, x - 1)))
      else if (e.key === 'Home') setI(0)
      else if (e.key === 'End') setI(n - 1)
      else if (e.key.toLowerCase() === 'f') fullscreen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [n])

  return (
    <div
      className={`deck tone-${slides[i].tone}`}
      ref={deckRef}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return
        const dx = e.changedTouches[0].clientX - touch.current
        if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1))
        touch.current = null
      }}
    >
      {slides.map((s, k) => (
        <section
          key={k}
          className={`slide tone-${s.tone} ${k === i ? 'is-on' : k < i ? 'is-past' : ''}`}
          aria-hidden={k !== i}
          aria-roledescription="slide"
          aria-label={`${k + 1} / ${n}`}
        >
          <div className="slide-inner">{s.body}</div>
        </section>
      ))}

      <div className="deck-bar">
        <a className="deck-btn" href={pageHref('')}>
          ← {p.exit}
        </a>
        <span className="deck-count" aria-live="polite">
          {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
        </span>
        <span className="deck-hint">{p.hint}</span>
        <button className="deck-btn" onClick={() => go(i - 1)} disabled={i === 0} aria-label={p.prev}>
          ←
        </button>
        <button className="deck-btn" onClick={() => go(i + 1)} disabled={i === n - 1} aria-label={p.next}>
          →
        </button>
        <button className="deck-btn" onClick={fullscreen}>
          {p.fullscreen}
        </button>
      </div>
      <div className="deck-progress" aria-hidden>
        <span style={{ transform: `scaleX(${(i + 1) / n})` }} />
      </div>
    </div>
  )
}
