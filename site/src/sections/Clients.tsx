import ClientTile from '../components/ClientTile'
import { clients, ui } from '../content'

export default function Clients() {
  return (
    <section className="clients" aria-labelledby="clients-title">
      <div className="container clients-layout">
        <h2 id="clients-title" className="clients-title">
          {ui.clientsTitle}
          <small>{ui.clientsSmall}</small>
        </h2>
        <ul className="client-list">
          {clients.map((c) => (
            <li key={c.name}>
              <ClientTile c={c} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
