// English text. The source for the Thai and Japanese files: they must
// provide exactly the same keys (TypeScript checks this through `Locale`).
// Facts come from II's pages and PDFs in reference/ii-th; nothing is invented.

const en = {
  machineTranslated: false,

  ui: {
    // Top bar and navigation
    conceptTag: 'Design concept',
    conceptTitle: 'This is a design proposal, not the official website',
    mtNote: '',
    mtTitle: '',
    langsLabel: 'Language',
    topbarAddress: 'Sukhumvit 63, Bangkok',
    tel: 'Tel',
    brandSmall: 'Co., Ltd. · Est. 1989',
    brandAria: 'International Inspection, home',
    navAria: 'Main',
    tabsAria: 'Sections',
    nav: { about: 'About', services: 'Services', marks: 'Marks', boi: 'BOI', products: 'Products', guide: 'BOI guide', contact: 'Contact' },
    requestInspection: 'Request inspection',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    skip: 'Skip to content',

    // Review switch
    reviewAria: 'Design version for review',
    review: 'Review',
    versionA: 'Shader + orb',
    versionB: 'Bangkok photo',

    // Hero
    heroTitle: 'Quality is our ',
    heroMark: 'priority.',
    heroIntro:
      'International Inspection (II) is a third-party inspection company in Bangkok. We started in 1989 as the representative of Underwriters Laboratories (UL) in Thailand. Today we inspect for UL, DEMKO and DEKRA, for the Board of Investment, and to your own specifications, in all ten ASEAN countries.',
    heroRequest: 'Request an inspection',
    heroServices: 'Our services',
    represents: 'Representative inspector for',
    and: ' and ',
    listSep: ', ',
    servicesAria: 'Services',
    orbHint: 'Point at a service to see what it covers.',

    // About
    aboutLabel: 'About II',
    aboutTitle: 'A Thai inspection company with an international standard.',
    aboutLead:
      'II provides product safety inspection, commercial inspection, testing, BOI machine and scrap inspection, sourcing and advice. More than 1,000 clients trust us, including Sony, Whirlpool, Dell, Samsung, General Electric, Honeywell and 3M.',

    // Services
    servicesLabel: 'Services',
    servicesTitle: 'What we do for manufacturers, importers and investors.',
    servicesLead:
      'Choose a service to see what it includes, how booking works and the common questions. Every inspection ends with a detailed report within 24 hours.',
    details: 'Details',

    // Booking
    bookingLabel: 'How booking works',
    bookingTitle: 'From request to report in five steps.',
    bookingHomeLead:
      'The same simple process for every inspection. BOI scrap and machinery inspections need 3 working days notice; see the BOI page for details.',
    bookingServiceLead: 'Tell us what you need; we handle the rest and report back within 24 hours.',
    bookingBoiTitle: 'From booking to BOI certificate.',
    bookingBoiLead: 'These conditions come from our BOI scrap inspection service terms.',

    // Marks
    marksLabel: 'Certification marks',
    marksTitle: 'Follow-up inspection for UL, DEMKO and DEKRA.',
    marksLead:
      'We inspect products and raw materials for the safety marks below. Because we work for several marks, we can combine many inspections in one factory visit and save you time.',

    // Coverage
    coverageLabel: 'Coverage',
    coverageTitle: 'Ten ASEAN countries from one Bangkok office.',
    coverageLead:
      'Bangkok is at the centre of Southeast Asia, so our inspectors reach factories across the region quickly. This saves you inspection and transport cost. Our engineers speak Thai and English, which removes the language barrier of working offshore.',
    mapAria: 'Map of the ten ASEAN countries II covers, with Bangkok at the centre',
    bangkok: 'Bangkok',

    // BOI fold
    boiLabel: 'BOI inspection',
    boiTitle: 'How a BOI scrap write-off works.',
    boiLead:
      'Projects with Board of Investment privileges must certify scrap and used imported machinery. Without a certificate, leftover raw materials stay in your stock account, and import duty becomes due when the privilege ends.',
    boiMachineryStrong: 'Used machinery:',
    boiMachinery:
      'we certify refurbishment or remaining life, year of manufacture, test-run results, and environmental and safety impact. Certificates are issued in 1–2 weeks.',

    // Products
    productsLabel: 'Products',
    productsTitle: 'Products we inspect.',
    productsLead: (years: number) =>
      `${years} years as a third-party inspector have given our team deep knowledge of product quality. These are some of the product types we inspect. The list is not complete.`,

    // Why
    whyLabel: 'Why II',
    whyTitle: 'Why manufacturers choose II.',
    whyLead:
      'Inspection or sourcing offshore is not as easy as it seems. These are the reasons clients have worked with us for more than three decades.',

    // Clients
    clientsTitle: 'Selected clients',
    clientsHeading: 'Trusted by global manufacturers.',
    clientsLead: 'More than 1,000 manufacturers trust II. These are some of them.',
    clientsAlso: 'Other clients include',

    // Documents
    docsLabel: 'Documents',
    docsTitle: 'Policies and regulations.',
    docsLead:
      'II works as a Type A (third-party) inspection body under ISO/IEC 17020. Our policies, inspection scope and the BOI regulations we inspect to are public. The documents are in Thai.',
    docTag: 'PDF, Thai',

    // Contact and form
    contactLabel: 'Contact',
    contactTitle: 'Contact us.',
    openMaps: 'Open in Maps ↗',
    fax: 'Fax',
    chatIdNeeded: 'ID needed',
    chatNumberNeeded: 'number needed',
    chatLineTitle: "Add II's LINE Official Account ID in content.ts",
    chatWhatsappTitle: "Add II's WhatsApp number in content.ts",
    formTitle: 'Request an inspection',
    formNote: 'We reply by email. Fields marked * are required.',
    fService: 'Service',
    fGeneral: 'General enquiry',
    fName: 'Name',
    fCompany: 'Company',
    fEmail: 'Email',
    fPhone: 'Phone',
    fCountry: 'Factory country',
    fOutsideAsean: 'Outside ASEAN',
    fChoose: 'Choose…',
    fMessage: 'Message',
    fMessagePh: 'Quantities, standards, marks, or anything else we should know',
    consentBefore: 'I agree that II may use these details to reply to my request. See the ',
    consentLink: 'privacy notice',
    consentAfter: '.',
    submit: 'Send request by email',
    boiHint: (days: number, date: string) =>
      `BOI inspections need at least ${days} working days notice, so the first date you can pick is ${date}. Thai public holidays are not counted here; we confirm the date with you.`,
    sentStrong: 'Your email app should now open with this message.',
    sentBody: 'If it did not, copy the text and send it to',
    sentAttach: 'You can attach drawings or specifications to the email.',
    requestAria: 'Your request',
    copy: 'Copy request',
    copied: 'Copied',

    // Footer
    footerTag: 'Quality is our priority.',
    footerServices: 'Services',
    footerCompany: 'Company',
    footerAbout: 'About II',
    footerProducts: 'Products we inspect',
    footerWhy: 'Why II',
    footerDocs: 'ISO/IEC 17020 documents',
    footerContact: 'Contact',
    footerPrivacy: 'Privacy notice',
    footerGuide: 'BOI scrap write-off guide',
    footerPortal: 'Client portal (demo)',
    rights: 'All rights reserved.',
    footerConcept: 'Design concept. This is not the official website.',
    photoCredit: 'Hero photo:',
    photoLicense: ', Wikimedia Commons, CC0.',

    // Service pages
    crumbsAria: 'Breadcrumb',
    crumbHome: 'Home',
    crumbServices: 'Services',
    requestThis: 'Request this service',
    call: 'Call',
    ext: 'ext.',
    scopeLabel: 'Scope',
    scopeTitle: 'What we provide.',
    whyWork: 'Why work with II',
    otherServices: 'Other services',
    faqLabel: 'Questions',
    faqTitle: 'Frequently asked questions.',

    // Not found
    nfTitle: 'Page not found.',
    nfLead: 'The page you are looking for has moved or does not exist. These pages may help:',
    nfHome: 'Home',
    nfContact: 'Contact us',
  },

  address: ['87/109 Modern Town Building, 12th Fl.', 'Sukhumvit 63 Rd., Khlong Tan Nuea', 'Watthana, Bangkok 10110, Thailand'],
  companyName: 'International Inspection Co., Ltd.',
  phoneLabels: ['+66 2711 4934 – 7', '+66 2381 7745 – 6'],
  faxLabel: '+66 2381 7748',
  extensions: ['Follow-up Inspection', 'Commercial Inspection & Testing', 'Sourcing', 'Machine & Scrap Inspection', 'Operator'],
  stats: ['Established', 'Manufacturers served', 'ASEAN countries', 'Hours to your report'],
  statHoursSuffix: ' h',

  countries: {
    Thailand: 'Thailand',
    Myanmar: 'Myanmar',
    Cambodia: 'Cambodia',
    Laos: 'Laos',
    Vietnam: 'Vietnam',
    Malaysia: 'Malaysia',
    Singapore: 'Singapore',
    Brunei: 'Brunei',
    Philippines: 'Philippines',
    Indonesia: 'Indonesia',
  },

  services: {
    'follow-up': {
      title: 'Follow-up Inspection',
      short: 'Factory follow-up inspection on behalf of UL, DEMKO and DEKRA.',
      lead: 'II performs follow-up inspection of products and raw materials on behalf of leading certification bodies. We are a representative inspector for UL, DEMKO and DEKRA, covering marks for North America, Europe, Japan, Latin America and more.',
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
      keyFacts: ['Representative inspector for UL, DEMKO and DEKRA', 'Report within 24 hours', 'All ten ASEAN countries'],
    },
    commercial: {
      title: 'Commercial Inspection',
      short: 'Independent on-site inspection to your own codes and requirements.',
      lead: 'As an independent third-party inspection company, II provides on-site inspections that protect your brand value and reputation by minimising defective and non-compliant products.',
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
      keyFacts: ['Checklist designed to your requirements', 'Report within 24 hours', 'All ten ASEAN countries'],
    },
    testing: {
      title: 'Product Testing',
      short: 'Accredited-laboratory testing for safety, EMC, RF and energy.',
      lead: 'II offers efficient product testing through accredited laboratories, for electrical and electronic products, lighting, communications and medical equipment.',
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
      keyFacts: ['Accredited laboratories', 'Safety, EMC and RF testing', 'UL, CE, CCC, PSE, FCC and more'],
    },
    boi: {
      title: 'Machine & Scrap Inspection',
      short: 'BOI-approved inspection of scrap and used imported machinery.',
      lead: 'II inspects scrap and used imported machinery to the regulations of the Thailand Board of Investment (BOI). We are one of the longest-standing BOI-approved inspectors, operating as a Type A (third-party) inspection body.',
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
      keyFacts: ['Type A (third-party) inspection body', 'Book 3 working days ahead', 'Certificate in 1 to 2 weeks'],
    },
    sourcing: {
      title: 'Sourcing',
      short: 'Find, negotiate and quality-check Thai suppliers for you.',
      lead: 'II provides full product sourcing for importers, wholesalers and distributors around the world who need to purchase Thai products and raw materials.',
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
      keyFacts: ['Large network of Thai suppliers', 'Quality checks at every stage', 'Thai- and English-speaking team'],
    },
  },

  // Regions, in the order of the marks list in content.ts.
  markRegions: [
    'United States & Canada',
    'Japan',
    'Russia',
    'Netherlands',
    'Denmark (DEMKO)',
    'Europe',
    'Mexico',
    'Japan',
    'Germany',
    'Argentina',
    'United States',
    'Europe',
    'European Union',
    'Brazil',
  ],

  expertise: [
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
  ],

  whyUs: [
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
  ],

  timeline: [
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
  ],

  // The BOI scrap write-off process, from II's Thai service page.
  boiSteps: [
    { title: 'Approve the method', body: 'Get BOI approval for the scrap destruction method. You do this once only; if BOI has approved it before, skip this step.' },
    { title: 'Plan and book', body: 'Prepare the scrap quantities to write off and plan the destruction date. Book II at least 3 working days in advance.' },
    { title: 'On-site inspection', body: 'Our inspector samples about 10% of the items against your data and photographs the destruction as evidence.' },
    { title: 'Certificate and write-off', body: 'Receive the quantity certificate in 1–2 weeks. File the write-off with BOI using the certificate and destruction evidence.' },
  ],

  bookingSteps: [
    { title: 'Send your request', body: 'Use the form, call or email. Tell us the product, the factory location and your preferred date.' },
    { title: 'Receive a quotation', body: 'We confirm the scope with you and send a quotation.' },
    { title: 'Confirm the date', body: 'We agree the date and assign one of our degreed engineers.' },
    { title: 'On-site inspection', body: 'Our inspector follows your requirements or the standard procedure with integrity.' },
    { title: 'Report in 24 hours', body: 'You receive a detailed report within 24 hours after the inspection.' },
  ],

  boiBookingSteps: [
    { title: 'Send your request', body: 'Tell us the factory location, the scrap or machinery to inspect and your planned date.' },
    { title: 'Receive a quotation', body: 'The quotation or work order shows the fee and any travel cost. Payment is due within 30 days of the invoice.' },
    { title: 'Book 3 working days ahead', body: 'Give at least 3 working days notice. To move or cancel, tell us at least 1 working day before.' },
    { title: 'On-site inspection', body: 'The inspector checks type, quantity, condition and destruction method, and photographs the destruction.' },
    { title: 'Certificate in 1 to 2 weeks', body: 'You receive the signed certificate to file your write-off with BOI.' },
  ],

  faqs: {
    'follow-up': [
      { q: 'Which certification marks do you inspect for?', a: 'We are a representative inspector of UL, DEMKO and DEKRA. Marks include UL (US and Canada), UL-GS (Germany), D-Mark (Denmark), KEMA-KEUR (Netherlands), ENEC (Europe), S-UL-AR (Argentina), BR-UL (Brazil), PSE and UL-Apex S (Japan), NOM (Mexico) and GOST-R (Russia).' },
      { q: 'Can you inspect for several marks in one visit?', a: 'Yes. Because we inspect for many marks, we can combine several inspections in one factory visit. This saves the manufacturer time.' },
      { q: 'Which countries do you cover?', a: 'Thailand, Myanmar, Cambodia, Laos, Vietnam, Malaysia, Singapore, Brunei, the Philippines and Indonesia.' },
      { q: 'Who carries out the inspection?', a: 'Our inspectors and supervisors are degreed engineers who specialise in product and raw-material inspection and in safety standards. All speak Thai and English.' },
      { q: 'When do we get the report?', a: 'Within 24 hours after the inspection is complete.' },
    ],
    commercial: [
      { q: 'Which inspection types do you offer?', a: 'First article inspection, during production inspection, final pre-shipment inspection, supplier or factory audit, and container loading inspection. We also collect samples and arrange external testing.' },
      { q: 'Whose checklist do you use?', a: 'Yours. We design a quality checklist that meets your requirements, and our inspectors follow your procedures with integrity.' },
      { q: 'Which products can you inspect?', a: 'Appliances, lighting, wire and cable, plumbing, plastics, high-tech products, textiles and footwear, toys, life safety equipment, energy systems, building materials and licensed goods. The list is not complete; ask us about your product.' },
      { q: 'When do we get the report?', a: 'Within 24 hours after the inspection is complete.' },
      { q: 'Do you inspect outside Thailand?', a: 'Yes, in all ten ASEAN countries. Bangkok is central, so our inspectors reach the region quickly and you save travel cost and time.' },
    ],
    testing: [
      { q: 'What can be tested?', a: 'Electrical and electronic products, lighting, communications and medical equipment. Tests cover safety, electromagnetic compatibility (EMC) and radio frequency (RF).' },
      { q: 'Which standards?', a: 'UL, CE, CCC/CQC, PSE, ENERGY STAR, DLC, FCC, KC, KS and other standards.' },
      { q: 'Where is the testing done?', a: 'In accredited laboratories. Ask us which laboratory suits your product and target market.' },
      { q: 'Can you combine testing with inspection?', a: 'Yes. During commercial inspection we can collect samples and arrange external testing, so you deal with one team.' },
    ],
    boi: [
      { q: 'What is scrap inspection?', a: 'Scrap means raw materials, production waste or products that are defective, below standard or no longer usable for their purpose. BOI-promoted companies can write off scrap against their raw-material account, so they do not pay import duty on it when the import privilege ends. A certificate from an approved inspector is required.' },
      { q: 'How much notice do you need?', a: 'At least 3 working days before the inspection. To move or cancel, tell us at least 1 working day before; otherwise agreed costs may apply.' },
      { q: 'What should we prepare?', a: 'All related documents, such as the request to sell or destroy scrap, tax documents and production or inventory reports. Prepare a safe work area, and have a responsible member of your staff present during the inspection.' },
      { q: 'How does the inspector check the quantity?', a: 'The inspector samples about 10% of the items against the data you provide and photographs the destruction as evidence, for example crushing, melting or landfill.' },
      { q: 'How long until we get the certificate?', a: 'About 1 to 2 weeks after the inspection.' },
      { q: 'What do you check on used imported machinery?', a: 'The refurbishment status or remaining-life analysis, the year of manufacture, the test-run results, and the environmental and safety impact. The report states the date and place of inspection.' },
      { q: 'We sell our scrap instead of destroying it. Is that different?', a: 'If you sell the scrap, you do not need destruction evidence, but tax applies.' },
      { q: 'What happens if we do not follow the BOI rules?', a: 'Leftover raw materials stay in your stock account, and you must pay import duty on them when the import privilege ends.' },
      { q: 'Is our information kept confidential?', a: 'Yes. Information from the inspection is confidential. We disclose it only with your written permission or when the law requires it.' },
    ],
    sourcing: [
      { q: 'Who is this service for?', a: 'Importers, wholesalers and distributors around the world who want to buy Thai products or raw materials.' },
      { q: 'What is included?', a: 'Sourcing to your specifications, price negotiation, first article check, final pre-shipment check, container loading inspection and on-going quality control.' },
      { q: 'How do you find suppliers?', a: 'Through a large network of Thai suppliers and manufacturers built over many years.' },
      { q: 'How do you avoid misunderstandings with suppliers?', a: 'Our team speaks Thai and English and follows your requirements with integrity, so language and culture do not get in the way.' },
    ],
  },

  // Labels for the request-form fields defined in content.ts. Option labels
  // follow the order of the English option values there.
  fields: {
    general: { product: { label: 'Product or topic', placeholder: 'What do you need help with?' } },
    'follow-up': {
      mark: { label: 'Certification mark', options: ['UL', 'UL-GS', 'D-Mark', 'KEMA-KEUR', 'ENEC', 'S-UL-AR', 'BR-UL', 'PSE', 'UL-Apex S', 'NOM', 'GOST-R', 'Other'] },
      product: { label: 'Product', placeholder: 'e.g. power supply, wiring harness' },
      date: { label: 'Preferred date' },
    },
    commercial: {
      inspectionType: {
        label: 'Inspection type',
        options: ['First article inspection', 'During production inspection', 'Final pre-shipment inspection', 'Supplier / factory audit', 'Container loading inspection', 'Not sure yet'],
      },
      product: { label: 'Product', placeholder: 'e.g. LED luminaires' },
      quantity: { label: 'Order quantity', placeholder: 'e.g. 12,000 pcs' },
      date: { label: 'Preferred date' },
    },
    testing: {
      product: { label: 'Product', placeholder: 'e.g. Bluetooth speaker' },
      standard: { label: 'Target standard or market', options: ['UL', 'CE', 'CCC / CQC', 'PSE', 'ENERGY STAR', 'DLC', 'FCC', 'KC / KS', 'Other / not sure'] },
    },
    boi: {
      boiType: { label: 'Inspection', options: ['Scrap inspection', 'Used imported machinery', 'Both'] },
      site: { label: 'Factory location', placeholder: 'Province or industrial estate' },
      items: { label: 'Approx. number of items', placeholder: 'e.g. 35 scrap items, or 4 machines' },
      date: { label: 'Planned inspection date' },
    },
    sourcing: {
      product: { label: 'Product and key specifications', placeholder: 'e.g. natural latex gloves, size M, AQL 1.5' },
      quantity: { label: 'Target quantity', placeholder: 'e.g. 2 containers per month' },
      destination: { label: 'Destination country' },
    },
  },

  docGroups: { iso: 'ISO/IEC 17020', service: 'Service', boi: 'BOI regulation' },
  // Titles in the order of the documents list in content.ts.
  docTitles: [
    'Inspection scope (No. 005/2568)',
    'Impartiality policy (No. 003/2568)',
    'Code of ethics (No. 004/2568)',
    'Feedback, complaints & appeals (P-09)',
    'Service process flowchart',
    'BOI scrap inspection conditions',
    'Announcement Por. 4/2543 (Section 30)',
    'Announcement Por. 5/2543 (Section 36(1))',
    'Order Nor. 9/2547 (scrap inspection)',
  ],

  // BOI scrap write-off guide. Facts only from BOI Announcements Por. 4/2543
  // and Por. 5/2543, BOI Order Nor. 9/2547 and II's BOI scrap conditions.
  guide: {
    label: 'Guide',
    title: 'BOI scrap write-off, step by step.',
    lead: 'How a BOI-promoted company writes off scrap from its raw-material account, and what the inspector checks. A plain-language summary of the BOI documents that II publishes.',
    disclaimer: 'This is a summary, not legal advice. The BOI documents below are the authority. If your case is not clear, ask BOI.',
    basis: 'Based on BOI Announcements Por. 4/2543 and Por. 5/2543 (24 July 2000) and BOI Order Nor. 9/2547 (12 November 2004).',

    ruleLabel: 'Your privilege',
    ruleTitle: 'Which rule applies to you?',
    ruleLead: 'The rule depends on the import privilege in your BOI promotion certificate. Choose one.',
    freeTitle: 'Written off without import duty when',
    payTitle: 'When duty is due',
    rules: {
      s36: {
        tab: 'Section 36(1)',
        name: 'Import duty exemption on raw materials for export products',
        doc: 'Announcement Por. 5/2543',
        free: [
          'the scrap is destroyed by a method that BOI approves,',
          'the scrap is exported out of Thailand, or',
          'the scrap is donated to a government agency, a state organisation or a public charity that BOI approves.',
        ],
        pay: 'If you sell or transfer scrap with commercial value in Thailand, BOI writes it off only after you pay the duty. Duty is calculated on the tariff, condition and price of the raw material on the import date. For remains with commercial value, duty is on their condition at the current tariff.',
      },
      s30: {
        tab: 'Section 30',
        name: 'Import duty reduction on raw materials',
        doc: 'Announcement Por. 4/2543',
        free: [
          'the scrap is leftover material or waste from production,',
          'the scrap is defective or below-standard products or parts made from the raw materials,',
          'the scrap is exported out of Thailand, or',
          'the scrap is donated to a government agency, a state organisation or a public charity that BOI approves.',
        ],
        pay: 'Defective raw materials, before use or left over, that are not exported or donated pay duty on the tariff, condition and price on the import date, at the reduced Section 30 rate. BOI writes them off when it receives proof of payment.',
      },
    },

    termsLabel: 'Terms',
    termsTitle: 'What counts as scrap.',
    scrapTerm: 'Scrap',
    scrapIntro: 'Scrap (ส่วนสูญเสีย) is one of these:',
    scrapTypes: [
      'Raw materials, before use or left over from production, that are defective, below standard or no longer usable for their purpose.',
      'Leftover raw materials or waste from the production process.',
      'Products, parts or goods made from the raw materials that are defective, below standard or no longer usable for their purpose.',
    ],
    remainsTerm: 'Remains',
    remains: 'Remains (เศษซาก) are scrap that has been destroyed so that it no longer has its original form.',

    stepsLabel: 'Process',
    stepsTitle: 'Five steps to the write-off.',
    you: 'You',
    inspector: 'Inspector',
    steps: [
      { inspector: false, title: 'Ask BOI for approval', body: 'Send BOI a request to destroy, export or donate the scrap, on the form attached to the announcement.' },
      { inspector: false, title: 'List and store the scrap', body: 'For each item, list the type, quantity or weight, value and cause of the loss. Store the scrap or remains so that BOI or its inspector can check them.' },
      { inspector: true, title: 'Quantity check', body: 'An approved inspector checks the type, condition, quantity and cause against your factory report, and photographs the scrap before destruction.' },
      { inspector: true, title: 'Destruction', body: 'The inspector checks that destruction follows the approved method. The inspector records and photographs the process and the remains, by type.' },
      { inspector: false, title: 'File the write-off', body: "Send BOI the details, with the inspector's certificate and the disposal certificate for the remains." },
    ],

    sampleLabel: 'Sampling',
    sampleTitle: 'How much the inspector checks.',
    sampleLead: 'Order Nor. 9/2547, clause 2.2: the inspector samples at least 10% of the scrap against your factory report. If the sample does not match, the inspector samples at least 30% of the rest. If it still does not match, you correct the report and book a new date.',
    sampleInput: 'Total scrap quantity (items, pieces or kg)',
    sampleFirst: 'First sample, at least',
    sampleSecond: 'If it does not match, second sample, at least',
    sampleTotal: 'Checked in total, at least',
    sampleNote: 'If the factory report cannot be used for comparison, the inspector checks all of the scrap. If that is not possible, the inspector uses another reliable, standard method.',

    afterTitle: 'After destruction',
    after: [
      'Only an agency or company that BOI approves can dispose of the remains.',
      'The disposer issues a certificate with the type, quantity and disposal method. It is attached to the inspector’s certificate.',
      'Disposal must not cause environmental problems.',
      'If the inspector finds a more suitable destruction method, the inspector tells BOI.',
    ],

    checkLabel: 'Checklist',
    checkTitle: 'Before inspection day.',
    checkLead: 'From II’s BOI scrap inspection conditions and the BOI announcements. Tick each item when it is ready.',
    checks: [
      'Book II at least 3 working days before the inspection.',
      'Prepare the BOI request to sell or destroy the scrap.',
      'Prepare the tax documents.',
      'Prepare the production report or the inventory report.',
      'List each scrap item with its type, quantity or weight, value and cause.',
      'Prepare a safe work area for the inspector.',
      'Name a responsible member of staff to be present during the inspection.',
      'To move or cancel, tell II at least 1 working day before.',
    ],
    checkDone: (done: number, total: number) => `${done} of ${total} ready`,
    print: 'Print checklist',

    sourcesLabel: 'Sources',
    sourcesTitle: 'The original documents.',
    sourcesLead: 'In Thai, as published on ii-th.com.',

    ctaTitle: 'Ready to book?',
    ctaBody: 'Book at least 3 working days ahead. You receive the certificate 1–2 weeks after the inspection.',
    ctaButton: 'Request a BOI inspection',
  },

  // Client portal demo. All data is fictional and labelled as such.
  portal: {
    demoTag: 'Demo',
    demoNote: 'Sample data. The company, bookings and dates are fictional. A real portal needs a login system and a database.',
    signTitle: 'Client portal',
    signLead: 'Follow your bookings, reports and BOI certificates in one place.',
    signButton: 'Open the demo',
    signNote: 'No account or password is needed. Nothing you do here is sent anywhere.',
    hello: 'Welcome back',
    company: 'Sample Manufacturing Co., Ltd. (fictional)',
    signOut: 'Leave demo',
    tiles: ['Open bookings', 'Reports ready', 'BOI certificates pending'],
    bookingsTitle: 'Your bookings',
    cols: ['Reference', 'Service', 'Site', 'Date', 'Status'],
    statuses: ['Requested', 'Quoted', 'Scheduled', 'Inspected', 'Report ready'],
    boiLast: 'Certificate ready',
    items: ['LED luminaires, 12,000 pcs', 'Power supplies', '35 scrap items', 'Natural latex gloves, 2 containers', 'Bluetooth speaker'],
    sites: ['Rayong', 'Chonburi', 'Ayutthaya', 'Songkhla', 'Pathum Thani'],
    detailItem: 'Item: ',
    reportDue: (date: string) => `Report due by ${date} (within 24 hours of the inspection).`,
    download: 'Download report',
    downloadNote: 'In the real portal the signed report downloads here. This demo has no reports.',
    bookAgain: 'Book again',
    certTitle: 'BOI certificate',
    certWindow: (from: string, to: string) => `Expected between ${from} and ${to}.`,
    certDays: (n: number) => `Day ${n} after the inspection`,
    certNote: 'Certificates are issued 1–2 weeks after the inspection.',
  },

  // Draft privacy notice. II and its legal adviser must review it before launch.
  privacy: {
    draftStrong: 'Draft for review.',
    draftNote: 'II and its legal adviser must check and complete this notice before the site goes live. It is a starting point, not legal advice.',
    title: 'Privacy notice',
    lead: (company: string) =>
      `This notice explains how ${company} uses the personal data you send through this website, under Thailand’s Personal Data Protection Act B.E. 2562 (2019).`,
    whoTitle: 'Who we are',
    collectTitle: 'What we collect',
    collect:
      'When you send a request, we receive the details you enter: your name, company, email address, and the details of the service you need, such as the product, factory location, preferred date and your message.',
    noCookies: 'This website does not use analytics or advertising cookies at present.',
    whyTitle: 'Why we use it',
    why: 'We use your details only to answer your request, to prepare a quotation, and to schedule and carry out the service you ask for.',
    seeTitle: 'Who can see it',
    see: 'Only II staff who handle your request. We do not sell your data. We disclose it to others only with your permission or when the law requires it.',
    keepTitle: 'How long we keep it',
    keepTodo: '[II to set the retention period, for example: as long as needed to answer your request and to keep business records required by law.]',
    rightsTitle: 'Your rights',
    rightsBefore: 'You can ask to see, correct or delete your data, withdraw your consent, or object to how we use it. To do so, email ',
    rightsAfter: '. You can also complain to the Office of the Personal Data Protection Committee (PDPC).',
    updatedTodo: '[Last updated: date to be added on publication.]',
    email: 'Email',
  },
}

export type Locale = typeof en
export default en
