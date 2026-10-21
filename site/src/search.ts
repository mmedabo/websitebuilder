// Quick-search index, built from the same content the pages show, in the
// visitor's language. Matching is substring search on normalised text, so
// Thai and Japanese (no spaces between words) work too. English words also
// match their simple forms ("sampling" finds "samples").
import { bookingSteps, boiBookingSteps, clientLogos, company, documents, faqs, locale, marks, otherClients, services, ui } from './content'
import { pageHref, serviceHref } from './routing'

export type Group = keyof typeof locale.search.groups
export type Entry = { group: Group; title: string; sub: string; text: string; keys: string; labels: string[]; href: string; external?: boolean }

const GUIDE = 'guides/boi-scrap-write-off/'

// Lower case, full-width to normal width, punctuation to spaces.
export const norm = (s: string) =>
  s
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[-–—_/.,:;!?()[\]{}'"’“”·•…]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

// Mark codes are often typed without separators: "ulgs" for "UL-GS".
export const markId = (mark: string) => 'mark-' + norm(mark).replace(/ /g, '-')

function build(): Entry[] {
  const g = locale.guide
  const k = locale.search.keywords
  const out: Entry[] = []
  // keys: words that should rank this entry high (labels, aliases, names).
  const add = (group: Group, title: string, sub: string, href: string, extra = '', external = false, keys = '') => {
    const text = norm(`${title} ${sub} ${keys} ${extra}`)
    const labels = keys.split(/[,|]/).map(norm).filter(Boolean)
    out.push({ group, title, sub, href, text: ` ${text} ${text.replace(/ /g, '')}`, keys: ` ${norm(`${sub} ${keys}`)}`, labels, external })
  }

  // Pages and home-page topics.
  add('page', ui.crumbHome, ui.heroIntro, pageHref(''))
  add('page', ui.aboutLabel, ui.aboutTitle, pageHref('#about'), `${ui.aboutLead} ${locale.timeline.map((x) => `${x.year} ${x.title} ${x.body}`).join(' ')}`)
  add('page', ui.clientsTitle, ui.clientsHeading, pageHref('#clients'), '', false, [...clientLogos.map((c) => c.name), ...otherClients].join(' '))
  add('page', ui.bookingLabel, ui.bookingTitle, pageHref('#booking'), [...bookingSteps, ...boiBookingSteps].map((x) => `${x.title} ${x.body}`).join(' '), false, k.booking)
  add('page', ui.coverageLabel, ui.coverageTitle, pageHref('#coverage'), `${ui.coverageLead} ${Object.values(locale.countries).join(' ')}`)
  add('page', ui.whyLabel, ui.whyTitle, pageHref('#why'), `${ui.whyLead} ${locale.whyUs.map((x) => `${x.title} ${x.body}`).join(' ')}`)
  add('page', ui.docsLabel, ui.docsTitle, pageHref('#documents'), ui.docsLead)
  add(
    'page',
    ui.contactLabel,
    `${company.address.join(', ')} · ${company.phones[0].label}`,
    pageHref('#contact'),
    `${ui.formTitle} ${company.email} ${company.phones.map((p) => p.label).join(' ')} ${company.fax}`,
    false,
    k.contact,
  )
  add('page', ui.footerGuide, g.lead, pageHref(GUIDE))
  add('page', ui.footerPortal, locale.portal.signLead, pageHref('portal/'))
  add('page', ui.footerPrivacy, locale.privacy.title, pageHref('privacy/'))

  // Services.
  // The BOI service is "BOI" in the nav, so that label leads to it.
  for (const s of services)
    add('service', s.title, s.short, serviceHref(s.id), `${s.lead} ${s.provide.join(' ')} ${s.keyFacts.join(' ')} ${s.benefits.map((b) => `${b.title} ${b.body}`).join(' ')}`, false, s.id === 'boi' ? ui.nav.boi : '')

  // Product types we inspect.
  for (const x of locale.expertise) add('product', x.title, x.body, pageHref('#expertise'))

  // FAQs: link straight to the answer.
  for (const s of services) faqs[s.id].forEach((f, i) => add('faq', f.q, s.title, `${serviceHref(s.id)}#faq-${i}`, f.a))

  // Marks: link to the mark's own card.
  for (const m of marks) add('mark', m.mark, m.region, pageHref(`#${markId(m.mark)}`), '', false, locale.globe.markets[m.market])

  // BOI guide sections.
  add('guide', g.ruleTitle, `${g.rules.s36.tab} · ${g.rules.s30.tab}`, pageHref(`${GUIDE}#guide-rule`), `${g.ruleLead} ${g.rules.s36.name} ${g.rules.s30.name} ${g.rules.s36.doc} ${g.rules.s30.doc} ${g.rules.s36.free.join(' ')} ${g.rules.s30.free.join(' ')} ${g.rules.s36.pay} ${g.rules.s30.pay}`)
  add('guide', g.termsTitle, g.scrapIntro, pageHref(`${GUIDE}#guide-terms`), `${g.scrapTypes.join(' ')} ${g.remains}`, false, g.termsLabel)
  add('guide', g.stepsTitle, g.steps.map((s) => s.title).join(' · '), pageHref(`${GUIDE}#guide-steps`), g.steps.map((s) => s.body).join(' '), false, g.stepsLabel)
  add('guide', g.sampleTitle, g.sampleInput, pageHref(`${GUIDE}#guide-sampling`), `${g.sampleLead} ${g.sampleNote} ${g.after.join(' ')}`, false, g.sampleLabel)
  add('guide', g.checkTitle, g.checkLead, pageHref(`${GUIDE}#guide-checklist`), g.checks.join(' '), false, g.checkLabel)

  // Documents (PDFs on ii-th.com).
  for (const d of documents) add('doc', d.title, `${d.group} · ${ui.docTag}`, d.href, '', true)

  return out
}

// Short Latin words match only at a word start ("led" must not match
// "detailed"); longer words and Thai/Japanese match anywhere.
const pattern = (w: string) => (/^[a-z0-9]{1,3}$/.test(w) ? ` ${w}` : w)

// Simple English word forms: "sampling" -> "sampl", "inspections" -> "inspection".
const SUFFIXES = ['ings', 'ing', 'ions', 'ion', 'ments', 'ment', 'ies', 'es', 'ed', 's']
function forms(word: string) {
  const out = [pattern(word)]
  if (/^[a-z]{5,}$/.test(word)) {
    for (const s of SUFFIXES) if (word.endsWith(s) && word.length - s.length >= 4) out.push(word.slice(0, -s.length))
  }
  return out
}

let index: Entry[] | null = null

// Every word must appear (in some form). Rank: title matches, then the
// entry's subtitle and keys (labels, aliases, names), then body text; ties
// go by group.
export function search(query: string, limit = 30): Entry[] {
  index ??= build()
  const q = norm(query)
  if (!q) return []
  const words = q.split(' ').map(forms)
  const groupRank: Record<Group, number> = { service: 0, page: 1, guide: 2, product: 3, faq: 4, mark: 5, doc: 6 }
  return index
    .filter((e) => words.every((f) => f.some((w) => e.text.includes(w))))
    .map((e) => {
      const t = norm(e.title)
      const all = (s: string) => words.every((f) => f.some((w) => s.includes(w)))
      const tier = t === q || e.labels.includes(q) ? 0 : t.startsWith(q) ? 1 : t.includes(q) ? 2 : all(` ${t}`) ? 3 : all(e.keys) ? 4 : 5
      const score = tier * 10 + groupRank[e.group]
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
