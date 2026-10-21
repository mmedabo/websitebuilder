import { test, expect, BASE, horizontalOverflow } from './helpers'

test.describe('BOI guide', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('guides/boi-scrap-write-off/')
  })

  test('rule tabs switch the rule', async ({ page }) => {
    await expect(page.locator('#rule-panel')).toContainText('destroyed by a method that BOI approves')
    await page.locator('#tab-s30').click()
    await expect(page.locator('#rule-panel')).toContainText('reduced Section 30 rate')
    await expect(page.locator('#rule-panel')).toContainText('Por. 4/2543')
  })

  test('sampling calculator rounds up', async ({ page }) => {
    await page.locator('.sampler input').fill('1000')
    await expect(page.locator('.sampler dd')).toHaveText(['100', '270', '370'])
    await page.locator('.sampler input').fill('35')
    await expect(page.locator('.sampler dd')).toHaveText(['4', '10', '14'])
  })

  test('checklist counts ticks; sources and request link are there', async ({ page }) => {
    await page.locator('.checklist input').nth(0).check()
    await page.locator('.checklist input').nth(2).check()
    await expect(page.locator('.checklist-head strong')).toHaveText('2 of 8 ready')
    await expect(page.locator('.documents .doc-group a')).toHaveCount(4)
    await expect(page.locator('.guide-cta a').first()).toHaveAttribute('href', `${BASE}services/boi-machine-scrap-inspection/#contact`)
  })
})

test.describe('client portal demo', () => {
  test('sign-in has no credential fields; dashboard shows sample bookings', async ({ page }) => {
    await page.goto('portal/')
    await expect(page.locator('input[type=password], input[type=email]')).toHaveCount(0)
    await page.locator('.portal-card .btn').click()
    await expect(page.locator('.portal-banner')).toContainText('fictional')
    await expect(page.locator('.portal-tiles dd')).toHaveText(['4', '1', '1'])
    await expect(page.locator('.portal-cert')).toHaveCount(1)
    await expect(page.locator('.portal-timeline li.is-done')).toHaveCount(4)

    await page.locator('.portal-row', { hasText: 'DEMO-0377' }).click()
    await expect(page.locator('.portal-cert')).toHaveCount(0)
    await page.locator('.portal-detail button', { hasText: 'Download report' }).click()
    await expect(page.locator('.portal-detail')).toContainText('This demo has no reports')
    await expect(page.locator('.portal-detail a', { hasText: 'Book again' })).toHaveAttribute('href', `${BASE}services/sourcing/#contact`)
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0)
  })
})

test.describe('inspection day story', () => {
  test('scrolling ticks the sheet and stamps the report', async ({ page }) => {
    await page.goto('inspection-day/')
    const sheet = () =>
      page.evaluate(() => ({
        now: [...document.querySelectorAll('.day-sheet li')].findIndex((x) => x.classList.contains('is-now')),
        done: document.querySelectorAll('.day-sheet li.is-done').length,
        photos: document.querySelector('.day-sheet')!.classList.contains('has-photos'),
        stamp: document.querySelector('.sheet-stamp')!.classList.contains('is-on'),
      }))
    await expect.poll(sheet).toMatchObject({ now: 0, stamp: false })
    const scrollToStage = (i: number) =>
      page.evaluate((i) => {
        const r = document.querySelectorAll('.day-stages li')[i].getBoundingClientRect()
        window.scrollTo({ top: scrollY + r.top + r.height / 2 - innerHeight / 2, behavior: 'instant' })
      }, i)
    await scrollToStage(4)
    await expect.poll(sheet).toMatchObject({ now: 4, done: 4, photos: true })
    await scrollToStage(5)
    await expect.poll(sheet).toMatchObject({ now: 5, stamp: true })
  })
})

test.describe('BOI steps', () => {
  test('reduced motion shows the steps without an empty scroll track', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('./#boi')
    const { section, viewport } = await page.evaluate(() => ({ section: document.querySelector('#boi')!.getBoundingClientRect().height, viewport: innerHeight }))
    expect(section).toBeLessThan(viewport * 1.6)
    await expect(page.locator('#boi .fold-card').first()).toBeVisible()
  })
})

test.describe('service comparison', () => {
  test('picks up to 3 services; a 4th replaces the oldest', async ({ page }) => {
    await page.goto('./#compare')
    const heads = page.locator('.compare-table thead th')
    await expect(heads).toHaveCount(3)
    await page.locator('.compare-chips button', { hasText: 'Sourcing' }).click()
    await expect(heads).toHaveCount(3)
    await expect(heads.filter({ hasText: 'Sourcing' })).toHaveCount(1)
    await expect(heads.filter({ hasText: 'Follow-up' })).toHaveCount(0)
    await page.locator('.compare-chips button', { hasText: 'Sourcing' }).click()
    await expect(heads).toHaveCount(2)
    await expect(page.locator('.compare-actions a').first()).toHaveAttribute('href', /#contact$/)
  })
})

test.describe('presentation', () => {
  test('keys move between the 10 slides', async ({ page, isMobile }) => {
    test.skip(isMobile, 'no keyboard on phones')
    await page.goto('present/')
    await expect(page.locator('.nav-wrap')).toHaveCount(0)
    const count = page.locator('.deck-count')
    await expect(count).toHaveText('01 / 10')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await expect(count).toHaveText('03 / 10')
    await page.keyboard.press('End')
    await expect(count).toHaveText('10 / 10')
    await expect(page.locator('.deck-bar button[aria-label="Next slide"]')).toBeDisabled()
    await page.keyboard.press('Home')
    await expect(count).toHaveText('01 / 10')
  })

  test('swipe moves on a phone', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'touch only')
    await page.goto('th/present/')
    await page.evaluate(() => {
      const deck = document.querySelector('.deck')!
      const touch = (type: string, x: number) => {
        const t = new Touch({ identifier: 1, target: deck, clientX: x, clientY: 300 })
        deck.dispatchEvent(new TouchEvent(type, { bubbles: true, touches: type === 'touchstart' ? [t] : [], changedTouches: [t] }))
      }
      touch('touchstart', 300)
      touch('touchend', 100)
    })
    await expect(page.locator('.deck-count')).toHaveText('02 / 10')
  })
})

test.describe('certification marks', () => {
  test('a market chip highlights its marks', async ({ page }) => {
    await page.goto('./#marks')
    const all = await page.locator('.stamps > li').count()
    await page.locator('.market-chips button', { hasText: 'Japan' }).click()
    await expect(page.locator('.market-route')).toContainText('Japan')
    const match = await page.locator('.stamps > li.is-match').count()
    const dim = await page.locator('.stamps > li.is-dim').count()
    expect(match).toBeGreaterThan(0)
    expect(match + dim).toBe(all)
    await expect(page.locator('.stamps > li.is-match', { hasText: 'PSE' })).toHaveCount(1)
  })

  test('marks stand straight (no tilt)', async ({ page }) => {
    await page.goto('./#marks')
    const tilted = await page.evaluate(() =>
      [...document.querySelectorAll('.stamps > li, .stamps > li *')].filter((el) => {
        const t = getComputedStyle(el).transform
        if (t === 'none') return false
        const [a, b] = t.replace(/^matrix\(|\)$/g, '').split(',').map(Number)
        return Math.abs(Math.atan2(b, a)) > 0.001
      }).length,
    )
    expect(tilted).toBe(0)
  })
})

test.describe('clients', () => {
  test('16 client logos load', async ({ page }) => {
    await page.goto('./')
    const logos = page.locator('#clients .client-logos img')
    await expect(logos).toHaveCount(16)
    await page.locator('#clients').scrollIntoViewIfNeeded()
    for (const img of await logos.all()) await expect.poll(() => img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true)
  })

  test('the name strip moves left to right', async ({ page }) => {
    await page.goto('./')
    const x = () => page.evaluate(() => document.querySelector('.client-track')!.getBoundingClientRect().left)
    const first = await x()
    await expect.poll(x).toBeGreaterThan(first)
  })

  test('the name strip stops for reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('./')
    const x = () => page.evaluate(() => document.querySelector('.client-track')!.getBoundingClientRect().left)
    const first = await x()
    await page.waitForTimeout(1000)
    expect(await x()).toBe(first)
  })
})

// Underlined text on the blue background was hard to read; keep it off.
test.describe('text on blue', () => {
  for (const path of ['./#services', 'services/commercial-inspection/', 'th/services/boi-machine-scrap-inspection/', 'ja/guides/boi-scrap-write-off/']) {
    test(`no underlined text on blue: ${path}`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'networkidle' })
      const underlined = await page.evaluate(() => {
        const onBlue = (el: Element | null) => {
          for (let e = el; e; e = e.parentElement) {
            const m = getComputedStyle(e).backgroundColor.match(/[\d.]+/g)
            if (m && (m[3] === undefined || +m[3] > 0.5)) {
              const [r, g, b] = m.map(Number)
              return b > 180 && r < 120 && g < 130
            }
          }
          return false
        }
        return [...document.querySelectorAll('body *')]
          .filter((el) => el.checkVisibility() && el.textContent!.trim() && getComputedStyle(el).textDecorationLine.includes('underline') && onBlue(el))
          .map((el) => el.textContent!.trim().slice(0, 40))
      })
      expect(underlined).toEqual([])
    })
  }
})
