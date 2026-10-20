import { company, timeline } from '../content'
import SectionHead from '../components/SectionHead'
import { useReveal } from '../hooks'

export default function Story() {
  const ref = useReveal<HTMLOListElement>()
  return (
    <section id="story" className="section story">
      <div className="container">
        <SectionHead
          kicker="Our story"
          title={
            <>
              From UL’s first partner in Thailand to <em>a region’s</em> inspection hub.
            </>
          }
        >
          {company.name} is a leading inspection company in Thailand. More than 1,000 clients, including
          many Fortune 500 companies, trust us with product safety inspection, commercial inspection,
          testing, BOI machine and scrap inspection, sourcing and advice.
        </SectionHead>

        <ol className="timeline reveal-stagger" ref={ref}>
          {timeline.map((t, i) => (
            <li key={t.title} style={{ ['--i' as string]: i }}>
              <span className="tl-year">{t.year}</span>
              <span className="tl-node" aria-hidden />
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
