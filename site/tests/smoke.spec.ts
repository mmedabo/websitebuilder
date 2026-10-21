import { test, expect, PAGES, LANGS, at, horizontalOverflow } from './helpers'

// Every page in every language, in every browser project: it loads, it has the right
// language and metadata, its images load, and nothing overflows the screen.
for (const lang of LANGS) {
  for (const def of PAGES) {
    const path = lang.prefix + def.path
    test(`/${path} (${lang.id}) loads cleanly`, async ({ page, request }) => {
      const res = await page.goto(at(path), { waitUntil: 'networkidle' })
      expect(res?.status()).toBe(200)

      await expect(page.locator('html')).toHaveAttribute('lang', lang.html)
      await expect(page).toHaveTitle(def.title[lang.id])
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('h1')).not.toBeEmpty()

      const head = await page.evaluate(() => ({
        description: document.querySelector('meta[name=description]')?.getAttribute('content') ?? '',
        canonical: document.querySelector('link[rel=canonical]')?.getAttribute('href') ?? '',
        robots: document.querySelector('meta[name=robots]')?.getAttribute('content') ?? '',
        alternates: [...document.querySelectorAll('link[rel=alternate][hreflang]')].map((l) => [l.getAttribute('hreflang'), l.getAttribute('href')]),
        jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent ?? ''),
      }))
      expect(head.description).toBe(def.description[lang.id])
      expect(head.canonical).toMatch(new RegExp(`^https://.+/${path.replace(/\//g, '\\/')}$`))
      // The concept is not for search engines yet.
      expect(head.robots).toContain('noindex')
      // One alternate per language plus x-default, each for this same page.
      expect(head.alternates).toHaveLength(LANGS.length + 1)
      for (const [, href] of head.alternates) expect(href).toMatch(new RegExp(`/${def.path.replace(/\//g, '\\/')}$`))
      for (const ld of head.jsonLd) expect(() => JSON.parse(ld)).not.toThrow()

      // Images: every src answers 200 and every loaded image has pixels.
      const images = await page.evaluate(() =>
        [...document.images].map((i) => ({ src: i.currentSrc || i.src, loaded: i.complete && i.naturalWidth > 0, lazy: i.loading === 'lazy' })),
      )
      for (const img of images) {
        if (!img.src) continue
        expect((await request.get(img.src)).status(), img.src).toBe(200)
        if (!img.lazy) expect(img.loaded, `image has no pixels: ${img.src}`).toBe(true)
      }

      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0)
    })
  }
}
