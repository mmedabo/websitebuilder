import { useEffect } from 'react'
import { ui, type Faq as FaqItem } from '../content'
import { track } from '../analytics'
import SectionHead from './SectionHead'

export default function Faq({ n, items, service }: { n: string; items: FaqItem[]; service: string }) {
  // #faq-2 (from quick search or a shared link) opens that answer and scrolls to it.
  useEffect(() => {
    const open = () => {
      const el = document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
      if (!(el instanceof HTMLDetailsElement) || !el.closest('#faq')) return
      el.open = true
      requestAnimationFrame(() => el.scrollIntoView({ block: 'center' }))
    }
    open()
    window.addEventListener('hashchange', open)
    return () => window.removeEventListener('hashchange', open)
  }, [])

  return (
    <section id="faq" className="section faq">
      <div className="container">
        <SectionHead n={n} label={ui.faqLabel} title={ui.faqTitle} />
        <div className="faq-list">
          {items.map((f, i) => (
            <details
              key={f.q}
              id={`faq-${i}`}
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
