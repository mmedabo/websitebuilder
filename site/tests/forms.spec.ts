import { test, expect, trackEvents, events } from './helpers'
import type { Page } from '@playwright/test'

// Dates: the office is in Bangkok. Today is fixed so the holiday checks are repeatable:
// Wednesday 21 October 2026. Friday 23 October is a holiday (King Chulalongkorn Day).
test.use({ timezoneId: 'Asia/Bangkok' })
const TODAY = new Date('2026-10-21T10:00:00+07:00')

const form = '#contact form'
const field = (page: Page, name: string) => page.locator(`${form} [name=${name}]`)

async function fillBasics(page: Page) {
  await field(page, 'name').fill('Somchai Test')
  await field(page, 'company').fill('Test Co., Ltd.')
  await field(page, 'email').fill('qa@example.com')
}

test.describe('BOI request form', () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(TODAY)
    await trackEvents(page)
    await page.goto('services/boi-machine-scrap-inspection/')
  })

  test('earliest date is 3 working days ahead, skipping the holiday', async ({ page }) => {
    // Thu 22 (1), Fri 23 holiday, Sat, Sun, Mon 26 (2), Tue 27 (3).
    await expect(field(page, 'date')).toHaveAttribute('min', '2026-10-27')
    await expect(page.locator('.form-hint').first()).toContainText('Bank of Thailand')
  })

  const dates: [string, boolean, string][] = [
    ['2027-04-13', false, 'Songkran'],
    ['2027-04-17', false, 'weekend'],
    ['2026-10-26', false, 'less than 3 working days'],
    ['2028-03-15', true, 'not published'],
    ['2027-04-16', true, ''],
  ]
  for (const [date, valid, message] of dates) {
    test(`date ${date} is ${valid ? 'accepted' : 'refused'}`, async ({ page }) => {
      await field(page, 'date').fill(date)
      expect(await field(page, 'date').evaluate((i: HTMLInputElement) => i.checkValidity())).toBe(valid)
      if (message) await expect(page.locator('.date-msg')).toContainText(message)
      else await expect(page.locator('.date-msg')).toHaveCount(0)
    })
  }

  test('consent is required; the request is shown to copy', async ({ page, browserName }) => {
    // Headless browsers differ on the clipboard (Firefox never settles), so record what is copied.
    await page.addInitScript(() => {
      const record = async (t: string) => void ((window as unknown as { copied: string }).copied = t)
      try {
        Object.defineProperty(navigator, 'clipboard', { value: { writeText: record }, configurable: true })
      } catch {
        navigator.clipboard.writeText = record
      }
    })
    await page.reload()
    await page.locator('.faq-list summary').first().click()
    await fillBasics(page)
    await field(page, 'boiType').selectOption('Scrap inspection')
    await field(page, 'site').fill('Amata City Chonburi')
    await field(page, 'date').fill('2026-10-27')
    await field(page, 'message').fill('About 35 items.')

    await page.locator(`${form} button[type=submit]`).click()
    await expect(page.locator('.sent')).toHaveCount(0)
    expect(await field(page, 'consent').evaluate((i: HTMLInputElement) => i.validity.valueMissing)).toBe(true)

    await field(page, 'consent').check()
    await page.locator(`${form} button[type=submit]`).click()
    const sent = page.locator('.sent textarea')
    await expect(sent).toHaveValue(/Subject: Inspection request: Machine & Scrap Inspection/)
    await expect(sent).toHaveValue(/Planned inspection date: 2026-10-27/)
    await expect(sent).toHaveValue(/Factory location: Amata City Chonburi/)
    await expect(sent).toHaveValue(/About 35 items\./)

    expect(await events(page)).toEqual(expect.arrayContaining(['faq_open', 'request_submit']))

    // Headless Firefox has no mail app: after the mailto: hand-off, clicks on the page
    // no longer reach it. The other browsers check the copy step.
    if (browserName === 'firefox') return
    await page.locator('.sent button', { hasText: 'Copy request' }).click()
    await expect(page.locator('.sent button')).toHaveText('Copied')
    expect(await page.evaluate(() => (window as unknown as { copied: string }).copied)).toBe(await sent.inputValue())
    expect(await events(page)).toContain('request_copy')
  })
})

test('home form: fields follow the chosen service', async ({ page }) => {
  await page.goto('./#contact')
  await field(page, 'service').selectOption('commercial')
  await expect(field(page, 'inspectionType')).toBeVisible()
  await field(page, 'service').selectOption('sourcing')
  await expect(field(page, 'destination')).toBeVisible()
  await expect(field(page, 'inspectionType')).toHaveCount(0)
})

test('Japanese form: labels in Japanese, the email in English', async ({ page }) => {
  await page.clock.setFixedTime(TODAY)
  await page.goto('ja/services/boi-machine-scrap-inspection/')
  await fillBasics(page)
  await field(page, 'country').selectOption('Vietnam')
  await expect(page.locator(`${form} select[name=boiType] option[value=Both]`)).toHaveText('両方')
  await field(page, 'boiType').selectOption('Both')
  await field(page, 'site').fill('Rayong')
  await field(page, 'date').fill('2026-10-27')
  await field(page, 'consent').check()
  await expect(page.locator('.form-hint').first()).toContainText('営業日')
  await page.locator(`${form} button[type=submit]`).click()
  const sent = page.locator('.sent textarea')
  await expect(sent).toHaveValue(/Service: Machine & Scrap Inspection/)
  await expect(sent).toHaveValue(/Inspection: Both/)
  await expect(sent).toHaveValue(/Factory country: Vietnam/)
  await expect(sent).toHaveValue(/Factory location: Rayong/)
})

test('phone link records an event', async ({ page }) => {
  await trackEvents(page)
  await page.goto('services/product-testing/')
  // Keep the browser from trying to dial.
  await page.evaluate(() => document.addEventListener('click', (e) => (e.target as Element).closest('a[href^="tel:"]') && e.preventDefault()))
  await page.locator('.svc-actions a[href^="tel:"]').click()
  expect(await events(page)).toContain('phone_click')
})
