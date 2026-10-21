// TEMPORARY: diagnostics for two CI-only failures. No assertions; prints what it sees.
import { test } from './helpers'

test('diag: webkit finder stability', async ({ page, browserName, isMobile }) => {
  test.skip(browserName !== 'webkit' || isMobile)
  await page.goto('./#services')
  await page.waitForTimeout(1500)
  await page.locator('#panel-services .finder-cta').click()
  await page.locator('dialog.finder .finder-options button', { hasText: 'BOI' }).click()
  await page.waitForTimeout(800)
  const info = await page.evaluate(async () => {
    const btn = [...document.querySelectorAll('dialog.finder .finder-options button')].find((b) => b.textContent!.includes('Both'))!
    const rects: string[] = []
    for (let i = 0; i < 12; i++) {
      const r = btn.getBoundingClientRect()
      rects.push(`${r.x.toFixed(2)},${r.y.toFixed(2)},${r.width.toFixed(2)}x${r.height.toFixed(2)} sy=${scrollY.toFixed(1)}`)
      await new Promise((ok) => requestAnimationFrame(ok))
    }
    const anims = document.getAnimations().map((a) => {
      const t = (a.effect as KeyframeEffect | null)?.target as Element | null
      return `${(a as CSSAnimation).animationName ?? (a as CSSTransition).transitionProperty} on ${t?.tagName}.${t?.className} ${a.playState}`
    })
    const d = document.querySelector('dialog.finder')!.getBoundingClientRect()
    return { rects, anims, dialog: `${d.x},${d.y},${d.width}x${d.height}`, hover: btn.matches(':hover'), transform: getComputedStyle(btn).transform }
  })
  console.log('DIAG finder ' + JSON.stringify(info, null, 1))
})
