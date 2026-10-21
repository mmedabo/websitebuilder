import { test, expect, PAGES, LANGS, REDIRECTS, BASE, at } from './helpers'

// Links do not depend on the browser: run these once, in desktop Chromium.
test.skip(({ browserName, isMobile }) => browserName !== 'chromium' || isMobile, 'Chromium desktop only')

// Every internal link on every page, after the page has rendered, answers 200;
// every #target in a link exists on the page it points to.
for (const lang of LANGS) {
  test(`all internal links resolve (${lang.id})`, async ({ page, request, baseURL }) => {
    test.setTimeout(180_000)
    const origin = new URL(baseURL!).origin
    const targets = new Map<string, Set<string>>() // path -> #ids
    for (const def of PAGES) {
      await page.goto(at(lang.prefix + def.path), { waitUntil: 'networkidle' })
      const hrefs = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => (a as HTMLAnchorElement).href))
      for (const href of hrefs) {
        const u = new URL(href)
        if (u.origin !== origin) continue
        expect(u.pathname, `link outside the base path on /${lang.prefix}${def.path}: ${href}`).toMatch(new RegExp(`^${BASE}`))
        const ids = targets.get(u.pathname) ?? new Set<string>()
        if (u.hash) ids.add(decodeURIComponent(u.hash.slice(1)))
        targets.set(u.pathname, ids)
      }
    }
    expect(targets.size).toBeGreaterThan(5)
    for (const [path, ids] of targets) {
      expect((await request.get(origin + path)).status(), path).toBe(200)
      if (!ids.size) continue
      await page.goto(origin + path, { waitUntil: 'networkidle' })
      const missing = await page.evaluate((ids) => ids.filter((id) => !document.getElementById(id)), [...ids])
      expect(missing, `#targets missing on ${path}`).toEqual([])
    }
  })
}

// External links open in a new tab and say so to the browser.
test('external links are safe', async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin
  for (const def of PAGES) {
    await page.goto(at(def.path), { waitUntil: 'networkidle' })
    const bad = await page.evaluate(
      (origin) =>
        [...document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]')]
          .filter((a) => new URL(a.href).origin !== origin)
          .filter((a) => a.target === '_blank' && !/noopener|noreferrer/.test(a.rel))
          .map((a) => a.href),
      origin,
    )
    expect(bad, `target=_blank without rel=noopener on /${def.path}`).toEqual([])
  }
})

// Old ii-th.com addresses (Wix) go to the new page, in the same language.
for (const [from, to] of Object.entries(REDIRECTS)) {
  test(`old address /${from}/ goes to /${to}`, async ({ page, baseURL }) => {
    await page.goto(encodeURI(from) + '/')
    const want = new URL(BASE + to, baseURL)
    await page.waitForURL((u) => u.pathname === want.pathname)
    await expect.poll(() => decodeURIComponent(new URL(page.url()).hash)).toBe(want.hash)
  })
}

test('sitemap lists the public pages only', async ({ request }) => {
  const xml = await (await request.get('sitemap.xml')).text()
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  const want = LANGS.flatMap((l) => PAGES.filter((p) => !p.noindex).map((p) => l.prefix + p.path))
  expect(locs).toHaveLength(want.length)
  for (const path of want) expect(locs.some((loc) => loc.endsWith('/' + path))).toBe(true)
  for (const p of PAGES.filter((p) => p.noindex)) expect(xml).not.toContain(p.path)
})

test('unknown address shows Page not found', async ({ page, errors }) => {
  await page.goto('no-such-page/')
  await expect(page.locator('h1')).toContainText('Page not found')
  // The 404 response itself is expected here.
  errors.length = 0
})
