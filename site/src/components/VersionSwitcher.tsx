import { ui } from '../content'
import type { Variant } from '../variant'

const options: { id: Variant; letter: string; label: string }[] = [
  { id: 'shader', letter: 'A', label: ui.versionA },
  { id: 'photo', letter: 'B', label: ui.versionB },
]

// Review-only control: switches the hero between the two proposed versions.
export default function VersionSwitcher({ variant, onChange }: { variant: Variant; onChange: (v: Variant) => void }) {
  return (
    <div className="switcher" role="radiogroup" aria-label={ui.reviewAria}>
      <span className="switcher-label">{ui.review}</span>
      {options.map((o) => (
        <button key={o.id} role="radio" aria-checked={variant === o.id} aria-label={o.label} title={o.label} onClick={() => onChange(o.id)}>
          <strong>{o.letter}</strong>
          <span className="switcher-text">{o.label}</span>
        </button>
      ))}
    </div>
  )
}
