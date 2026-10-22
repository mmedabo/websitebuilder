import { ui, whyUs } from '../content'
import SectionHead from '../components/SectionHead'
import { useReveal } from '../hooks'

// Line icons in the order of the list: first Thai company, engineers,
// quality to procedure, customer service around the clock, time and cost saved. 48 x 48.
const ICONS = [
  <>
    <circle cx="24" cy="19" r="12" />
    <path d="M17 29l-4 15 6-3 3 5 2-8M31 29l4 15-6-3-3 5-2-8M21.5 15l3-2v13" />
  </>,
  <>
    <path d="M13 22a11 11 0 0 1 22 0M10 22h28M24 11v5" />
    <path d="M15 22c0 6 4 10 9 10s9-4 9-10" />
    <path d="M9 46c1-7 7-11 15-11s14 4 15 11" />
  </>,
  <>
    <path d="M14 9h20v35H14zM20 9V6h8v3" />
    <path d="M19 27l4 4 7-8" />
  </>,
  <>
    <path d="M10 27v-3a14 14 0 0 1 28 0v3" />
    <path d="M10 26h5v11h-5zM33 26h5v11h-5zM38 37c0 5-4 7-11 7h-3" />
  </>,
  <>
    <circle cx="24" cy="27" r="15" />
    <path d="M20 6h8M24 6v6M24 27l6-6M36 13l3-3" />
  </>,
]

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
              <svg viewBox="0 0 48 48" className="why-icon" aria-hidden>
                {ICONS[i]}
              </svg>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
