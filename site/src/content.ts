// All copy is taken from the crawl in reference/ii-th (English pages, Thai BOI
// page and the ISO/IEC 17020 PDFs). Typos are fixed; facts are not changed.

export const FOUNDED = 1989
export const yearsInService = () => new Date().getFullYear() - FOUNDED

export const company = {
  name: 'International Inspection Co., Ltd.',
  short: 'II',
  tagline: 'Quality is our priority.',
  email: 'info@ii-th.com',
  phones: [
    { label: '+66 2711 4934 – 7', href: 'tel:+6627114934' },
    { label: '+66 2381 7745 – 6', href: 'tel:+6623817745' },
  ],
  fax: '+66 2381 7748',
  address: [
    '87/109 Modern Town Building, 12th Fl.',
    'Sukhumvit 63 Rd., Khlong Tan Nuea',
    'Watthana, Bangkok 10110, Thailand',
  ],
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Modern+Town+Building+Sukhumvit+63+Bangkok',
  extensions: [
    { service: 'Follow-up Inspection', ext: '35' },
    { service: 'Commercial Inspection & Testing', ext: '17' },
    { service: 'Sourcing', ext: '17' },
    { service: 'Machine & Scrap Inspection', ext: '20' },
    { service: 'Operator', ext: '0' },
  ],
}

export const stats = [
  { value: FOUNDED, label: 'Established', format: 'year' as const },
  { value: 1000, label: 'Manufacturers served', suffix: '+' },
  { value: 10, label: 'ASEAN countries' },
  { value: 24, label: 'Hours to your report', suffix: ' h' },
]

export const aseanCountries = [
  'Thailand',
  'Myanmar',
  'Cambodia',
  'Laos',
  'Vietnam',
  'Malaysia',
  'Singapore',
  'Brunei',
  'Philippines',
  'Indonesia',
]

export type Service = {
  id: string
  index: string
  title: string
  short: string
  lead: string
  provide: string[]
  benefits: { title: string; body: string }[]
  ext: string
  hue: number // drives the orb colour when this service is active; the orb rests at 0.55 (blue)
}

export const services: Service[] = [
  {
    id: 'follow-up',
    index: '01',
    title: 'Follow-up Inspection',
    short: 'Factory follow-up inspection on behalf of UL, DEMKO and DEKRA.',
    lead:
      'II performs follow-up inspection of products and raw materials on behalf of leading certification bodies. We are a representative inspector for UL, DEMKO and DEKRA, covering marks for North America, Europe, Japan, Latin America and more.',
    provide: [
      'Inspect products and raw materials for factories in all ten ASEAN countries, to the standard requirements of each mark.',
      'Appliances, HVAC, wire & cable, power and controls, lighting, life safety and security, high-tech equipment, health science equipment, food safety, energy equipment, drinking-water equipment, building materials and chemical products.',
      'Combine inspections for several certification marks in one factory visit.',
    ],
    benefits: [
      { title: 'Qualified professionals', body: 'All inspectors and supervisors are degreed engineers, fluent in Thai and English.' },
      { title: 'One visit, many marks', body: 'We combine inspections for different marks in a single visit to save the manufacturer time.' },
      { title: 'Report in 24 hours', body: 'You receive the inspection report within 24 hours of completion.' },
    ],
    ext: '35',
    hue: 0.7, // sky
  },
  {
    id: 'commercial',
    index: '02',
    title: 'Commercial Inspection',
    short: 'Independent on-site inspection to your own codes and requirements.',
    lead:
      'As an independent third-party inspection company, II provides on-site inspections that protect your brand value and reputation by minimising defective and non-compliant products.',
    provide: [
      'A quality checklist designed to meet your requirements.',
      'First article inspection.',
      'During production inspection.',
      'Final pre-shipment inspection.',
      'Supplier and factory audit.',
      'Container loading inspection (container quality check).',
      'Sample collection and external testing services.',
    ],
    benefits: [
      { title: 'Strict to your procedure', body: 'Our inspectors follow your standard procedures with integrity.' },
      { title: 'No language barrier', body: 'We remove the miscommunication that language and culture can cause offshore.' },
      { title: 'Report in 24 hours', body: 'You receive the inspection report within 24 hours of completion.' },
    ],
    ext: '17',
    hue: 0.1, // yellow
  },
  {
    id: 'testing',
    index: '03',
    title: 'Product Testing',
    short: 'Accredited-laboratory testing for safety, EMC, RF and energy.',
    lead:
      'II offers efficient product testing through accredited laboratories, for electrical and electronic products, lighting, communications and medical equipment.',
    provide: [
      'Safety, electromagnetic compatibility (EMC) and radio frequency (RF) testing.',
      'Testing to UL, CE, CCC/CQC, PSE, ENERGY STAR, DLC, FCC, KC, KS and other standards.',
      'Test results that support your certification and market-entry plans.',
    ],
    benefits: [
      { title: 'Accredited laboratories', body: 'Testing is done in accredited laboratories for the target standard.' },
      { title: 'One point of contact', body: 'II co-ordinates inspection and testing so you deal with one team.' },
      { title: 'Market knowledge', body: 'We know what each regional market requires and advise you on the route.' },
    ],
    ext: '17',
    hue: 0.3, // orange
  },
  {
    id: 'boi',
    index: '04',
    title: 'Machine & Scrap Inspection',
    short: 'BOI-approved inspection of scrap and used imported machinery.',
    lead:
      'II inspects scrap and used imported machinery to the regulations of the Thailand Board of Investment (BOI). We are one of the longest-standing BOI-approved inspectors, operating as a Type A (third-party) inspection body.',
    provide: [
      'Quality inspection on behalf of BOI: sampling inspection and quantity check for scrap.',
      'Used-machinery inspection: refurbishment status or remaining-life analysis, year of manufacture, test-run results, environmental and safety review.',
      'Certificate of conformance within 1–2 weeks after the inspection.',
    ],
    benefits: [
      { title: 'BOI experience', body: 'Inspectors who know BOI procedures make the inspection easier and better.' },
      { title: 'Correct compliance', body: 'Detailed inspections make sure your company complies with BOI requirements.' },
      { title: 'Faster tax exemption', body: 'A quick certificate makes your tax-exemption process more efficient.' },
    ],
    ext: '20',
    hue: 0.42, // orange into blue
  },
  {
    id: 'sourcing',
    index: '05',
    title: 'Sourcing',
    short: 'Find, negotiate and quality-check Thai suppliers for you.',
    lead:
      'II provides full product sourcing for importers, wholesalers and distributors around the world who need to purchase Thai products and raw materials.',
    provide: [
      'Product sourcing to your specifications.',
      'Price negotiation.',
      'First article quality check.',
      'Final pre-shipment quality check.',
      'Container loading inspection.',
      'On-going quality control.',
    ],
    benefits: [
      { title: 'Large supplier network', body: 'Years of experience give us a wide network of Thai suppliers and manufacturers.' },
      { title: 'Quality built in', body: 'Every sourced order can include first article, in-production, pre-shipment and loading inspection.' },
      { title: 'Always available', body: 'We work around the clock by phone, email and social media.' },
    ],
    ext: '17',
    hue: 0.86, // ice
  },
]

export const representedBodies = ['UL', 'DEMKO', 'DEKRA']

export const marks = [
  { mark: 'UL', region: 'United States & Canada' },
  { mark: 'UL-GS', region: 'Germany' },
  { mark: 'D-Mark', region: 'Denmark (DEMKO)' },
  { mark: 'KEMA-KEUR', region: 'Netherlands' },
  { mark: 'ENEC', region: 'Europe' },
  { mark: 'S-UL-AR', region: 'Argentina' },
  { mark: 'BR-UL', region: 'Brazil' },
  { mark: 'PSE', region: 'Japan' },
  { mark: 'UL-Apex S', region: 'Japan' },
  { mark: 'NOM', region: 'Mexico' },
  { mark: 'GOST-R', region: 'Russia' },
]

export const expertise = [
  { title: 'Appliances & HVAC/R', body: 'Home, small, major, commercial and specialty appliances; HVAC and refrigeration.' },
  { title: 'Lighting', body: 'Lamps, light bulbs, luminaires and signs, and retrofit kits.' },
  { title: 'Wire & Cable', body: 'Building wire, flexible power cable, LAN cable, optical fibre, telecom cable and wiring harnesses.' },
  { title: 'Plumbing', body: 'Pipes, plumbing devices, joining and sealing materials, and non-metallic potable-water materials.' },
  { title: 'Plastics & Components', body: 'Bioplastics, polymeric materials and parts, recycled and virgin plastics, coatings, gaskets and seals.' },
  { title: 'High Tech', body: 'Batteries, consumer electronics, mobile and telecom products, power supplies and components.' },
  { title: 'Textiles, Apparel & Footwear', body: 'Fabric and fibres, apparel, gloves, handbags, luggage, hats, home textiles, upholstery and shoes.' },
  { title: 'Toys & Juvenile', body: 'Figures and dolls, arts and crafts, puzzles, activity toys, RC cars and juvenile products.' },
  { title: 'Life Safety & Security', body: 'Alarm systems, fire equipment, personal flotation devices and PPE.' },
  { title: 'Energy & Industrial', body: 'Smart meters and large-format batteries.' },
  { title: 'Building Materials', body: 'Sprinklers, heating, cooling, ventilating and cooking equipment.' },
  { title: 'Premium & Licensed Goods', body: 'Quality verification for licensed consumer products, to protect brand reputation.' },
]

export const whyUs = [
  {
    title: 'The first Thai product-safety inspection company',
    body: 'II was the first Thai company to provide product safety inspection. We are experts in product safety inspection, quality system audit and international safety standards.',
  },
  {
    title: 'Proficient professionals',
    body: 'Our entire inspection team are degreed engineers, specialised in product and raw-material inspection and in local and international standards. All are fluent in Thai and English.',
  },
  {
    title: 'High-quality service',
    body: 'Every inspection follows standard procedures and your requirements with absolute integrity. A full report reaches you within 24 hours.',
  },
  {
    title: 'Customer-oriented',
    body: 'We work around the clock by phone, email and social media to understand your requirements and solve any issue.',
  },
  {
    title: 'Cost-effective and efficient',
    body: 'From Bangkok our inspectors reach the whole region quickly. You save inspection and transport cost, and time.',
  },
]

export const timeline = [
  {
    year: '1989',
    title: 'Founded as UL’s representative in Thailand',
    body: 'II begins as an authorised representative inspection and assessment centre of Underwriters Laboratories (UL).',
  },
  {
    year: 'Expansion',
    title: 'Inspector and quality-system auditor',
    body: 'II builds its reputation in product inspection and quality-system audit, and adds more safety marks from around the world.',
  },
  {
    year: 'BOI approval',
    title: 'One of the longest-standing BOI inspectors',
    body: 'II becomes an approved inspector of scrap and used imported machinery for the Thailand Board of Investment.',
  },
  {
    year: 'Today',
    title: 'Inspection across ASEAN',
    body: 'Inspection services extend to all ten ASEAN countries, for more than 1,000 manufacturers.',
  },
  {
    year: '2025',
    title: 'ISO/IEC 17020 inspection body',
    body: 'II publishes its impartiality policy, code of ethics and inspection scope as a Type A (third-party) inspection body under ISO/IEC 17020.',
  },
]

// The BOI scrap write-off process, from the Thai service page.
export const boiSteps = [
  {
    n: '01',
    title: 'Approve the method',
    body: 'Get BOI approval for the scrap destruction method. You do this once only; if BOI has approved it before, skip this step.',
  },
  {
    n: '02',
    title: 'Plan and book',
    body: 'Prepare the scrap quantities to write off and plan the destruction date. Book II at least 3 working days in advance.',
  },
  {
    n: '03',
    title: 'On-site inspection',
    body: 'Our inspector samples about 10% of the items against your data and photographs the destruction as evidence.',
  },
  {
    n: '04',
    title: 'Certificate and write-off',
    body: 'Receive the quantity certificate in 1–2 weeks. File the write-off with BOI using the certificate and destruction evidence.',
  },
]

export const clients = [
  'Sony', 'Whirlpool', 'Dell', 'Samsung', 'General Electric', 'Honeywell', '3M',
  'Hitachi', 'Minebea', 'Pioneer', 'Sharp', 'Daikin', 'Canon', 'Nikon', 'Casio',
  'Panasonic', 'DuPont', 'Ajinomoto', 'Furukawa', 'Brady', 'Emerson', 'Toshiba',
  'Mitsubishi', 'NEC', 'LG', 'Sumitomo', 'Nidec', 'Yanmar', 'Suzuki', 'Daramic',
]

const PDF = 'https://www.ii-th.com/_files/ugd/'
export const documents = [
  { group: 'ISO/IEC 17020', title: 'Inspection scope (No. 005/2568)', href: PDF + '97a516_83508f63ac7e4676b531432920dc375b.pdf' },
  { group: 'ISO/IEC 17020', title: 'Impartiality policy (No. 003/2568)', href: PDF + '97a516_b05c540618744567b5bb16f46097012a.pdf' },
  { group: 'ISO/IEC 17020', title: 'Code of ethics (No. 004/2568)', href: PDF + '97a516_a26a7815b20d4cff910b865227377eb9.pdf' },
  { group: 'ISO/IEC 17020', title: 'Feedback, complaints & appeals (P-09)', href: PDF + '97a516_d403c7bfd129497da48c62fa14d9671e.pdf' },
  { group: 'Service', title: 'Service process flowchart', href: PDF + '97a516_113933001c4d41e3bdf1d3053dd0f15d.pdf' },
  { group: 'Service', title: 'BOI scrap inspection conditions', href: PDF + '97a516_0bae2a2e82b84eea87450854f8df78b3.pdf' },
  { group: 'BOI regulation', title: 'Announcement Por. 4/2543 (Section 30)', href: PDF + '97a516_dce8fa0c797b4d9d8fc1590febb984ca.pdf' },
  { group: 'BOI regulation', title: 'Announcement Por. 5/2543 (Section 36(1))', href: PDF + '97a516_5630f986451e4151aa9b00e6239801e9.pdf' },
  { group: 'BOI regulation', title: 'Order Nor. 9/2547 (scrap inspection)', href: PDF + '97a516_78410a11336b46f396db7190db6cf0a5.pdf' },
]
