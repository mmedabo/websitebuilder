import { whyUs } from '../content'
import { useReveal } from '../hooks'

export default function WhyUs() {
  const ref = useReveal<HTMLOListElement>()
  return (
    <section id="why" className="section why">
      <div className="container why-layout">
        <div className="why-head">
          <p className="eyebrow">Why II</p>
          <h2 className="h2">
            Integrity first. <em>Then</em> speed.
          </h2>
          <p className="lead">
            Offshore inspection is not as easy as it seems. Here is why more than 1,000 manufacturers chose a Thai
            team to do it.
          </p>
        </div>
        <ol className="why-list reveal-stagger" ref={ref}>
          {whyUs.map((w, i) => (
            <li key={w.title} style={{ ['--i' as string]: i }}>
              <span className="why-n">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
