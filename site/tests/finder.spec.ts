import { test, expect, BASE } from './helpers'
import type { Page } from '@playwright/test'

const step = (page: Page) => page.locator('dialog.finder .finder-step')
const pick = (page: Page, text: string) => page.locator('dialog.finder .finder-options button', { hasText: text }).click()

test.describe('service finder', () => {
  test('commercial path: 3 steps, then the form arrives filled in', async ({ page }) => {
    await page.goto('./?v=shader')
    await page.locator('.hero .finder-cta').click()
    await expect(page.locator('dialog.finder')).toBeVisible()
    await expect(step(page)).toHaveText('Step 1 of 3')
    await pick(page, 'own requirements')
    await expect(step(page)).toHaveText('Step 2 of 3')
    await pick(page, 'Vietnam')
    await expect(page.locator('.finder-body h2')).toHaveText('Which inspection?')
    await pick(page, 'Final pre-shipment')
    await expect(page.locator('.finder-result h2')).toHaveText('Commercial Inspection')

    // Back returns one step and keeps the answers.
    await page.locator('.finder-foot button', { hasText: 'Back' }).click()
    await expect(page.locator('.finder-body h2')).toHaveText('Which inspection?')
    await pick(page, 'Final pre-shipment')

    const request = page.locator('.finder-result a.btn').first()
    await expect(request).toHaveAttribute('href', `${BASE}services/commercial-inspection/?country=Vietnam&inspectionType=Final+pre-shipment+inspection#contact`)
    await request.click()
    await page.waitForURL(/commercial-inspection/)
    await expect(page.locator('#contact select[name=service]')).toHaveValue('commercial')
    await expect(page.locator('#contact select[name=country]')).toHaveValue('Vietnam')
    await expect(page.locator('#contact select[name=inspectionType]')).toHaveValue('Final pre-shipment inspection')
  })

  test('BOI path skips the country step', async ({ page }) => {
    await page.goto('./#services')
    await page.locator('#panel-services .finder-cta').click()
    await pick(page, 'BOI')
    await expect(step(page)).toHaveText('Step 2 of 2')
    await pick(page, 'Both')
    await expect(page.locator('.finder-result a.btn').first()).toHaveAttribute('href', `${BASE}services/boi-machine-scrap-inspection/?boiType=Both#contact`)
  })

  test('sourcing goes straight to the result; outside ASEAN shows a note', async ({ page }) => {
    await page.goto('./#services')
    await page.locator('#panel-services .finder-cta').click()
    await pick(page, 'Thai suppliers')
    await expect(page.locator('.finder-result h2')).toHaveText('Sourcing')
    await page.locator('.finder-foot button', { hasText: 'Start again' }).click()
    await pick(page, 'safety mark')
    await pick(page, 'Outside ASEAN')
    await pick(page, 'Not sure')
    await expect(page.locator('.finder-result')).toContainText('outside ASEAN')
  })

  test('Esc closes it', async ({ page, isMobile }) => {
    test.skip(isMobile, 'no keyboard on phones')
    await page.goto('./')
    await page.locator('.hero .finder-cta').click()
    await expect(page.locator('dialog.finder')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('dialog.finder')).toBeHidden()
  })

  test('fits the screen in Thai', async ({ page }) => {
    await page.goto('th/')
    await page.locator('.hero .finder-cta').click()
    await page.locator('dialog.finder .finder-options button').nth(1).click()
    const box = await page.locator('dialog.finder').boundingBox()
    const width = page.viewportSize()!.width
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(width)
  })
})
