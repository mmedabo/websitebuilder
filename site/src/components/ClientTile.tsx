import type { clients } from '../content'

// One client: the logo where II's site has one, otherwise the name.
export default function ClientTile({ c }: { c: (typeof clients)[number] }) {
  return (
    <span className={`client-tile ${c.logo ? 'has-logo' : ''}`}>
      {c.logo ? <img src={c.logo} alt={c.name} loading="lazy" decoding="async" /> : c.name}
    </span>
  )
}
