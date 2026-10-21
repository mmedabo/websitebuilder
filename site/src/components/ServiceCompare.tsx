import { useState } from 'react'
import { locale, services, type ServiceId } from '../content'
import { track } from '../analytics'
import { serviceHref } from '../routing'
import SectionHead from './SectionHead'

// Compare up to three services side by side.
const MAX = 3

export default function ServiceCompare({ n }: { n: string }) {
  const c = locale.compare
  const [picked, setPicked] = useState<ServiceId[]>(['follow-up', 'commercial', 'boi'])
  const toggle = (id: ServiceId) => {
    setPicked((p) => {
      if (p.includes(id)) return p.length > 1 ? p.filter((x) => x !== id) : p
      track('compare_add', { service: id })
      // Keep the order of the services list; drop the oldest pick past the limit.
      const next = [...(p.length >= MAX ? p.slice(1) : p), id]
      return services.map((s) => s.id).filter((x) => next.includes(x))
    })
  }
  const cols = services.filter((s) => picked.includes(s.id))

  return (
    <section id="compare" className="section compare">
      <div className="container">
        <SectionHead n={n} label={c.label} title={c.title}>
          {c.lead}
        </SectionHead>
        <div className="compare-chips" role="group" aria-label={c.label}>
          {services.map((s) => (
            <button key={s.id} aria-pressed={picked.includes(s.id)} onClick={() => toggle(s.id)}>
              <span className="cc-n">{s.index}</span>
              {s.title}
            </button>
          ))}
        </div>
        <div className="compare-scroll">
          <table className="compare-table" style={{ ['--cols' as string]: cols.length }}>
            <thead>
              <tr>
                <td />
                {cols.map((s) => (
                  <th key={s.id} scope="col">
                    <span className="cc-n">{s.index}</span>
                    {s.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.rows.map((row, r) => (
                <tr key={row}>
                  <th scope="row">{row}</th>
                  {cols.map((s) => (
                    <td key={s.id}>{c.cells[s.id][r]}</td>
                  ))}
                </tr>
              ))}
              <tr className="compare-actions">
                <td />
                {cols.map((s) => (
                  <td key={s.id}>
                    <a className="btn btn-small" href={`${serviceHref(s.id)}#contact`}>
                      {c.request}
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
