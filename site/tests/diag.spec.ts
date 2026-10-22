// TEMPORARY: find what stops desktop WebKit from rendering frames in the service finder.
// No assertions; prints whether animation frames still arrive at each point.
import { test } from './helpers'
import type { Page } from '@playwright/test'

// Resolves with ms for 5 frames, or -frames seen if frames stop for 3 s.
const frames = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<number>((ok) => {
        let n = 0
        const t0 = performance.now()
        const f = () => (++n < 5 ? requestAnimationFrame(f) : ok(Math.round(performance.now() - t0)))
        requestAnimationFrame(f)
        setTimeout(() => ok(-n), 3000)
      }),
  )

const variants: [string, string, string][] = [
  ['as is', './#services', ''],
  ['no blueprint mask', './#services', '.services .blueprint{-webkit-mask-image:none!important;mask-image:none!important}'],
  ['no blueprint', './#services', '.services .blueprint{display:none!important}'],
  ['no dialog backdrop blur', './#services', '.finder::backdrop{-webkit-backdrop-filter:none!important;backdrop-filter:none!important}'],
  ['no glass blur', './#services', '.glass{-webkit-backdrop-filter:none!important;backdrop-filter:none!important}'],
  ['no animations', './#services', '*,*::before,*::after{animation:none!important;transition:none!important}'],
  ['from top of page', './', ''],
]

for (const [name, path, css] of variants) {
  test(`diag frames: ${name}`, async ({ page, browserName, isMobile }) => {
    test.skip(browserName !== 'webkit' || isMobile)
    await page.goto(path)
    if (css) await page.addStyleTag({ content: css })
    await page.waitForTimeout(1500)
    const a = await frames(page)
    await page.locator(path === './' ? '.hero .finder-cta' : '#panel-services .finder-cta').click()
    await page.waitForTimeout(800)
    const b = await frames(page)
    await page.locator('dialog.finder .finder-options button', { hasText: 'BOI' }).click({ timeout: 10_000 }).catch(() => {})
    await page.waitForTimeout(800)
    const c = await frames(page)
    console.log(`DIAG ${name}: loaded=${a} dialogOpen=${b} afterPick=${c}`)
  })
}
