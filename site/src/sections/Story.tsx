import { timeline } from '../content'
import SectionHead from '../components/SectionHead'
import { useReveal } from '../hooks'

export default function Story() {
  const ref = useReveal<HTMLOListElement>()
  return (
    <section id="about" className="section story">
      <div className="container">
        <SectionHead n="01" label="About II" title="A Thai inspection company with an international standard.">
          II provides product safety inspection, commercial inspection, testing, BOI machine and scrap inspection,
          sourcing and advice. More than 1,000 clients trust us, including Sony, Whirlpool, Dell, Samsung, General
          Electric, Honeywell and 3M.
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
