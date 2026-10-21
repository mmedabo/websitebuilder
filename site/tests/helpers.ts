import fs from 'node:fs'
import { test as base, expect, type Page } from '@playwright/test'

declare const process: { env: Record<string, string | undefined> }

export { expect }

type Text = Record<string, string>
export type PageDef = { path: string; kind: string; title: Text; description: Text; noindex?: boolean }
export type LangDef = { id: string; prefix: string; html: string }

// The site's own page list: the tests follow it, so a new page is tested by default.
const site = JSON.parse(fs.readFileSync(new URL('../src/pages.json', import.meta.url), 'utf8'))
export const PAGES: PageDef[] = site.pages
export const LANGS: LangDef[] = site.langs
export const REDIRECTS: Record<string, string> = site.redirects

// Base path of the build under test, e.g. '/websitebuilder/'. Links in the HTML start with it.
export const BASE = process.env.BASE ?? '/websitebuilder/'

// Relative URL for page.goto (resolved against baseURL). './' is the home page.
export const at = (path: string) => (path === '' ? './' : path)

// Every test fails on a page error, a console error or a failed request to the site.
// A test that expects one (the 404 page) clears the list.
export const test = base.extend<{ errors: string[] }>({
  errors: [
    async ({ page, baseURL }, use) => {
      const errors: string[] = []
      const origin = new URL(baseURL!).origin
      page.on('pageerror', (e) => errors.push(`page error: ${e.message}`))
      page.on('console', (m) => {
        // A mailto: link with no mail app logs an error in some browsers.
        if (m.type() === 'error' && !/mailto/i.test(m.text())) errors.push(`console: ${m.text()}`)
      })
      page.on('response', (r) => {
        if (r.url().startsWith(origin) && r.status() >= 400) errors.push(`HTTP ${r.status()}: ${r.url()}`)
      })
      page.on('requestfailed', (r) => {
        const why = r.failure()?.errorText ?? ''
        // Navigation away cancels pending requests; that is not a fault.
        if (r.url().startsWith(origin) && !/abort|cancel/i.test(why)) errors.push(`request failed: ${r.url()} ${why}`)
      })
      await use(errors)
      expect(errors, 'page errors, console errors and failed requests').toEqual([])
    },
    { auto: true },
  ],
})

// Analytics events pushed by the site (window.dataLayer).
export async function trackEvents(page: Page) {
  await page.addInitScript(() => {
    // Keep an existing list: WebKit re-runs init scripts when the form hands off to mailto:.
    const w = window as unknown as { dataLayer?: unknown[] }
    w.dataLayer = w.dataLayer ?? []
  })
}
export const events = (page: Page) =>
  page.evaluate(() => ((window as unknown as { dataLayer: { event: string }[] }).dataLayer ?? []).map((e) => e.event))

// The visible home-page tab panels.
export const openPanels = (page: Page) =>
  page.evaluate(() => [...document.querySelectorAll<HTMLElement>('.tab-panel')].filter((p) => !p.hidden).map((p) => p.dataset.panel))

export const horizontalOverflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
