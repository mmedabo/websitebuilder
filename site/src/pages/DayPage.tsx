import { useEffect, useRef, useState } from 'react'
import { locale, ui } from '../content'
import { openFinder } from '../components/ServiceFinder'
import { pageHref } from '../routing'

// "A day with an II inspector": a scroll story. The stages scroll past on the
// right; the inspection record on the left fills in, row by row, with a
// camera flash for the photo evidence and a stamp for the report.
export default function DayPage() {
  const d = locale.day
  const [active, setActive] = useState(0)
  const stagesRef = useRef<HTMLOListElement>(null)

  // The stage nearest the middle of the screen is the active one.
  useEffect(() => {
    const items = [...(stagesRef.current?.children ?? [])] as HTMLElement[]
    const pick = () => {
      const mid = window.innerHeight * 0.5
      let best = 0
      let dist = Infinity
      items.forEach((el, i) => {
        const r = el.getBoundingClientRect()
        const dd = Math.abs(r.top + r.height / 2 - mid)
        if (dd < dist) (dist = dd), (best = i)
      })
      setActive(best)
    }
    pick()
    window.addEventListener('scroll', pick, { passive: true })
    window.addEventListener('resize', pick)
    return () => {
      window.removeEventListener('scroll', pick)
      window.removeEventListener('resize', pick)
    }
  }, [])

  const evidence = d.stages.length - 2
  const report = d.stages.length - 1

  return (
    <>
      <section className="section day-hero">
        <div className="container">
          <nav className="crumbs is-dark" aria-label={ui.crumbsAria}>
            <a href={pageHref('')}>{ui.crumbHome}</a>
            <span aria-hidden>/</span>
            <span aria-current="page">{d.label}</span>
          </nav>
          <h1 className="page-title">{d.title}</h1>
          <p className="lead">{d.lead}</p>
        </div>
      </section>

      <section className="day-story">
        <div className="container day-layout">
          <div className="day-sheet-wrap">
            <figure className={`day-sheet ${active >= evidence ? 'has-photos' : ''}`} aria-label={d.sheet}>
              <figcaption>
                <span>{d.sheet}</span>
                <span className="sheet-no">II · {String(active + 1).padStart(2, '0')}/{String(d.stages.length).padStart(2, '0')}</span>
              </figcaption>
              <ol>
                {d.rows.map((r, i) => (
                  <li key={r} className={i < active ? 'is-done' : i === active ? 'is-now' : ''}>
                    <span className="sheet-box" aria-hidden>
                      {i <= active ? '✓' : ''}
                    </span>
                    <span className="sheet-label">{r}</span>
                    <span className="sheet-value">{i <= active ? d.stages[i].title : ''}</span>
                  </li>
                ))}
              </ol>
              <div className="sheet-photos" aria-hidden>
                <span />
                <span />
                <span />
              </div>
              {active === evidence && <span key="flash" className="sheet-flash" aria-hidden />}
              <span className={`sheet-stamp ${active === report ? 'is-on' : ''}`} aria-hidden={active !== report}>
                {d.stamp}
              </span>
            </figure>
          </div>

          <ol className="day-stages" ref={stagesRef}>
            {d.stages.map((s, i) => (
              <li key={s.title} className={i === active ? 'is-active' : ''}>
                <span className="stage-tag">
                  {String(i + 1).padStart(2, '0')} · {s.tag}
                </span>
                <h2 className="h2">{s.title}</h2>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="guide-cta">
        <div className="container guide-cta-inner">
          <h2 className="h3">{d.stages[report].title}</h2>
          <div className="svc-actions">
            <a className="btn btn-yellow" href={pageHref('#contact')}>
              {d.cta}
            </a>
            <button className="finder-cta" onClick={openFinder}>
              <span className="finder-cta-dot" aria-hidden>
                ?
              </span>
              {locale.finder.open}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
