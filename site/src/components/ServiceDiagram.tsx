import type { CSSProperties, ReactNode } from 'react'
import { formFields, marks, services, type ServiceId } from '../content'

// A line drawing per service, in the blueprint style of the service header.
// Every label is text the site already has (form choices, key facts, the
// "What we provide" list), so it follows the page language and adds no wording.

const choices = (id: ServiceId, field: string) => formFields(id).find((f) => f.name === field)?.choices?.map((c) => c.label) ?? []
const svc = (id: ServiceId) => services.find((s) => s.id === id)!
const noStop = (t: string) => t.replace(/[.。]\s*$/, '')

// Small line icons, 24 x 24.
const ICONS: Record<string, ReactNode> = {
  sample: <path d="M5 8h14v11H5zM9 8V5h6v3M9 13h6" />,
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </>
  ),
  boxCheck: <path d="M4 8l8-4 8 4v9l-8 4-8-4zM4 8l8 4 8-4M12 12v9M9 15.5l2 2 4-4" />,
  container: <path d="M2 8h13v9H2zM15 11h4l3 3v3h-7M5 17v0M6 19a2 2 0 1 1 0-.1M18 19a2 2 0 1 1 0-.1M6 8v9M10 8v9" />,
  doc: <path d="M6 3h9l4 4v14H6zM15 3v4h4M9 11h7M9 15h7" />,
  tag: <path d="M3 12V4h8l10 10-8 8zM7.5 8.5h.1" />,
  loop: <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4" />,
  scrap: <path d="M3 19l3-6 4 3 3-7 4 4 4-2v8zM7 9l2-4M15 5l1 2" />,
  machine: (
    <>
      <path d="M3 18h18M5 18V9h9v9M14 12h5v6M8 9V5h3v4" />
      <circle cx="9.5" cy="13.5" r="1.6" />
    </>
  ),
  cert: (
    <>
      <path d="M5 3h12v12H5zM8 7h6M8 10h6" />
      <circle cx="15" cy="16" r="3" />
      <path d="M13.5 18.5 13 22l2-1 2 1-.5-3.5" />
    </>
  ),
  factory: <path d="M3 21V10l5 3V10l5 3V10l5 3V4h3v17zM7 17h2M12 17h2" />,
  lab: <path d="M9 3h6M10 3v6L4 19a1.5 1.5 0 0 0 1.3 2h13.4A1.5 1.5 0 0 0 20 19l-6-10V3M7 15h10" />,
}

const Icon = ({ name }: { name: string }) => (
  <svg viewBox="0 0 24 24" className="sd-icon" aria-hidden>
    {ICONS[name]}
  </svg>
)

type Step = { label: string; icon: string }

function Flow({ steps, inputs }: { steps: Step[]; inputs?: Step[] }) {
  let i = 0
  const node = (s: Step) => (
    <li key={s.label} className="sd-step" style={{ ['--d' as string]: i++ } as CSSProperties}>
      <span className="sd-node">
        <Icon name={s.icon} />
      </span>
      <span className="sd-label">{s.label}</span>
    </li>
  )
  return (
    <div className="sd-flow">
      {inputs && <ul className="sd-inputs">{inputs.map(node)}</ul>}
      <ol className="sd-steps">{steps.map(node)}</ol>
    </div>
  )
}

function Hub({ center, icon, items }: { center: string; icon: string; items: ReactNode[] }) {
  const n = items.length
  return (
    <div className="sd-hub" style={{ ['--n' as string]: n } as CSSProperties}>
      <svg className="sd-spokes" viewBox="-100 -100 200 200" aria-hidden>
        <circle r="78" className="sd-orbit" />
        {items.map((_, k) => {
          const a = (k / n) * Math.PI * 2 - Math.PI / 2
          return <line key={k} x1="0" y1="0" x2={Math.cos(a) * 78} y2={Math.sin(a) * 78} style={{ ['--d' as string]: k } as CSSProperties} />
        })}
      </svg>
      <div className="sd-center">
        <Icon name={icon} />
        <span>{center}</span>
      </div>
      <ul className="sd-orbit-items">
        {items.map((it, k) => {
          const a = (k / n) * Math.PI * 2 - Math.PI / 2
          return (
            <li
              key={k}
              style={{ left: `${50 + Math.cos(a) * 39}%`, top: `${50 + Math.sin(a) * 39}%`, ['--d' as string]: k } as CSSProperties}
            >
              {it}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function ServiceDiagram({ id }: { id: ServiceId }) {
  let art: ReactNode = null
  if (id === 'commercial') {
    const c = choices('commercial', 'inspectionType')
    art = (
      <Flow
        steps={[
          { label: c[0], icon: 'sample' },
          { label: c[1], icon: 'gear' },
          { label: c[2], icon: 'boxCheck' },
          { label: c[4], icon: 'container' },
        ]}
      />
    )
  } else if (id === 'sourcing') {
    const p = svc('sourcing').provide.map(noStop)
    const icons = ['doc', 'tag', 'gear', 'boxCheck', 'container', 'loop']
    art = <Flow steps={p.map((label, k) => ({ label, icon: icons[k] ?? 'doc' }))} />
  } else if (id === 'boi') {
    const t = choices('boi', 'boiType')
    art = (
      <Flow
        inputs={[
          { label: t[0], icon: 'scrap' },
          { label: t[1], icon: 'machine' },
        ]}
        steps={[{ label: svc('boi').keyFacts[2], icon: 'cert' }]}
      />
    )
  } else if (id === 'follow-up') {
    const withLogo = marks.filter((m) => m.img).slice(0, 8)
    art = (
      <Hub
        center={svc('follow-up').benefits[1].title}
        icon="factory"
        items={withLogo.map((m) => (
          <span className="sd-logo" title={m.mark}>
            <img src={m.img!} alt={m.mark} loading="lazy" />
          </span>
        ))}
      />
    )
  } else if (id === 'testing') {
    const std = choices('testing', 'standard').slice(0, -1)
    art = (
      <Hub
        center={svc('testing').keyFacts[0]}
        icon="lab"
        items={std.map((s) => (
          <span className="sd-chip">{s}</span>
        ))}
      />
    )
  }
  return art && <figure className={`service-diagram is-${id}`}>{art}</figure>
}

// Small emblem of each diagram, for the service cards on the home page. 64 x 64.
const hubDots = (n: number, r: number, el: (x: number, y: number, k: number) => ReactNode) =>
  Array.from({ length: n }, (_, k) => {
    const a = (k / n) * Math.PI * 2 - Math.PI / 2
    return el(32 + Math.cos(a) * r, 32 + Math.sin(a) * r, k)
  })

const flow = (n: number) => {
  const gap = 44 / (n - 1)
  return (
    <>
      <path d={`M14 10V${10 + gap * (n - 1)}`} />
      {Array.from({ length: n }, (_, k) => (
        <g key={k}>
          <circle cx="14" cy={10 + gap * k} r={n > 4 ? 3.5 : 5} className={k === n - 1 ? 'is-end' : undefined} />
          <path d={`M26 ${10 + gap * k}h${k % 2 ? 20 : 28}`} />
        </g>
      ))}
    </>
  )
}

const GLYPHS: Record<ServiceId, ReactNode> = {
  'follow-up': (
    <>
      <circle cx="32" cy="32" r="22" className="is-dashed" />
      {hubDots(6, 22, (x, y, k) => (
        <g key={k}>
          <path d={`M32 32L${x} ${y}`} />
          <circle cx={x} cy={y} r="4.5" className="is-fill" />
        </g>
      ))}
      <circle cx="32" cy="32" r="9" className="is-end" />
    </>
  ),
  testing: (
    <>
      <circle cx="32" cy="32" r="22" className="is-dashed" />
      {hubDots(8, 22, (x, y, k) => (
        <g key={k}>
          <path d={`M32 32L${x} ${y}`} />
          <rect x={x - 5} y={y - 3} width="10" height="6" rx="3" className="is-fill" />
        </g>
      ))}
      <circle cx="32" cy="32" r="9" className="is-end" />
    </>
  ),
  commercial: flow(4),
  sourcing: flow(6),
  boi: (
    <>
      <circle cx="16" cy="14" r="6" />
      <circle cx="48" cy="14" r="6" />
      <path d="M16 24v6a6 6 0 0 0 6 6h20a6 6 0 0 0 6-6v-6M32 36v6" />
      <circle cx="32" cy="50" r="7" className="is-end" />
    </>
  ),
}

export function ServiceGlyph({ id }: { id: ServiceId }) {
  return (
    <svg viewBox="0 0 64 64" className="svc-glyph" aria-hidden>
      {GLYPHS[id]}
    </svg>
  )
}
