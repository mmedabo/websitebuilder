import { defineConfig, devices } from '@playwright/test'

// End-to-end tests run against the built site (dist/) on the same base path as
// GitHub Pages. Build first:
//   BASE=/websitebuilder/ SITE_URL=https://mmedabo.github.io/websitebuilder npm run build
// Then: npm test
//
// Env:
//   BASE        base path of the build under test (default '/websitebuilder/')
//   PW_CHROMIUM path to a local Chromium; runs the Chromium projects only, without
//               screenshot comparisons (their baselines come from the CI container)
//   CI          set by GitHub Actions: retries once, forbids test.only, never writes baselines

declare const process: { env: Record<string, string | undefined> }

const BASE = process.env.BASE ?? '/websitebuilder/'
const PORT = 4174
const LOCAL_CHROMIUM = process.env.PW_CHROMIUM

// SwiftShader gives headless Chromium a software WebGL, so the hero and globe render.
const chromiumLaunch = {
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  ...(LOCAL_CHROMIUM ? { executablePath: LOCAL_CHROMIUM } : {}),
}

const projects = [
  { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, launchOptions: chromiumLaunch } },
  { name: 'mobile-chrome', use: { ...devices['Pixel 7'], launchOptions: chromiumLaunch } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } } },
  { name: 'webkit', use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } } },
  { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
]

export default defineConfig({
  testDir: 'tests',
  outputDir: 'test-results',
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{arg}{ext}',
  timeout: 60_000,
  expect: { timeout: 10_000, toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled', caret: 'hide' } },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // In CI a missing baseline is a failure; the Tests workflow creates baselines on purpose.
  updateSnapshots: process.env.CI ? 'none' : 'missing',
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://localhost:${PORT}${BASE}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: (LOCAL_CHROMIUM ? projects.filter((p) => !p.name.includes('safari') && p.name !== 'firefox' && p.name !== 'webkit') : projects).map((p) => ({
    ...p,
    // Screenshot baselines exist for desktop Chromium only, made in the CI container.
    // VISUAL=1 runs them locally anyway (to try the tests, not to compare).
    grepInvert: p.name === 'chromium' && (!LOCAL_CHROMIUM || process.env.VISUAL === '1') ? undefined : /@visual/,
  })),
  webServer: {
    command: `npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}${BASE}`,
    env: { BASE },
    reuseExistingServer: !process.env.CI,
  },
})
