import { useEffect, useState } from 'react'
import { boiSteps, ui } from '../content'
import FoldChain from '../effects/FoldChain'
import { useScrollProgress } from '../hooks'
import { pageHref } from '../routing'

const ease = (t: number) => 1 - Math.pow(1 - t, 3)

export default function BoiProcess({ still, n = '05' }: { still: boolean; n?: string }) {
  const [vertical, setVertical] = useState(() => window.innerWidth < 860)
  // Wide screens pin the section and unfold while it scrolls; narrow
  // screens are too short to pin four panels, so they unfold on entry.
  const [ref, p] = useScrollProgress<HTMLElement>(vertical ? 'enter' : 'sticky')

  useEffect(() => {
    const on = () => setVertical(window.innerWidth < 860)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])

  // Pinned: closed at the start, fully open by 70% of the scroll.
  const t = vertical ? ease(p) : ease(Math.min(1, Math.max(0, (p - 0.04) / 0.66)))
  const angle = still ? 0 : (1 - t) * 78

  const panels = boiSteps.map((s, i) => (
    <article className={`fold-card tone-${i + 1}`} key={s.n}>
      <span className="fold-n">{s.n}</span>
      <h3>{s.title}</h3>
      <p>{s.body}</p>
    </article>
  ))

  return (
    <section id="boi" className={`boi ${vertical ? 'is-vertical' : ''}`} ref={ref}>
      <div className="boi-sticky">
        <div className="container section-head boi-head">
          <p className="label">
            <span className="label-n">{n}</span>
            {ui.boiLabel}
          </p>
          <div>
            <h2 className="h2">{ui.boiTitle}</h2>
            <p className="lead">{ui.boiLead}</p>
          </div>
        </div>
        <FoldChain panels={panels} angle={angle} vertical={vertical} />
        <div className="container boi-foot">
          <div className="boi-meter" aria-hidden>
            <span style={{ transform: `scaleX(${t})` }} />
          </div>
          <p>
            <strong>{ui.boiMachineryStrong}</strong> {ui.boiMachinery}{' '}
            <a className="link" href={pageHref('guides/boi-scrap-write-off/')}>
              {ui.footerGuide} →
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
