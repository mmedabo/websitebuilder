import type { ReactNode } from 'react'
import type { Step } from '../content'
import SectionHead from './SectionHead'
import { useReveal } from '../hooks'

export default function BookingSteps({ n, steps, title, children }: { n: string; steps: Step[]; title: string; children?: ReactNode }) {
  const ref = useReveal<HTMLOListElement>()
  return (
    <section id="booking" className="section booking">
      <div className="container">
        <SectionHead n={n} label="How booking works" title={title}>
          {children}
        </SectionHead>
        <ol className="steps reveal-stagger" ref={ref}>
          {steps.map((s, i) => (
            <li key={s.title} style={{ ['--i' as string]: i }}>
              <span className="step-n">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
