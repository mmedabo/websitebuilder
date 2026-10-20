import { useState } from 'react'
import SectionHead from '../components/SectionHead'
import { documents, locale, ui } from '../content'
import { track } from '../analytics'
import { langInfo } from '../i18n'
import { pageHref, serviceHref } from '../routing'
import { Blueprint } from '../sections/Services'

type Rule = keyof typeof locale.guide.rules

// Order Nor. 9/2547, clause 2.2: at least 10%, then at least 30% of the rest.
const firstSample = (total: number) => Math.ceil(total * 0.1)
const secondSample = (total: number) => Math.ceil((total - firstSample(total)) * 0.3)

export default function GuidePage() {
  const g = locale.guide
  const [rule, setRule] = useState<Rule>('s36')
  const [qty, setQty] = useState(1000)
  const [done, setDone] = useState(() => g.checks.map(() => false))
  const num = (v: number) => v.toLocaleString(langInfo.locale)
  const r = g.rules[rule]
  // The BOI documents and II's BOI scrap conditions.
  const sources = documents.slice(5)
  let k = 0
  const n = () => String(++k).padStart(2, '0')

  return (
    <>
      <section className="svc-hero">
        <Blueprint />
        <div className="container svc-hero-inner">
          <nav className="crumbs" aria-label={ui.crumbsAria}>
            <a href={pageHref('')}>{ui.crumbHome}</a>
            <span aria-hidden>/</span>
            <span aria-current="page">{g.label}</span>
          </nav>
          <h1 className="page-title">{g.title}</h1>
          <p className="svc-lead">{g.lead}</p>
          <p className="guide-note">{g.disclaimer}</p>
          <p className="guide-basis">{g.basis}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead n={n()} label={g.ruleLabel} title={g.ruleTitle}>
            {g.ruleLead}
          </SectionHead>
          <div className="rule-tabs" role="tablist" aria-label={g.ruleLabel}>
            {(Object.keys(g.rules) as Rule[]).map((id) => (
              <button
                key={id}
                role="tab"
                id={`tab-${id}`}
                aria-selected={rule === id}
                aria-controls="rule-panel"
                onClick={() => setRule(id)}
              >
                <strong>{g.rules[id].tab}</strong>
                <span>{g.rules[id].name}</span>
              </button>
            ))}
          </div>
          <div className="rule-panel" id="rule-panel" role="tabpanel" aria-labelledby={`tab-${rule}`}>
            <div>
              <h3 className="h4">{g.freeTitle}</h3>
              <ul className="check-list">
                {r.free.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="h4">{g.payTitle}</h3>
              <p>{r.pay}</p>
              <p className="rule-doc">{r.doc}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section guide-terms">
        <div className="container">
          <SectionHead n={n()} label={g.termsLabel} title={g.termsTitle} />
          <dl className="terms">
            <div>
              <dt>{g.scrapTerm}</dt>
              <dd>
                <p>{g.scrapIntro}</p>
                <ol>
                  {g.scrapTypes.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ol>
              </dd>
            </div>
            <div>
              <dt>{g.remainsTerm}</dt>
              <dd>
                <p>{g.remains}</p>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section booking">
        <div className="container">
          <SectionHead n={n()} label={g.stepsLabel} title={g.stepsTitle} />
          <ol className="steps">
            {g.steps.map((s, i) => (
              <li key={s.title}>
                <span className="step-n">{i + 1}</span>
                <span className={`step-who ${s.inspector ? 'is-inspector' : ''}`}>{s.inspector ? g.inspector : g.you}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead n={n()} label={g.sampleLabel} title={g.sampleTitle}>
            {g.sampleLead}
          </SectionHead>
          <div className="sampler">
            <label>
              <span>{g.sampleInput}</span>
              <input
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={qty}
                onChange={(e) => setQty(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
              />
            </label>
            <dl>
              <div>
                <dt>{g.sampleFirst}</dt>
                <dd>{num(firstSample(qty))}</dd>
              </div>
              <div>
                <dt>{g.sampleSecond}</dt>
                <dd>{num(secondSample(qty))}</dd>
              </div>
              <div>
                <dt>{g.sampleTotal}</dt>
                <dd>{num(firstSample(qty) + secondSample(qty))}</dd>
              </div>
            </dl>
            <div className="sampler-bar" aria-hidden>
              <span style={{ width: `${qty ? (firstSample(qty) / qty) * 100 : 0}%` }} />
              <span style={{ width: `${qty ? (secondSample(qty) / qty) * 100 : 0}%` }} />
            </div>
            <p className="form-hint">{g.sampleNote}</p>
          </div>
          <div className="guide-after">
            <h3 className="h4">{g.afterTitle}</h3>
            <ul className="check-list">
              {g.after.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section guide-check">
        <div className="container">
          <SectionHead n={n()} label={g.checkLabel} title={g.checkTitle}>
            {g.checkLead}
          </SectionHead>
          <div className="checklist">
            <p className="checklist-head">
              <strong>{g.checkDone(done.filter(Boolean).length, done.length)}</strong>
              <button
                type="button"
                className="btn btn-line btn-small no-print"
                onClick={() => {
                  track('guide_print')
                  window.print()
                }}
              >
                {g.print}
              </button>
            </p>
            <div className="checklist-bar" aria-hidden>
              <span style={{ transform: `scaleX(${done.filter(Boolean).length / done.length})` }} />
            </div>
            <ul>
              {g.checks.map((c, i) => (
                <li key={c}>
                  <label>
                    <input type="checkbox" checked={done[i]} onChange={() => setDone(done.map((d, j) => (j === i ? !d : d)))} />
                    <span>{c}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section documents">
        <div className="container">
          <SectionHead n={n()} label={g.sourcesLabel} title={g.sourcesTitle}>
            {g.sourcesLead}
          </SectionHead>
          <div className="doc-groups">
            <div className="doc-group">
              <ul>
                {sources.map((d) => (
                  <li key={d.href}>
                    <a href={d.href} target="_blank" rel="noreferrer">
                      <span>{d.title}</span>
                      <span className="doc-tag">{ui.docTag}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="guide-cta no-print">
        <div className="container guide-cta-inner">
          <div>
            <h2 className="h3">{g.ctaTitle}</h2>
            <p>{g.ctaBody}</p>
          </div>
          <a className="btn btn-yellow" href={`${serviceHref('boi')}#contact`} onClick={() => track('guide_cta')}>
            {g.ctaButton}
          </a>
        </div>
      </section>
    </>
  )
}
