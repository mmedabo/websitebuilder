// Temporary: open the live ii-th.com in a browser, page through the client
// slideshow, take screenshots, and save every image the pages load.
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const OUT = 'reference/ii-th/live'
fs.mkdirSync(`${OUT}/screens`, { recursive: true })
fs.mkdirSync(`${OUT}/media`, { recursive: true })

const PAGES = [
  ['home-en', 'https://www.ii-th.com/'],
  ['home-th', 'https://www.ii-th.com/th-%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B9%81%E0%B8%A3%E0%B8%81'],
  ['about', 'https://www.ii-th.com/about-ii'],
  ['why-us', 'https://www.ii-th.com/why-us'],
  ['boi', 'https://www.ii-th.com/machine-and-scrap-inspection'],
  ['follow-up', 'https://www.ii-th.com/follow-up-inspection-services'],
]

const media = new Map() // id -> { id, pages:Set, alts:Set }
const idOf = (u) => (u.match(/\/media\/([^/]+?\.(?:jpg|jpeg|png|gif|webp|svg))/i) || [])[1]

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
for (const [name, url] of PAGES) {
  const page = await ctx.newPage()
  page.on('response', (r) => {
    const id = idOf(r.url())
    if (id && r.url().includes('static.wixstatic.com')) {
      const m = media.get(id) || { id, pages: new Set(), alts: new Set() }
      m.pages.add(name); media.set(id, m)
    }
  })
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 })
  } catch (e) { console.log('goto', name, e.message) }
  // Scroll slowly so lazy images load.
  for (let y = 0; y < 30; y++) { await page.mouse.wheel(0, 600); await page.waitForTimeout(250) }
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800)
  await page.screenshot({ path: `${OUT}/screens/${name}.png`, fullPage: true })

  // Page through every slideshow / gallery on the page.
  const galleries = page.locator('[aria-label="Slide show gallery"], [data-testid*="gallery"], [data-hook*="gallery"]')
  const n = await galleries.count()
  console.log(name, 'galleries', n)
  const seen = new Set()
  for (let g = 0; g < Math.min(n, 4); g++) {
    const gal = galleries.nth(g)
    try { await gal.scrollIntoViewIfNeeded({ timeout: 5000 }) } catch {}
    for (let i = 0; i < 60; i++) {
      const labels = await gal.locator('[aria-label]').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label')))
      labels.forEach((l) => seen.add(l))
      const next = gal.locator('[aria-label*="Next" i], [data-hook*="next" i], button:has-text("Next")').first()
      if (!(await next.count())) break
      try { await next.click({ timeout: 3000 }) } catch { break }
      await page.waitForTimeout(700)
      if (i % 5 === 0) await gal.screenshot({ path: `${OUT}/screens/${name}-gallery${g}-${i}.png` }).catch(() => {})
    }
  }
  // Alt text and names for every image now in the DOM.
  const imgs = await page.evaluate(() => [...document.querySelectorAll('img')].map((i) => ({ src: i.currentSrc || i.src, alt: i.alt })))
  for (const { src, alt } of imgs) {
    const id = (src.match(/\/media\/([^/]+?\.(?:jpg|jpeg|png|gif|webp|svg))/i) || [])[1]
    if (!id) continue
    const m = media.get(id) || { id, pages: new Set(), alts: new Set() }
    m.pages.add(name); if (alt) m.alts.add(alt); media.set(id, m)
  }
  fs.writeFileSync(`${OUT}/screens/${name}-labels.txt`, [...seen].join('\n'))
  await page.close()
}
await browser.close()

// Download the original file for each image.
const list = []
for (const m of media.values()) {
  const file = path.join(`${OUT}/media`, m.id.replace(/~/g, '_'))
  try {
    const r = await fetch(`https://static.wixstatic.com/media/${m.id}`)
    if (r.ok) fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()))
  } catch (e) { console.log('download', m.id, e.message) }
  list.push({ id: m.id, file: path.basename(file), pages: [...m.pages], alts: [...m.alts] })
}
fs.writeFileSync(`${OUT}/media.json`, JSON.stringify(list, null, 2))
console.log('images:', list.length)
