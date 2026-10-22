// Shared data, plus the text of the active language merged in.
// Text lives in src/locales/{en,th,ja}.ts; facts come from II's pages and
// PDFs in reference/ii-th. Typos are fixed; facts are not changed.
import { HOLIDAYS_KNOWN_UNTIL, THAI_HOLIDAYS } from './data/thai-holidays'
import { lang } from './i18n'
import en, { type Locale } from './locales/en'
import ja from './locales/ja'
import th from './locales/th'

const L: Locale = { en, th, ja }[lang]
export const locale = L
export const ui = L.ui

export const FOUNDED = 1989
export const yearsInService = () => new Date().getFullYear() - FOUNDED

const PHONES = ['tel:+6627114934', 'tel:+6623817745']
const EXTENSIONS = ['35', '17', '17', '20', '0']

export const company = {
  name: L.companyName,
  short: 'II',
  email: 'info@ii-th.com',
  phones: PHONES.map((href, i) => ({ label: L.phoneLabels[i], href })),
  fax: L.faxLabel,
  address: L.address,
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Modern+Town+Building+Sukhumvit+63+Bangkok',
  extensions: EXTENSIONS.map((ext, i) => ({ service: L.extensions[i], ext })),
}

export const stats = [
  { value: FOUNDED, label: L.stats[0], format: 'year' as const },
  { value: 1000, label: L.stats[1], suffix: '+' },
  { value: 10, label: L.stats[2] },
  { value: 24, label: L.stats[3], suffix: L.statHoursSuffix },
]

// Country names: English is the value sent in the request email.
type Country = keyof Locale['countries']
export const countryName = (english: string) => L.countries[english as Country] ?? english
export const countries = (Object.keys(en.countries) as Country[]).map((value) => ({ value, label: L.countries[value] }))

export type Service = {
  id: ServiceId
  index: string
  title: string
  short: string
  lead: string
  provide: string[]
  benefits: { title: string; body: string }[]
  keyFacts: string[]
  ext: string
  hue: number // drives the orb colour when this service is active; the orb rests at 0.55 (blue)
}
export type ServiceId = keyof Locale['services']

const SERVICE_META: { id: ServiceId; index: string; ext: string; hue: number }[] = [
  { id: 'follow-up', index: '01', ext: '35', hue: 0.7 }, // sky
  { id: 'commercial', index: '02', ext: '17', hue: 0.1 }, // yellow
  { id: 'testing', index: '03', ext: '17', hue: 0.3 }, // orange
  { id: 'boi', index: '04', ext: '20', hue: 0.42 }, // orange into blue
  { id: 'sourcing', index: '05', ext: '17', hue: 0.86 }, // ice
]

export const services: Service[] = SERVICE_META.map((m) => ({ ...m, ...L.services[m.id] }))
export const isServiceId = (id: string): id is ServiceId => SERVICE_META.some((m) => m.id === id)

export const representedBodies = ['UL', 'DEMKO', 'DEKRA']

// In the order of "Certification Marks We Currently Represent" on II's
// follow-up inspection page, with its mark images (public/img/marks).
// BR-UL is named in II's text but has no image there, so it comes last, as text.
const MARKS: { mark: string; market: MarketId; img?: string }[] = [
  { mark: 'UL', market: 'na', img: 'ul' },
  { mark: 'UL-Apex S', market: 'jp', img: 'ul-apex-s' },
  { mark: 'GOST-R', market: 'ru', img: 'gost-r' },
  { mark: 'KEMA-KEUR', market: 'eu', img: 'kema-keur' },
  { mark: 'D-Mark', market: 'eu', img: 'd-mark' },
  { mark: 'ENEC', market: 'eu', img: 'enec' },
  { mark: 'NOM', market: 'mx', img: 'nom' },
  { mark: 'PSE', market: 'jp', img: 'pse' },
  { mark: 'UL-GS', market: 'eu', img: 'ul-gs' },
  { mark: 'S-UL-AR', market: 'ar', img: 's-ul-ar' },
  { mark: 'UL Recognized', market: 'na', img: 'ul-recognized' },
  { mark: 'UL-EU', market: 'eu', img: 'ul-eu' },
  { mark: 'RoHS', market: 'eu', img: 'rohs' },
  { mark: 'BR-UL', market: 'br' },
]
// Export markets for the globe: a point near the middle of each market.
export type MarketId = keyof Locale['globe']['markets']
export const MARKETS: { id: MarketId; lat: number; lon: number }[] = [
  { id: 'na', lat: 41, lon: -98 },
  { id: 'mx', lat: 23, lon: -102 },
  { id: 'br', lat: -11, lon: -52 },
  { id: 'ar', lat: -35, lon: -64 },
  { id: 'eu', lat: 50, lon: 10 },
  { id: 'ru', lat: 57, lon: 45 },
  { id: 'jp', lat: 36, lon: 138 },
]
export const BANGKOK = { lat: 13.75, lon: 100.5 }

export const marks = MARKS.map((m, i) => ({
  mark: m.mark,
  market: m.market,
  region: L.markRegions[i],
  img: m.img && `${import.meta.env.BASE_URL}img/marks/${m.img}.png`,
}))

// Photos from II's "Our Expertise" page, in the order of the product list.
// null: the old site has no photo for that category.
const EXPERTISE_PHOTOS = [
  'appliances',
  'lighting',
  'wire-cable',
  'plumbing',
  'plastics',
  'high-tech',
  'textiles',
  'toys',
  'life-safety',
  'energy',
  'building-materials',
  null,
]
export const expertise = L.expertise.map((x, i) => ({
  ...x,
  photo: EXPERTISE_PHOTOS[i] ? `${import.meta.env.BASE_URL}img/products/${EXPERTISE_PHOTOS[i]}.jpg` : null,
}))
export const whyUs = L.whyUs
export const timeline = L.timeline
export const boiSteps = L.boiSteps.map((s, i) => ({ ...s, n: String(i + 1).padStart(2, '0') }))

// Client logos, in the order of the "Our Clients" slideshow on II's home
// page (live snapshot in reference/ii-th/live; files in public/img/clients).
const CLIENT_LOGOS: [name: string, file: string][] = [
  ['Sony', 'sony'], ['DuPont', 'dupont'], ['Walmart', 'walmart'], ['Kimberly-Clark', 'kimberly-clark'],
  ['Dell', 'dell'], ['Philips', 'philips'], ['LG', 'lg'], ['IBM', 'ibm'],
  ['General Electric', 'ge'], ['Sharp', 'sharp'], ['Whirlpool', 'whirlpool'], ['3M', '3m'],
  ['HP', 'hp'], ['Honeywell', 'honeywell'], ['Dow', 'dow'], ['Panasonic', 'panasonic'],
]
export const clientLogos = CLIENT_LOGOS.map(([name, file]) => ({ name, logo: `${import.meta.env.BASE_URL}img/clients/${file}.png` }))

// Other clients that II's pages name in text, without a logo.
export const otherClients = [
  'Sony', 'Whirlpool', 'Dell', 'Samsung', 'General Electric', 'Honeywell', '3M',
  'Hitachi', 'Minebea', 'Pioneer', 'Sharp', 'Daikin', 'Canon', 'Nikon', 'Casio',
  'Panasonic', 'DuPont', 'Ajinomoto', 'Furukawa', 'Brady', 'Emerson', 'Toshiba',
  'Mitsubishi', 'NEC', 'LG', 'Sumitomo', 'Nidec', 'Yanmar', 'Suzuki', 'Daramic',
].filter((name) => !CLIENT_LOGOS.some(([n]) => n === name))

const PDF = 'https://www.ii-th.com/_files/ugd/'
const DOCS: { group: keyof Locale['docGroups']; href: string }[] = [
  { group: 'iso', href: PDF + '97a516_83508f63ac7e4676b531432920dc375b.pdf' },
  { group: 'iso', href: PDF + '97a516_b05c540618744567b5bb16f46097012a.pdf' },
  { group: 'iso', href: PDF + '97a516_a26a7815b20d4cff910b865227377eb9.pdf' },
  { group: 'iso', href: PDF + '97a516_d403c7bfd129497da48c62fa14d9671e.pdf' },
  { group: 'service', href: PDF + '97a516_113933001c4d41e3bdf1d3053dd0f15d.pdf' },
  { group: 'service', href: PDF + '97a516_0bae2a2e82b84eea87450854f8df78b3.pdf' },
  { group: 'boi', href: PDF + '97a516_dce8fa0c797b4d9d8fc1590febb984ca.pdf' },
  { group: 'boi', href: PDF + '97a516_5630f986451e4151aa9b00e6239801e9.pdf' },
  { group: 'boi', href: PDF + '97a516_78410a11336b46f396db7190db6cf0a5.pdf' },
]
export const documents = DOCS.map((d, i) => ({ group: L.docGroups[d.group], title: L.docTitles[i], href: d.href }))

// Chat channels. Left empty on purpose: II must supply its real IDs.
export const chat = {
  line: '', // LINE Official Account ID, e.g. '@iithailand'
  whatsapp: '', // number in international format, digits only
}

// BOI scrap inspection conditions PDF, clause 3.1.
export const BOI_NOTICE_WORKING_DAYS = 3

export type Step = { title: string; body: string }
export const bookingSteps: Step[] = L.bookingSteps
export const boiBookingSteps: Step[] = L.boiBookingSteps

export type Faq = { q: string; a: string }
export const faqs: Record<ServiceId, Faq[]> = L.faqs

// Request-form fields per service ('' = general enquiry). The option values
// and the labels in the request email are always English, so II receives the
// same format whatever language the visitor uses.
type FieldKey = keyof Locale['fields']
type FieldDef = { name: string; type: 'text' | 'select' | 'date'; options?: string[]; required?: boolean }
const FIELD_DEFS: Record<FieldKey, FieldDef[]> = {
  general: [{ name: 'product', type: 'text' }],
  'follow-up': [
    { name: 'mark', type: 'select', options: en.fields['follow-up'].mark.options },
    { name: 'product', type: 'text' },
    { name: 'date', type: 'date' },
  ],
  commercial: [
    { name: 'inspectionType', type: 'select', options: en.fields.commercial.inspectionType.options },
    { name: 'product', type: 'text' },
    { name: 'quantity', type: 'text' },
    { name: 'date', type: 'date' },
  ],
  testing: [
    { name: 'product', type: 'text' },
    { name: 'standard', type: 'select', options: en.fields.testing.standard.options },
  ],
  boi: [
    { name: 'boiType', type: 'select', options: en.fields.boi.boiType.options, required: true },
    { name: 'site', type: 'text', required: true },
    { name: 'items', type: 'text' },
    { name: 'date', type: 'date', required: true },
  ],
  sourcing: [
    { name: 'product', type: 'text' },
    { name: 'quantity', type: 'text' },
    { name: 'destination', type: 'text' },
  ],
}

type FieldText = { label: string; placeholder?: string; options?: string[] }
const fieldText = (loc: Locale, key: FieldKey, name: string) => (loc.fields[key] as Record<string, FieldText>)[name]

export type Field = FieldDef & {
  label: string
  emailLabel: string
  placeholder?: string
  choices?: { value: string; label: string }[]
}

export function formFields(serviceId: string): Field[] {
  const key: FieldKey = isServiceId(serviceId) ? serviceId : 'general'
  return FIELD_DEFS[key].map((d) => {
    const t = fieldText(L, key, d.name)
    return {
      ...d,
      label: t.label,
      emailLabel: fieldText(en, key, d.name).label,
      placeholder: t.placeholder,
      choices: d.options?.map((value, i) => ({ value, label: t.options?.[i] ?? value })),
    }
  })
}

// The English service title, for the request email.
export const serviceEmailTitle = (id: string) => (isServiceId(id) ? en.services[id].title : en.ui.fGeneral)

// A working day: Monday to Friday and not a Thai public holiday.
export const isWorkingDay = (d: Date) => d.getDay() !== 0 && d.getDay() !== 6 && !THAI_HOLIDAYS[isoDate(d)]

// Earliest date allowed for a BOI booking: today plus N working days.
export function earliestBoiDate(from = new Date(), days = BOI_NOTICE_WORKING_DAYS) {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  let left = days
  while (left > 0) {
    d.setDate(d.getDate() + 1)
    if (isWorkingDay(d)) left--
  }
  return d
}

// Why a BOI date cannot be used, or '' if it can. 'beyond': the holiday list
// does not cover that year yet, so the date is allowed with a note.
export function checkBoiDate(value: string): 'weekend' | 'holiday' | 'soon' | 'beyond' | '' {
  if (!value) return ''
  const [y, m, day] = value.split('-').map(Number)
  const d = new Date(y, m - 1, day)
  if (d.getDay() === 0 || d.getDay() === 6) return 'weekend'
  if (THAI_HOLIDAYS[value]) return 'holiday'
  if (value < isoDate(earliestBoiDate())) return 'soon'
  return value > HOLIDAYS_KNOWN_UNTIL ? 'beyond' : ''
}

export const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
