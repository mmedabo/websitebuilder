import { clients } from '../content'

export default function Clients() {
  return (
    <section className="clients" aria-labelledby="clients-title">
      <div className="container clients-layout">
        <h2 id="clients-title" className="clients-title">
          Selected clients
          <small>from more than 1,000 manufacturers</small>
        </h2>
        <ul className="client-list">
          {clients.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
