import { clients } from '../content'

export default function Clients() {
  const half = Math.ceil(clients.length / 2)
  const rows = [clients.slice(0, half), clients.slice(half)]
  return (
    <section className="section clients" aria-labelledby="clients-title">
      <div className="container">
        <p className="eyebrow" id="clients-title">
          Trusted by 1,000+ manufacturers, including
        </p>
      </div>
      {rows.map((row, r) => (
        <div className={`marquee ${r ? 'is-reverse' : ''}`} key={r}>
          {/* The list is drawn twice so the loop is seamless; the copy is hidden from screen readers. */}
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1}>
              {row.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          ))}
        </div>
      ))}
    </section>
  )
}
