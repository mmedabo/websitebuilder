import AxeBuilder from '@axe-core/playwright'
import { test, expect, PAGES, LANGS, at, openPanels } from './helpers'
import type { Page } from '@playwright/test'

// axe-core checks against WCAG 2.1 A and AA. Layout matters for contrast and
// target size, so this runs in desktop and mobile Chromium.
test.skip(({ browserName }) => browserName !== 'chromium', 'Chromium only')
// Reduced motion: reveal and fold animations finish at once, so axe never sees text mid-fade.
test.use({ reducedMotion: 'reduce' })

async function axe(page: Page, include?: string) {
  let builder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  if (include) builder = builder.include(include)
  const { violations } = await builder.analyze()
  return violations.map((v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.map((n) => n.target.join(' ')).slice(0, 5).join(' | ')}`)
}

for (const lang of LANGS) {
  for (const def of PAGES) {
    const path = lang.prefix + def.path
    test(`/${path} has no WCAG A/AA violations`, async ({ page }) => {
      await page.goto(at(path), { waitUntil: 'networkidle' })
      expect(await axe(page)).toEqual([])
    })
  }
}

const TABS = ['about', 'services', 'marks', 'coverage', 'boi', 'expertise', 'why', 'documents', 'contact']
for (const id of TABS) {
  test(`home tab "${id}" has no violations`, async ({ page }) => {
    await page.goto(`./#${id}`, { waitUntil: 'networkidle' })
    await expect.poll(() => openPanels(page)).toEqual([id])
    expect(await axe(page, `#panel-${id}`)).toEqual([])
  })
}

test('search dialog has no violations', async ({ page }) => {
  await page.goto('./')
  await page.locator('.nav-search').click()
  await page.locator('.search-box input').fill('inspection')
  await expect(page.locator('.search-results [role=option]').first()).toBeVisible()
  expect(await axe(page, '.search-box')).toEqual([])
})

test('service finder dialog has no violations', async ({ page }) => {
  await page.goto('./')
  await page.locator('.hero .finder-cta').click()
  expect(await axe(page, 'dialog.finder')).toEqual([])
  await page.locator('dialog.finder .finder-options button').first().click()
  expect(await axe(page, 'dialog.finder')).toEqual([])
})

test('portal dashboard has no violations', async ({ page }) => {
  await page.goto('portal/')
  await page.locator('.portal-card .btn').click()
  await expect(page.locator('.portal-banner')).toBeVisible()
  expect(await axe(page)).toEqual([])
})

test('open phone menu has no violations', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'phone menu only')
  await page.goto('./')
  await page.locator('.nav-toggle').click()
  expect(await axe(page, '.nav')).toEqual([])
})
