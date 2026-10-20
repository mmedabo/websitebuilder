// Runs after `vite build`. Turns the single-page build into one real HTML
// file per page and language (English at the root, Thai under /th/, Japanese
// under /ja/), each with its own lang, title, description, canonical link,
// hreflang links and structured data; writes redirect pages for every old ii-th.com address,
// a _redirects file for hosts that support server redirects, a sitemap and
// a 404 page.
//
// Env:
//   BASE            site base path, e.g. '/websitebuilder/' (default '/')
//   SITE_URL        absolute site URL, e.g. 'https://www.ii-th.com' (default: that)
//   ALLOW_INDEXING  '1' removes the concept's noindex tag (use at launch)
import fs from 'node:fs'
import path from 'node:path'

const DIST = 'dist'
const BASE = process.env.BASE ?? '/'
const SITE = (process.env.SITE_URL ?? 'https://www.ii-th.com').replace(/\/$/, '')
const INDEXABLE = process.env.ALLOW_INDEXING === '1'

const { org, langs, pages, redirects } = JSON.parse(fs.readFileSync('src/pages.json', 'utf8'))
const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const abs = (p) => `${SITE}/${p}`

const orgLd = {
  '@type': 'ProfessionalService',
  name: org.name,
  alternateName: org.alternateName,
  url: abs(''),
  email: org.email,
  telephone: org.telephone,
  foundingDate: org.foundingDate,
  address: {
    '@type': 'PostalAddress',
    streetAddress: org.streetAddress,
    addressLocality: org.addressLocality,
    addressRegion: org.addressRegion,
    postalCode: org.postalCode,
    addressCountry: org.addressCountry,
  },
  areaServed: org.areaServed.map((name) => ({ '@type': 'Country', name })),
}

function structuredData(page, url) {
  if (page.kind === 'home') return { '@context': 'https://schema.org', ...orgLd, url }
  if (page.kind === 'service') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: page.title.split(' | ')[0],
      description: page.description,
      url,
      provider: orgLd,
      areaServed: orgLd.areaServed,
    }
  }
  return null
}

// page: { path, kind, title, description } already in one language.
function render(page, lang) {
  const url = abs(lang.prefix + page.path)
  let html = template
    .replace(/<html lang="[^"]*">/, `<html lang="${lang.html}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(page.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(page.description)}" />`)
  // Demo pages (the portal) stay noindex even at launch.
  if (INDEXABLE && !page.noindex) html = html.replace(/\s*<!--[^>]*-->\s*<meta name="robots"[^>]*>/, '')
  const ld = structuredData(page, url)
  const real = page.kind !== 'notfound'
  const head = [
    real && `<link rel="canonical" href="${url}" />`,
    // Tell search engines about the other language versions of this page.
    ...(real ? langs.map((l) => `<link rel="alternate" hreflang="${l.html}" href="${abs(l.prefix + page.path)}" />`) : []),
    real && `<link rel="alternate" hreflang="x-default" href="${abs(page.path)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="${lang.og}" />`,
    `<meta property="og:site_name" content="${esc(org.name)}" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    real && `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${abs('img/bangkok-night-1600.jpg')}" />`,
    ld && `<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
  ].filter(Boolean)
  return html.replace('</head>', `    ${head.join('\n    ')}\n  </head>`)
}

function write(rel, content) {
  const file = path.join(DIST, rel)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
}

// 1. One HTML file per page and language.
let count = 0
for (const lang of langs) {
  for (const page of pages) {
    const one = { ...page, title: page.title[lang.id], description: page.description[lang.id] }
    write(path.join(lang.prefix + page.path, 'index.html'), render(one, lang))
    count++
  }
}

// 2. 404 page: GitHub Pages serves it for unknown paths; the app shows "Page not found"
//    in the language of the requested path.
write('404.html', render({ path: '', kind: 'notfound', title: `Page not found | ${org.name}`, description: '' }, langs[0]))

// 3. Old ii-th.com addresses. Static hosts get a small redirect page per address;
//    hosts with server redirects (Netlify, Cloudflare Pages) also read _redirects.
const stub = (target) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>This page has moved</title>
    <meta name="robots" content="noindex" />
    <link rel="canonical" href="${abs(target)}" />
    <meta http-equiv="refresh" content="0; url=${BASE}${target}" />
    <script>location.replace(${JSON.stringify(BASE + target)})</script>
  </head>
  <body>
    <p>This page has moved to <a href="${BASE}${target}">${abs(target)}</a>.</p>
  </body>
</html>
`
const lines = []
for (const [from, to] of Object.entries(redirects)) {
  write(path.join(from, 'index.html'), stub(to))
  lines.push(`/${encodeURI(from)}  ${BASE}${to}  301`)
}
write('_redirects', lines.join('\n') + '\n')

// 4. Sitemap of the real pages (not the redirects).
const today = new Date().toISOString().slice(0, 10)
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${langs.flatMap((l) => pages.filter((p) => !p.noindex).map((p) => `  <url><loc>${abs(l.prefix + p.path)}</loc><lastmod>${today}</lastmod></url>`)).join('\n')}
</urlset>
`,
)

console.log(
  `build-pages: ${count} pages (${pages.length} x ${langs.length} languages), ${lines.length} redirects, sitemap for ${SITE}, base ${BASE}, ` +
    (INDEXABLE ? 'indexable' : 'noindex (concept)'),
)
