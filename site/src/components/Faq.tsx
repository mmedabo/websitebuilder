import type { Faq as FaqItem } from '../content'
import { track } from '../analytics'
import SectionHead from './SectionHead'

export default function Faq({ n, items, service }: { n: string; items: FaqItem[]; service: string }) {
  return (
    <section id="faq" className="section faq">
      <div className="container">
        <SectionHead n={n} label="Questions" title="Frequently asked questions." />
        <div className="faq-list">
          {items.map((f) => (
            <details
              key={f.q}
              onToggle={(e) => (e.currentTarget as HTMLDetailsElement).open && track('faq_open', { service, question: f.q })}
            >
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
