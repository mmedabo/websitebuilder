import { clientLogos, otherClients, ui } from '../content'
import { useReveal } from '../hooks'

// Client logos from the "Our Clients" slideshow on II's home page, shown
// together in one grid, then the other clients II names in its text.
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
        <p className="client-others">
          <strong>{ui.clientsAlso}</strong> {otherClients.join(ui.listSep)}
        </p>
      </div>
    </section>
  )
}
