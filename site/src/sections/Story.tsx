import { timeline, ui } from '../content'
import SectionHead from '../components/SectionHead'
import { useReveal } from '../hooks'

export default function Story() {
  const ref = useReveal<HTMLOListElement>()
  return (
    <section id="about" className="section story">
      <div className="container">
        <SectionHead n="01" label={ui.aboutLabel} title={ui.aboutTitle}>
          {ui.aboutLead}
        </SectionHead>

        <ol className="timeline reveal-stagger" ref={ref}>
          {timeline.map((t, i) => (
            <li key={t.title} style={{ ['--i' as string]: i }}>
              <span className="tl-year">{t.year}</span>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
