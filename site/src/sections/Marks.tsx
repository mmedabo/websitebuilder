import { lazy, Suspense, useState } from 'react'
import { locale, MARKETS, marks, ui, type MarketId } from '../content'
import SectionHead from '../components/SectionHead'
import { track } from '../analytics'
import { useInView, useReducedMotion, useReveal, webglSupported } from '../hooks'
import { markId } from '../search'

const MarketGlobe = lazy(() => import('../effects/MarketGlobe'))

export default function Marks({ n = '03' }: { n?: string }) {
  const ref = useReveal<HTMLUListElement>()
  const g = locale.globe
  const still = useReducedMotion()
  const [globeRef, inView] = useInView<HTMLDivElement>('100px')
  const [gl] = useState(webglSupported)
  const [market, setMarket] = useState<MarketId | null>(null)
  const count = (id: MarketId) => marks.filter((m) => m.market === id).length
  const choose = (id: MarketId | null) => {
    setMarket(id)
    if (id) track('market_select', { market: id })
  }

  return (
    <section id="marks" className="section marks">
      <div className="container">
        <SectionHead n={n} label={ui.marksLabel} title={ui.marksTitle}>
          {ui.marksLead}
        </SectionHead>

        {/* Export-market explorer: the globe and the market buttons filter the marks below. */}
        <div className={`market-explorer ${gl ? '' : 'no-globe'}`}>
          {gl && (
            <div className="market-globe" ref={globeRef}>
              <Suspense fallback={null}>
                <MarketGlobe selected={market} onSelect={choose} active={inView} still={still} />
              </Suspense>
              <p className="market-hint">{g.hint}</p>
            </div>
          )}
          <div className="market-panel">
            <h3 className="h3">{g.label}</h3>
            <p className="market-lead">{g.lead}</p>
            <div className="market-chips" role="group" aria-label={g.label}>
              <button aria-pressed={market === null} onClick={() => choose(null)}>
                {g.all}
                <small>{g.count(marks.length)}</small>
              </button>
              {MARKETS.map((m) => (
                <button key={m.id} aria-pressed={market === m.id} onClick={() => choose(m.id)}>
                  {g.markets[m.id]}
                  <small>{g.count(count(m.id))}</small>
                </button>
              ))}
            </div>
            <p className="market-route" aria-live="polite">
              {market && (
                <>
                  <span className="route-from">{g.from}</span>
                  <span aria-hidden> → </span>
                  <strong>{g.markets[market]}</strong>
                  {': '}
                  {marks
                    .filter((m) => m.market === market)
                    .map((m) => m.mark)
                    .join(ui.listSep)}
                </>
              )}
            </p>
          </div>
        </div>

        <ul className="stamps reveal-stagger" ref={ref}>
          {marks.map((m, i) => (
            <li key={m.mark} style={{ ['--i' as string]: i }} className={market && m.market !== market ? 'is-dim' : market ? 'is-match' : ''}>
              <figure className="mark-card" id={markId(m.mark)}>
                <span className="mark-img">
                  {m.img ? <img src={m.img} alt={`${m.mark} mark`} loading="lazy" decoding="async" /> : <span className="mark-text">{m.mark}</span>}
                </span>
                <figcaption>
                  <strong>{m.mark}</strong>
                  <span>{m.region}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
