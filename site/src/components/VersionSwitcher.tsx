import type { Variant } from '../variant'

const options: { id: Variant; letter: string; label: string }[] = [
  { id: 'shader', letter: 'A', label: 'Shader + orb' },
  { id: 'photo', letter: 'B', label: 'Bangkok photo' },
]

// Review-only control: switches the hero between the two proposed versions.
export default function VersionSwitcher({ variant, onChange }: { variant: Variant; onChange: (v: Variant) => void }) {
  return (
    <div className="switcher" role="radiogroup" aria-label="Design version for review">
      <span className="switcher-label">Review</span>
      {options.map((o) => (
        <button key={o.id} role="radio" aria-checked={variant === o.id} onClick={() => onChange(o.id)}>
          <strong>{o.letter}</strong>
          {o.label}
        </button>
      ))}
    </div>
  )
}
