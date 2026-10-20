import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react'
import { services, type Service } from '../content'
import Glass from '../effects/Glass'
import SectionHead from '../components/SectionHead'
import { useReveal } from '../hooks'

function tilt(e: RPointerEvent<HTMLElement>) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  el.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`)
  el.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`)
  el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`)
  el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`)
}

function untilt(e: RPointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty('--rx', '0deg')
  e.currentTarget.style.setProperty('--ry', '0deg')
}

function Drawer({ service, onClose, onRequest }: { service: Service; onClose: () => void; onRequest: (id: string) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.classList.add('no-scroll')
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('no-scroll')
    }
  }, [onClose])

  return (
    <div className="drawer-scrim" onClick={onClose}>
      <Glass
        as="aside"
        className="drawer"
        radius={28}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        <button ref={closeRef} className="drawer-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <p className="eyebrow">Service {service.index}</p>
        <h3 id="drawer-title" className="h3">
          {service.title}
        </h3>
        <p className="drawer-lead">{service.lead}</p>

        <h4 className="mono-label">What we provide</h4>
        <ul className="check-list">
          {service.provide.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>

        <h4 className="mono-label">The benefits of working with II</h4>
        <div className="benefits">
          {service.benefits.map((b) => (
            <div key={b.title}>
              <strong>{b.title}</strong>
              <p>{b.body}</p>
            </div>
          ))}
        </div>

        <div className="drawer-foot">
          <span>
            Call <a href="tel:+6627114934">+66 2711 4934</a> · ext. <strong>{service.ext}</strong>
          </span>
          <button className="btn" onClick={() => onRequest(service.id)}>
            Request this service
          </button>
        </div>
      </Glass>
    </div>
  )
}

export default function Services({ onRequest }: { onRequest: (id: string) => void }) {
  const [open, setOpen] = useState<Service | null>(null)
  const close = useCallback(() => setOpen(null), [])
  const grid = useReveal<HTMLDivElement>()

  return (
    <section id="services" className="section services">
      <div className="blob-field" aria-hidden>
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
      </div>
      <div className="container">
        <SectionHead
          kicker="Services"
          title={
            <>
              Five services. <em>One</em> trusted inspector.
            </>
          }
        >
          Find the right service and see how it meets your needs. Every inspection ends with a detailed report within
          24 hours.
        </SectionHead>

        <div className="svc-grid reveal-stagger" ref={grid}>
          {services.map((s, i) => (
            <Glass
              key={s.id}
              as="button"
              id={`svc-${s.id}`}
              className={`svc-card ${i === 0 ? 'is-wide' : ''}`}
              radius={28}
              style={{ ['--i' as string]: i, ['--hue' as string]: Math.round(s.hue * 360) }}
              onPointerMove={tilt}
              onPointerLeave={untilt}
              onClick={() => setOpen(s)}
              aria-haspopup="dialog"
            >
              <span className="svc-index">{s.index}</span>
              <span className="svc-title">{s.title}</span>
              <span className="svc-short">{s.short}</span>
              <span className="svc-more">
                Explore <span aria-hidden>→</span>
              </span>
            </Glass>
          ))}
        </div>
      </div>

      {open && (
        <Drawer
          service={open}
          onClose={close}
          onRequest={(id) => {
            setOpen(null)
            onRequest(id)
          }}
        />
      )}
    </section>
  )
}
