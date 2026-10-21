// Quick-search index, built from the same content the pages show, in the
// visitor's language. Matching is plain substring search, so Thai and
// Japanese (no spaces between words) work too.
import { documents, faqs, locale, marks, services, ui } from './content'
import { pageHref, serviceHref } from './routing'

export type Group = keyof typeof locale.search.groups
export type Entry = { group: Group; title: string; sub: string; text: string; href: string; external?: boolean }

const GUIDE = 'guides/boi-scrap-write-off/'

function build(): Entry[] {
  const g = locale.guide
  const out: Entry[] = []
  const add = (group: Group, title: string, sub: string, href: string, extra = '', external = false) =>
    out.push({ group, title, sub, href, text: `${title} ${sub} ${extra}`.toLowerCase(), external })

  // Pages and home-page topics.
  add('page', ui.crumbHome, ui.heroIntro, pageHref(''))
  add('page', ui.aboutLabel, ui.aboutTitle, pageHref('#about'), ui.aboutLead)
  add('page', ui.coverageLabel, ui.coverageTitle, pageHref('#coverage'), ui.coverageLead)
  add('page', ui.whyLabel, ui.whyTitle, pageHref('#why'), ui.whyLead)
  add('page', ui.productsLabel, ui.productsTitle, pageHref('#expertise'), locale.expertise.map((x) => `${x.title} ${x.body}`).join(' '))
  add('page', ui.docsLabel, ui.docsTitle, pageHref('#documents'), ui.docsLead)
  add('page', ui.contactLabel, ui.formTitle, pageHref('#contact'), `${ui.fEmail} ${ui.fPhone}`)
  add('page', ui.footerGuide, g.lead, pageHref(GUIDE))
  add('page', ui.footerPortal, locale.portal.signLead, pageHref('portal/'))
  add('page', ui.footerPrivacy, locale.privacy.title, pageHref('privacy/'))

  // Services.
  for (const s of services) add('service', s.title, s.short, serviceHref(s.id), `${s.lead} ${s.provide.join(' ')} ${s.keyFacts.join(' ')}`)

  // FAQs: link straight to the answer.
  for (const s of services) faqs[s.id].forEach((f, i) => add('faq', f.q, s.title, `${serviceHref(s.id)}#faq-${i}`, f.a))

  // Marks, with their market.
  for (const m of marks) add('mark', m.mark, m.region, pageHref('#marks'), locale.globe.markets[m.market])

  // BOI guide sections.
  add('guide', g.ruleTitle, `${g.rules.s36.tab} · ${g.rules.s30.tab}`, pageHref(`${GUIDE}#guide-rule`), `${g.ruleLead} ${g.rules.s36.name} ${g.rules.s30.name} ${g.rules.s36.doc} ${g.rules.s30.doc}`)
  add('guide', g.termsTitle, g.scrapIntro, pageHref(`${GUIDE}#guide-terms`), `${g.scrapTypes.join(' ')} ${g.remains}`)
  add('guide', g.stepsTitle, g.steps.map((s) => s.title).join(' · '), pageHref(`${GUIDE}#guide-steps`), g.steps.map((s) => s.body).join(' '))
  add('guide', g.sampleTitle, g.sampleInput, pageHref(`${GUIDE}#guide-sampling`), `${g.sampleLead} ${g.after.join(' ')}`)
  add('guide', g.checkTitle, g.checkLead, pageHref(`${GUIDE}#guide-checklist`), g.checks.join(' '))

  // Documents (PDFs on ii-th.com).
  for (const d of documents) add('doc', d.title, `${d.group} · ${ui.docTag}`, d.href, '', true)

  return out
}

let index: Entry[] | null = null

// Every word must appear; titles that start with or contain the query rank first.
export function search(query: string, limit = 24): Entry[] {
  index ??= build()
  const q = query.trim().toLowerCase()
  if (!q) return []
  const words = q.split(/\s+/)
  const groupRank: Record<Group, number> = { service: 0, page: 1, guide: 2, faq: 3, mark: 4, doc: 5 }
  return index
    .filter((e) => words.every((w) => e.text.includes(w)))
    .map((e) => {
      const t = e.title.toLowerCase()
      const score = (t.startsWith(q) ? 0 : t.includes(q) ? 1 : words.every((w) => t.includes(w)) ? 2 : 3) * 10 + groupRank[e.group]
      return { e, score }
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((x) => x.e)
}

// Shown before the visitor types.
export function suggestions(): Entry[] {
  index ??= build()
  return index.filter((e) => e.group === 'service' || e.href.endsWith('#contact') || (e.group === 'page' && e.href.endsWith(GUIDE)))
}
