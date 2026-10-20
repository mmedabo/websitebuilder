import type { ReactNode } from 'react'
import { useReveal } from '../hooks'

export default function SectionHead({ kicker, title, children }: { kicker: string; title: ReactNode; children?: ReactNode }) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div className="section-head reveal" ref={ref}>
      <p className="eyebrow">{kicker}</p>
      <h2 className="h2">{title}</h2>
      {children && <p className="lead">{children}</p>}
    </div>
  )
}
