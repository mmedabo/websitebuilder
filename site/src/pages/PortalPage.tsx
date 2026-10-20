import { useState } from 'react'
import { locale, services, type ServiceId } from '../content'
import { track } from '../analytics'
import { langInfo } from '../i18n'
import { serviceHref } from '../routing'

// Demo only: a fictional client with sample bookings. Dates are relative to
// today so the demo always looks current. There is no login and no backend.
type Booking = { ref: string; service: ServiceId; item: number; site: number; day: number; status: number }

const BOOKINGS: Booking[] = [
  { ref: 'DEMO-0415', service: 'testing', item: 4, site: 4, day: 12, status: 0 },
  { ref: 'DEMO-0412', service: 'follow-up', item: 1, site: 1, day: 5, status: 2 },
  { ref: 'DEMO-0409', service: 'commercial', item: 0, site: 0, day: 0, status: 3 },
  { ref: 'DEMO-0398', service: 'boi', item: 2, site: 2, day: -9, status: 3 },
  { ref: 'DEMO-0377', service: 'sourcing', item: 3, site: 3, day: -20, status: 4 },
]

// Days from the inspection date to each status: requested, quoted, scheduled, inspected, report.
const STEP_OFFSETS = [-12, -10, -8, 0, 1]

const DAY = 86_400_000
const at = (days: number) => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return new Date(d.getTime() + days * DAY)
}
const fmt = (d: Date) => d.toLocaleDateString(langInfo.locale, { day: 'numeric', month: 'short' })

export default function PortalPage() {
  const p = locale.portal
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState('DEMO-0398')
  const [downloadNote, setDownloadNote] = useState(false)
  const b = BOOKINGS.find((x) => x.ref === selected)!
  const svc = (id: ServiceId) => services.find((s) => s.id === id)!
  const statusLabel = (x: Booking, i = x.status) => (i === 4 && x.service === 'boi' ? p.boiLast : p.statuses[i])
  const tiles = [
    BOOKINGS.filter((x) => x.status < 4).length,
    BOOKINGS.filter((x) => x.status === 4).length,
    BOOKINGS.filter((x) => x.service === 'boi' && x.status === 3).length,
  ]

  if (!open) {
    return (
      <section className="portal portal-sign">
        <div className="container">
          <div className="portal-card">
            <span className="portal-demo">{p.demoTag}</span>
            <h1 className="page-title">{p.signTitle}</h1>
            <p className="lead">{p.signLead}</p>
            <button
              className="btn"
              onClick={() => {
                setOpen(true)
                track('portal_open')
              }}
            >
              {p.signButton}
            </button>
            <p className="form-hint">{p.signNote}</p>
          </div>
        </div>
      </section>
    )
  }

  const since = -b.day
  return (
    <section className="portal">
      <div className="container">
        <p className="portal-banner" role="note">
          <span className="portal-demo">{p.demoTag}</span> {p.demoNote}
        </p>

        <header className="portal-head">
          <div>
            <p className="label">{p.hello}</p>
            <h1 className="h2">{p.company}</h1>
          </div>
          <button className="btn btn-line btn-small" onClick={() => setOpen(false)}>
            {p.signOut}
          </button>
        </header>

        <dl className="portal-tiles">
          {p.tiles.map((t, i) => (
            <div key={t}>
              <dt>{t}</dt>
              <dd>{tiles[i]}</dd>
            </div>
          ))}
        </dl>

        <div className="portal-layout">
          <div>
            <h2 className="h4">{p.bookingsTitle}</h2>
            <div className="portal-list">
              <div className="portal-row is-head" aria-hidden>
                {p.cols.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
              {BOOKINGS.map((x) => (
                <button
                  key={x.ref}
                  className={`portal-row ${x.ref === selected ? 'is-on' : ''}`}
                  aria-current={x.ref === selected}
                  onClick={() => {
                    setSelected(x.ref)
                    setDownloadNote(false)
                  }}
                >
                  <span className="pr-ref">{x.ref}</span>
                  <span className="pr-svc">{svc(x.service).title}</span>
                  <span>{p.sites[x.site]}</span>
                  <span>{fmt(at(x.day))}</span>
                  <span className={`pr-status s-${x.status}`}>{statusLabel(x)}</span>
                </button>
              ))}
            </div>
          </div>

          <article className="portal-detail" aria-live="polite">
            <p className="pr-ref">{b.ref}</p>
            <h2 className="h3">{svc(b.service).title}</h2>
            <p className="portal-meta">
              {p.detailItem}
              {p.items[b.item]} · {p.sites[b.site]}
            </p>

            <ol className="portal-timeline">
              {STEP_OFFSETS.map((off, i) => (
                <li key={i} className={i <= b.status ? 'is-done' : i === b.status + 1 ? 'is-now' : ''}>
                  <span className="pt-dot" aria-hidden />
                  <span className="pt-label">{statusLabel(b, i)}</span>
                  <span className="pt-date">{i <= b.status || i === 3 ? fmt(at(b.day + off)) : ''}</span>
                </li>
              ))}
            </ol>

            {b.status === 3 && b.service !== 'boi' && <p className="form-hint">{p.reportDue(fmt(at(b.day + 1)))}</p>}

            {b.service === 'boi' && b.status === 3 && (
              <div className="portal-cert">
                <h3 className="h4">{p.certTitle}</h3>
                <p>{p.certWindow(fmt(at(b.day + 7)), fmt(at(b.day + 14)))}</p>
                <div className="portal-cert-bar" aria-hidden>
                  <span style={{ width: `${Math.min(100, (since / 14) * 100)}%` }} />
                  <i style={{ left: '50%' }} />
                </div>
                <p className="form-hint">
                  {p.certDays(since)} · {p.certNote}
                </p>
              </div>
            )}

            <div className="svc-actions">
              {b.status === 4 && (
                <button
                  className="btn btn-small"
                  onClick={() => {
                    setDownloadNote(true)
                    track('portal_download', { service: b.service })
                  }}
                >
                  {p.download}
                </button>
              )}
              <a className="btn btn-line btn-small" href={`${serviceHref(b.service)}#contact`} onClick={() => track('portal_book_again', { service: b.service })}>
                {p.bookAgain}
              </a>
            </div>
            {downloadNote && <p className="form-hint">{p.downloadNote}</p>}
          </article>
        </div>
      </div>
    </section>
  )
}
