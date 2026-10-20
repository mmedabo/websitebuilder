import { useEffect, useState } from 'react'
import { boiSteps } from '../content'
import FoldChain from '../effects/FoldChain'
import { useScrollProgress } from '../hooks'

const ease = (t: number) => 1 - Math.pow(1 - t, 3)

export default function BoiProcess({ still }: { still: boolean }) {
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

  const panels = boiSteps.map((s) => (
    <article className="fold-card" key={s.n}>
      <span className="fold-n">{s.n}</span>
      <h3>{s.title}</h3>
      <p>{s.body}</p>
    </article>
  ))

  return (
    <section id="boi" className={`boi ${vertical ? 'is-vertical' : ''}`} ref={ref}>
      <div className="boi-sticky">
        <div className="container boi-head">
          <p className="eyebrow">BOI machine &amp; scrap inspection</p>
          <h2 className="h2">
            Your scrap write-off, <em>unfolded</em> in four steps.
          </h2>
          <p className="lead">
            Projects with Board of Investment privileges must certify scrap and used imported machinery. Without it,
            leftover raw materials stay in your stock account, and import duty becomes due when the privilege ends.
          </p>
        </div>
        <FoldChain panels={panels} angle={angle} vertical={vertical} />
        <div className="container boi-foot">
          <div className="boi-meter" aria-hidden>
            <span style={{ transform: `scaleX(${t})` }} />
          </div>
          <p>
            <strong>Used machinery:</strong> we certify refurbishment or remaining life, year of manufacture, test-run
            results, and environmental and safety impact. Certificates are issued in 1–2 weeks.
          </p>
        </div>
      </div>
    </section>
  )
}
