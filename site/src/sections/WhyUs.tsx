import { ui, whyUs } from '../content'
import SectionHead from '../components/SectionHead'
import { useReveal } from '../hooks'

export default function WhyUs({ n = '07' }: { n?: string }) {
  const ref = useReveal<HTMLOListElement>()
  return (
    <section id="why" className="section why">
      <div className="container">
        <SectionHead n={n} label={ui.whyLabel} title={ui.whyTitle}>
          {ui.whyLead}
        </SectionHead>
        <ol className="why-list reveal-stagger" ref={ref}>
          {whyUs.map((w, i) => (
            <li key={w.title} style={{ ['--i' as string]: i }}>
              <span className="why-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{w.title}</h3>
              <p>{w.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
