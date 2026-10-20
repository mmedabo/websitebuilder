import { marks } from '../content'
import SectionHead from '../components/SectionHead'
import { useReveal } from '../hooks'

// Small fixed tilts so the stamps look hand-pressed, not generated.
const tilt = [-6, 4, -2, 7, -4, 3, -8, 5, -3, 6, -5]

export default function Marks() {
  const ref = useReveal<HTMLUListElement>()
  return (
    <section id="marks" className="section marks">
      <div className="container">
        <SectionHead n="03" label="Certification marks" title="Follow-up inspection for UL, DEMKO and DEKRA.">
          We inspect products and raw materials for the safety marks below. Because we work for several marks, we can
          combine many inspections in one factory visit and save you time.
        </SectionHead>

        <ul className="stamps reveal-stagger" ref={ref}>
          {marks.map((m, i) => (
            <li key={m.mark} className={i % 3 === 1 ? 'is-orange' : ''} style={{ ['--i' as string]: i, ['--tilt' as string]: `${tilt[i % tilt.length]}deg` }}>
              <span className={`stamp ${m.mark.length > 7 ? 'is-long' : ''}`}>
                <span className="stamp-mark">{m.mark}</span>
                <span className="stamp-region">{m.region}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
