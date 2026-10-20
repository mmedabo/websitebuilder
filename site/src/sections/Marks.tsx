import { marks, representedBodies } from '../content'
import SectionHead from '../components/SectionHead'
import { useReveal } from '../hooks'

export default function Marks() {
  const ref = useReveal<HTMLDivElement>()
  const n = marks.length
  return (
    <section id="marks" className="section marks">
      <div className="container marks-layout">
        <div>
          <SectionHead
            kicker="Certification marks"
            title={
              <>
                Representative inspector for <em>UL, DEMKO</em> and <em>DEKRA</em>.
              </>
            }
          >
            We perform follow-up inspection for safety marks that open markets across five continents. Because we
            inspect for many marks, we can combine several inspections in one factory visit.
          </SectionHead>
          <ul className="bodies">
            {representedBodies.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>

        <div className="ring-stage reveal" ref={ref}>
          <ul className="ring" style={{ ['--n' as string]: n }}>
            {marks.map((m, i) => (
              <li key={m.mark} style={{ ['--i' as string]: i }}>
                <span className="ring-mark">{m.mark}</span>
                <span className="ring-region">{m.region}</span>
              </li>
            ))}
          </ul>
          <div className="ring-core" aria-hidden>
            <span>{n}+</span>
            <small>marks</small>
          </div>
        </div>
      </div>
    </section>
  )
}
