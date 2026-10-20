import type { CSSProperties, ReactNode } from 'react'

// Screen-fold illusion: each panel is nested inside the previous one and
// hinged on its far edge, so one angle folds the whole strip like paper.
type Props = {
  panels: ReactNode[]
  angle: number // degrees; 0 = flat
  vertical: boolean
}

function Panel({ panels, i, angle, vertical }: Props & { i: number }) {
  const a = i === 0 ? angle : (i % 2 ? -2 : 2) * angle
  let rot = vertical ? `rotateX(${-a}deg)` : `rotateY(${a}deg)`
  if (i === 0) {
    // Folding shortens the strip; shift the root to keep it centred.
    const shift = (panels.length * (1 - Math.cos((angle * Math.PI) / 180))) / 2
    rot = (vertical ? `translateY(calc(var(--ph) * ${shift}))` : `translateX(calc(var(--pw) * ${shift}))`) + ' ' + rot
  }
  // Panels that face away from the light get darker as the fold deepens.
  const facing = i % 2 === 0 ? 1 : -1
  const shade = Math.sin((Math.abs(angle) * Math.PI) / 180)
  const style: CSSProperties = {
    transform: rot,
    ['--shade' as string]: facing > 0 ? shade * 0.15 : shade * 0.6,
    ['--gloss' as string]: facing > 0 ? shade * 0.35 : 0,
  }
  return (
    <div className={`fold-panel ${i === 0 ? 'is-root' : ''}`} style={style}>
      <div className="fold-face">{panels[i]}</div>
      {i + 1 < panels.length && <Panel panels={panels} i={i + 1} angle={angle} vertical={vertical} />}
    </div>
  )
}

export default function FoldChain(props: Props) {
  return (
    <div className={`fold-stage ${props.vertical ? 'is-vertical' : ''}`}>
      <Panel {...props} i={0} />
    </div>
  )
}
