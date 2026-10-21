import { test, expect, BASE, openPanels } from './helpers'

const TABS = ['about', 'services', 'marks', 'coverage', 'boi', 'expertise', 'why', 'documents', 'contact']

test.describe('home page tabs', () => {
  test('only About is open at first', async ({ page }) => {
    await page.goto('./')
    await expect(page.locator('.tab-panel')).toHaveCount(TABS.length)
    expect(await openPanels(page)).toEqual(['about'])
  })

  test('each tab opens its panel and sets the address', async ({ page }) => {
    await page.goto('./')
    for (const id of TABS) {
      await page.locator(`.tabs-bar [aria-controls="panel-${id}"]`).click()
      await expect.poll(() => openPanels(page)).toEqual([id])
      await expect(page).toHaveURL(new RegExp(`#${id}$`))
      await expect(page.locator(`.tabs-bar [aria-controls="panel-${id}"]`)).toHaveAttribute('aria-selected', 'true')
    }
  })

  test('an address with #tab opens that tab', async ({ page }) => {
    for (const id of ['marks', 'documents', 'contact']) {
      await page.goto(`./#${id}`)
      await expect.poll(() => openPanels(page)).toEqual([id])
    }
  })

  test('arrow keys move between tabs', async ({ page, isMobile }) => {
    test.skip(isMobile, 'no keyboard on phones')
    await page.goto('./#marks')
    await page.locator('#tab-marks').focus()
    await page.keyboard.press('ArrowRight')
    await expect.poll(() => openPanels(page)).toEqual(['coverage'])
    await page.keyboard.press('ArrowLeft')
    await expect.poll(() => openPanels(page)).toEqual(['marks'])
  })

  test('pager moves to the next tab and stops at the last', async ({ page }) => {
    await page.goto('./#documents')
    await page.locator('.tabs-pager .pager-btn.is-next').click()
    await expect.poll(() => openPanels(page)).toEqual(['contact'])
    await expect(page.locator('.tabs-pager .pager-btn.is-next')).toHaveCount(0)
  })

  // By design a tab click replaces the address instead of adding a history entry,
  // so Back leaves the page rather than stepping through tabs.
  test('tab clicks do not add history entries', async ({ page }) => {
    await page.goto('./')
    const before = await page.evaluate(() => history.length)
    await page.locator('#tab-marks').click()
    await page.locator('#tab-boi').click()
    await expect.poll(() => openPanels(page)).toEqual(['boi'])
    expect(await page.evaluate(() => history.length)).toBe(before)
  })

  test('tab bar sits under the nav, active tab in view', async ({ page }) => {
    await page.goto('./#why')
    await expect.poll(() => openPanels(page)).toEqual(['why'])
    // Wait for the smooth scroll to settle.
    await expect
      .poll(() =>
        page.evaluate(() => {
          const bar = document.querySelector('.tabs-bar')!.getBoundingClientRect()
          const nav = document.querySelector('.nav')!.getBoundingClientRect()
          const tab = document.querySelector('#tab-why')!.getBoundingClientRect()
          return { underNav: bar.top >= nav.bottom - 2, tabIn: tab.left >= 0 && tab.right <= innerWidth }
        }),
      )
      .toEqual({ underNav: true, tabIn: true })
  })
})

test.describe('links into the home page', () => {
  test('nav link opens the Products tab', async ({ page, isMobile }) => {
    await page.goto('./')
    if (isMobile) {
      await page.locator('.nav-toggle').click()
      await expect(page.locator('.nav-toggle')).toHaveAttribute('aria-expanded', 'true')
    }
    await page.locator('.nav-links a[href$="#expertise"]').click()
    await expect.poll(() => openPanels(page)).toEqual(['expertise'])
    if (isMobile) await expect(page.locator('.nav-toggle')).toHaveAttribute('aria-expanded', 'false')
  })

  test('hero Request button opens Contact and scrolls to it', async ({ page }) => {
    await page.goto('./')
    await page.locator('.hero-actions a[href$="#contact"]').click()
    await expect.poll(() => openPanels(page)).toEqual(['contact'])
    // The section heading lands near the top, under the sticky bars.
    await expect
      .poll(() =>
        page.evaluate(() => {
          const top = document.querySelector('#contact')!.getBoundingClientRect().top
          return top > 40 && top < 300
        }),
      )
      .toBe(true)
  })

  test('footer link from a service page opens the tab', async ({ page }) => {
    await page.goto('services/sourcing/')
    await page.locator('.footer a[href$="#expertise"]').click()
    await page.waitForURL(/#expertise$/)
    await expect.poll(() => openPanels(page)).toEqual(['expertise'])
  })
})

test('language links keep the page, the hero version and the section', async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin
  await page.goto('th/services/sourcing/?v=photo#faq')
  await page.locator('.langs a[hreflang=ja-JP]').click()
  await page.waitForURL(`${origin}${BASE}ja/services/sourcing/?v=photo#faq`)
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja')
  await page.locator('.langs a[hreflang=en-GB]').click()
  await page.waitForURL(`${origin}${BASE}services/sourcing/?v=photo#faq`)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('hero version switch: B shows the photo and stays after reload', async ({ page }) => {
  await page.goto('./?v=shader')
  await expect(page.locator('html')).toHaveAttribute('data-variant', 'shader')
  await page.locator('.switcher button[role=radio]').nth(1).click()
  await expect(page.locator('html')).toHaveAttribute('data-variant', 'photo')
  await expect(page).toHaveURL(/[?&]v=photo/)
  await page.goto('./')
  await expect(page.locator('html')).toHaveAttribute('data-variant', 'photo')
  // Other pages have one version only and leave the address alone.
  await page.goto('privacy/')
  await expect(page).not.toHaveURL(/[?&]v=/)
})
