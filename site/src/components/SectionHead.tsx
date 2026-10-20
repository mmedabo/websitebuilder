import type { ReactNode } from 'react'
import { useReveal } from '../hooks'

// Two-column head: a small numbered label on the left, heading and intro on the right.
export default function SectionHead({ n, label, title, children }: { n: string; label: string; title: ReactNode; children?: ReactNode }) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div className="section-head reveal" ref={ref}>
      <p className="label">
        <span className="label-n">{n}</span>
        {label}
      </p>
      <div>
        <h2 className="h2">{title}</h2>
        {children && <p className="lead">{children}</p>}
      </div>
    </div>
  )
}
