import { test, expect, openPanels } from './helpers'
import type { Page } from '@playwright/test'

const results = (page: Page) => page.locator('.search-results [role=option] strong').allTextContents()

async function open(page: Page, isMobile: boolean) {
  if (isMobile) await page.locator('.nav-search').click()
  else await page.keyboard.press('ControlOrMeta+k')
  await expect(page.locator('.search-box input')).toBeFocused()
}

async function search(page: Page, q: string) {
  await page.locator('.search-box input').fill(q)
  // Results update on input; wait until the list reflects this query.
  await expect(page.locator('.search-results')).toBeVisible()
  return results(page)
}

// The result each query must find. '!' means: must NOT be in the results.
const FINDS: [string, string][] = [
  ['sampling', 'How much the inspector checks.'],
  ['inspections', 'Follow-up Inspection'],
  ['follow up', 'Follow-up Inspection'],
  ['ul gs', 'UL-GS'],
  ['ulgs', 'UL-GS'],
  ['sukhumvit', 'Contact'],
  ['quote', 'How booking works'],
  ['lamp', 'Lighting'],
  ['led', '!Machine & Scrap Inspection'], // short words match at a word start only
  ['walmart', 'Selected clients'],
  ['japan', 'PSE'],
  ['certificate', 'Machine & Scrap Inspection'],
  ['section 30', 'Which rule applies to you?'],
  ['rohs', 'RoHS'],
  ['ＵＬ', 'UL'], // full-width letters
]

// The result each query must rank first.
const FIRST: [string, string][] = [
  ['phone', 'Contact'],
  ['address', 'Contact'],
  ['price', 'How booking works'],
  ['checklist', 'Before inspection day.'],
  ['sampling', 'How much the inspector checks.'],
  ['sony', 'Selected clients'],
  ['pse', 'PSE'],
  ['boi', 'Machine & Scrap Inspection'],
]

test.describe('quick search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./')
  })

  test('finds the right things', async ({ page, isMobile }) => {
    await open(page, isMobile)
    for (const [q, want] of FINDS) {
      if (want.startsWith('!')) await expect.poll(() => search(page, q), q).not.toContain(want.slice(1))
      else await expect.poll(() => search(page, q), q).toContain(want)
    }
  })

  test('ranks the best match first', async ({ page, isMobile }) => {
    await open(page, isMobile)
    for (const [q, want] of FIRST) await expect.poll(async () => (await search(page, q))[0], q).toBe(want)
  })

  test('Esc closes it', async ({ page, isMobile }) => {
    test.skip(isMobile, 'no keyboard on phones')
    await open(page, false)
    await search(page, 'pse')
    await page.keyboard.press('Escape')
    await expect(page.locator('.search-box input')).toBeHidden()
  })

  test('a result on the same page opens its tab and scrolls to it', async ({ page, isMobile }) => {
    await page.goto('./#marks')
    await open(page, isMobile)
    await expect.poll(() => search(page, 'enec')).toContain('ENEC')
    await page.locator('.search-results [role=option]').first().click()
    await expect(page).toHaveURL(/#mark-enec$/)
    await expect(page.locator('#mark-enec')).toBeInViewport()
  })

  test('the same result twice still scrolls', async ({ page, isMobile }) => {
    for (let i = 0; i < 2; i++) {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
      await open(page, isMobile)
      await expect.poll(async () => (await search(page, 'contact'))[0]).toBe('Contact')
      await page.locator('.search-results [role=option]').first().click()
      await expect.poll(() => openPanels(page)).toEqual(['contact'])
      await expect(page.locator('#contact')).toBeInViewport()
    }
  })

  test('a FAQ result on another page opens the answer', async ({ page, isMobile }) => {
    await page.goto('guides/boi-scrap-write-off/')
    await open(page, isMobile)
    await expect.poll(() => search(page, 'how much notice')).not.toEqual([])
    await page.locator('.search-results [role=option]').first().click()
    await page.waitForURL(/boi-machine-scrap-inspection\/#faq-\d+$/)
    const id = new URL(page.url()).hash.slice(1)
    await expect(page.locator(`#${id}`)).toHaveAttribute('open', '')
  })

  test('works in Thai and Japanese', async ({ page, isMobile }) => {
    await page.goto('th/')
    await open(page, isMobile)
    await expect.poll(() => search(page, 'ที่อยู่')).toContain('ติดต่อ') // address -> Contact
    await expect.poll(async () => (await search(page, 'ราคา')).length).toBeGreaterThan(0) // price
    await page.goto('ja/')
    await open(page, isMobile)
    await expect.poll(() => search(page, '住所')).toContain('お問い合わせ') // address -> Contact
    await expect.poll(async () => (await search(page, '見積')).length).toBeGreaterThan(0) // quote
  })
})
