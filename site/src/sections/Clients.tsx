import { clientLogos, otherClients, ui } from '../content'
import { useReveal } from '../hooks'

// Client logos from the "Our Clients" slideshow on II's home page, shown
// together in one grid, then the other clients II names in its text, in a
// strip that moves left to right in a loop.
export default function Clients() {
  const ref = useReveal<HTMLUListElement>()
  return (
    <section id="clients" className="section clients" aria-labelledby="clients-title">
      <div className="container">
        <div className="section-head">
          <p className="label">{ui.clientsTitle}</p>
          <div>
            <h2 id="clients-title" className="h2">
              {ui.clientsHeading}
            </h2>
            <p className="lead">{ui.clientsLead}</p>
          </div>
        </div>
        <ul className="client-logos reveal-stagger" ref={ref}>
          {clientLogos.map((c, i) => (
            <li key={c.name} style={{ ['--i' as string]: i }}>
              <img src={c.logo} alt={c.name} loading="lazy" decoding="async" />
            </li>
          ))}
        </ul>
        <div className="client-more">
          <p className="client-more-label">{ui.clientsAlso}</p>
          {/* Two copies so the loop has no gap; the copy is hidden from screen readers. */}
          <div className="client-marquee">
            <ul className="client-track">
              {[...otherClients, ...otherClients].map((name, i) => (
                <li key={i} aria-hidden={i >= otherClients.length || undefined} className={i >= otherClients.length ? 'is-copy' : ''}>
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
