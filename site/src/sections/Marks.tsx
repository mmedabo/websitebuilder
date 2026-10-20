import { marks, ui } from '../content'
import SectionHead from '../components/SectionHead'
import { useReveal } from '../hooks'

// Small fixed tilts so the cards look pinned by hand, not generated.
const tilt = [-6, 4, -2, 7, -4, 3, -8, 5, -3, 6, -5]

export default function Marks({ n = '03' }: { n?: string }) {
  const ref = useReveal<HTMLUListElement>()
  return (
    <section id="marks" className="section marks">
      <div className="container">
        <SectionHead n={n} label={ui.marksLabel} title={ui.marksTitle}>
          {ui.marksLead}
        </SectionHead>

        <ul className="stamps reveal-stagger" ref={ref}>
          {marks.map((m, i) => (
            <li key={m.mark} style={{ ['--i' as string]: i, ['--tilt' as string]: `${tilt[i % tilt.length] / 3}deg` }}>
              <figure className="mark-card">
                <span className="mark-img">
                  {m.img ? <img src={m.img} alt={`${m.mark} mark`} loading="lazy" decoding="async" /> : <span className="mark-text">{m.mark}</span>}
                </span>
                <figcaption>
                  <strong>{m.mark}</strong>
                  <span>{m.region}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
