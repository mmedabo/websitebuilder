import { useEffect, useRef, useState } from 'react'
import { countries, countryName, formFields, locale, services, ui, type ServiceId } from '../content'
import { track } from '../analytics'
import { serviceHref } from '../routing'

// "Which service do I need?": three taps to the right service, then the
// request form on that service's page, already filled in.
// Any button can open it: window.dispatchEvent(new Event(OPEN_FINDER)).
export const OPEN_FINDER = 'ii:open-finder'
export const openFinder = () => window.dispatchEvent(new Event(OPEN_FINDER))

const OUTSIDE = 'Outside ASEAN'

export default function ServiceFinder() {
  const t = locale.finder
  const ref = useRef<HTMLDialogElement>(null)
  const [service, setService] = useState<ServiceId | null>(null)
  const [country, setCountry] = useState<string | null>(null)
  const [detail, setDetail] = useState<string | null>(null) // field value, or '' when skipped

  useEffect(() => {
    const open = () => {
      reset()
      ref.current?.showModal()
      track('finder_open')
    }
    window.addEventListener(OPEN_FINDER, open)
    return () => window.removeEventListener(OPEN_FINDER, open)
  }, [])

  const reset = () => {
    setService(null)
    setCountry(null)
    setDetail(null)
  }

  // BOI is a Thai scheme and sourcing buys from Thai suppliers: no country step.
  const asksCountry = (id: ServiceId) => id !== 'boi' && id !== 'sourcing'
  const detailField = (id: ServiceId) => formFields(id).find((f) => f.type === 'select')
  const total = service ? 1 + (asksCountry(service) ? 1 : 0) + (detailField(service) ? 1 : 0) : 3
  const step = !service ? 1 : asksCountry(service) && country === null ? 2 : 1 + (asksCountry(service) ? 1 : 0) + 1
  const field = service ? detailField(service) : undefined
  const showResult = (service !== null && (!asksCountry(service) || country !== null) && (!field || detail !== null))

  const s = services.find((x) => x.id === service)
  const params = new URLSearchParams()
  if (country) params.set('country', country)
  if (field && detail) params.set(field.name, detail)
  const requestHref = service ? `${serviceHref(service)}${params.toString() ? `?${params}` : ''}#contact` : '#'

  const back = () => {
    if (showResult && field && detail !== null) return setDetail(null)
    if (country !== null && asksCountry(service!)) return setCountry(null)
    reset()
  }

  return (
    <dialog ref={ref} className="finder" aria-labelledby="finder-title" onClose={reset}>
      <div className="finder-head">
        <div>
          <p id="finder-title" className="finder-title">
            {t.title}
          </p>
          <p className="finder-step">{showResult ? t.resultLabel : t.step(step, total)}</p>
        </div>
        <button className="finder-x" aria-label={t.close} onClick={() => ref.current?.close()}>
          ×
        </button>
      </div>
      <div className="finder-bar" aria-hidden>
        <span style={{ transform: `scaleX(${showResult ? 1 : (step - 1) / total})` }} />
      </div>

      {!service && (
        <div className="finder-body" key="q1">
          <h2 className="h3">{t.q1}</h2>
          <ul className="finder-options">
            {services.map((x) => (
              <li key={x.id}>
                <button
                  onClick={() => {
                    setService(x.id)
                    track('finder_need', { service: x.id })
                  }}
                >
                  <span className="fo-n">{x.index}</span>
                  {t.needs[x.id]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {service && !showResult && asksCountry(service) && country === null && (
        <div className="finder-body" key="q2">
          <h2 className="h3">{t.q2}</h2>
          <ul className="finder-options is-grid">
            {[...countries.map((c) => c.value), OUTSIDE].map((c) => (
              <li key={c}>
                <button className={c === 'Thailand' ? 'is-wide' : ''} onClick={() => setCountry(c)}>
                  {c === OUTSIDE ? ui.fOutsideAsean : countryName(c)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {service && !showResult && (!asksCountry(service) || country !== null) && field && detail === null && (
        <div className="finder-body" key="q3">
          <h2 className="h3">{t.q3[service as keyof typeof t.q3]}</h2>
          <ul className="finder-options is-grid">
            {field.choices!.map((c) => (
              <li key={c.value}>
                <button onClick={() => setDetail(c.value)}>{c.label}</button>
              </li>
            ))}
            <li>
              <button className="is-skip" onClick={() => setDetail('')}>
                {t.skip}
              </button>
            </li>
          </ul>
        </div>
      )}

      {showResult && s && (
        <div className="finder-body finder-result" key="result">
          <p className="fr-index">{s.index}</p>
          <h2 className="h2">{s.title}</h2>
          <p className="lead">{s.short}</p>
          <ul className="check-list">
            {s.keyFacts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          {country === OUTSIDE && <p className="form-hint">{t.outsideAsean}</p>}
          <div className="svc-actions">
            <a className="btn" href={requestHref} onClick={() => track('finder_request', { service: s.id })}>
              {t.request}
            </a>
            <a className="btn btn-line" href={serviceHref(s.id)}>
              {t.details}
            </a>
          </div>
        </div>
      )}

      {service && (
        <div className="finder-foot">
          <button className="link" onClick={back}>
            ← {t.back}
          </button>
          {showResult && (
            <button className="link" onClick={reset}>
              {t.restart}
            </button>
          )}
        </div>
      )}
    </dialog>
  )
}
