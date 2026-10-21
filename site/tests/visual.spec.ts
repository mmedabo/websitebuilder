import { test, expect, openPanels } from './helpers'
import type { Page } from '@playwright/test'

// Screenshot comparisons (tag @visual). Baselines live in tests/__screenshots__/chromium
// and come from the CI container (same browser build and fonts every run). To refresh
// them after an intended design change, run the "Tests" workflow by hand with
// "update screenshots" ticked; it commits the new images to the branch.
//
// Reduced motion stops the marquee and reveal animations. WebGL is switched off, so
// the hero and globe show their static fallback (WebGL output differs between runs).
// The date is fixed.
test.use({ reducedMotion: 'reduce', timezoneId: 'Asia/Bangkok' })

async function ready(page: Page, path: string) {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
      return /webgl/.test(type) ? null : getContext.call(this, type as '2d', ...(rest as []))
    } as typeof getContext
  })
  await page.clock.setFixedTime(new Date('2026-10-21T10:00:00+07:00'))
  await page.goto(path, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
}

const shot = (page: Page, selector: string, name: string) =>
  expect(page.locator(selector).first()).toHaveScreenshot(`${name}.png`, { mask: [page.locator('canvas')] })

test('home hero @visual', async ({ page }) => {
  await ready(page, './?v=photo')
  await expect(page).toHaveScreenshot('home-hero.png', { mask: [page.locator('canvas')] })
})

test('home clients @visual', async ({ page }) => {
  await ready(page, './?v=photo')
  await shot(page, '#clients', 'home-clients')
})

for (const id of ['about', 'services', 'marks', 'coverage', 'boi', 'expertise', 'why', 'documents', 'contact']) {
  test(`home tab ${id} @visual`, async ({ page }) => {
    await ready(page, `./?v=photo#${id}`)
    await expect.poll(() => openPanels(page)).toEqual([id])
    await shot(page, `#panel-${id}`, `tab-${id}`)
  })
}

const pages: [string, string, string][] = [
  ['services/commercial-inspection/', '.svc-hero', 'service-hero'],
  ['th/services/boi-machine-scrap-inspection/', '.svc-hero', 'service-hero-th'],
  ['ja/guides/boi-scrap-write-off/', '.svc-hero', 'guide-hero-ja'],
  ['services/boi-machine-scrap-inspection/', '#contact', 'service-form'],
  ['inspection-day/', 'main', 'inspection-day'],
  ['present/', '.deck', 'present-slide-1'],
  ['privacy/', 'main', 'privacy'],
]
for (const [path, selector, name] of pages) {
  test(`${name} @visual`, async ({ page }) => {
    await ready(page, path)
    await shot(page, selector, name)
  })
}

test('portal dashboard @visual', async ({ page }) => {
  await ready(page, 'portal/')
  await page.locator('.portal-card .btn').click()
  await shot(page, 'main', 'portal-dashboard')
})
