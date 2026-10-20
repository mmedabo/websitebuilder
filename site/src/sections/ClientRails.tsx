import ClientTile from '../components/ClientTile'
import { clients } from '../content'

// Clients in the hero. Wide screens: a slow vertical rail in the empty space
// on each side of the page. Narrower screens: one horizontal strip under the
// stats. Decorative repeat of the Clients section, so hidden from screen readers.
const ordered = [...clients.filter((c) => c.logo), ...clients.filter((c) => !c.logo)]
const left = ordered.filter((_, i) => i % 2 === 0)
const right = ordered.filter((_, i) => i % 2 === 1)

function Track({ items, className }: { items: typeof clients; className: string }) {
  // Two copies, so the loop has no gap when the first copy scrolls out.
  return (
    <div className={`client-marquee ${className}`} aria-hidden>
      <div className="client-track">
        {[...items, ...items].map((c, i) => (
          <ClientTile key={i} c={c} />
        ))}
      </div>
    </div>
  )
}

export default function ClientRails() {
  return (
    <>
      <Track items={left} className="client-rail is-left" />
      <Track items={right} className="client-rail is-right" />
      <Track items={ordered} className="client-strip" />
    </>
  )
}
