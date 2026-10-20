import data from './pages.json'

// Every page is a real static HTML file (see scripts/build-pages.mjs), so
// navigation is plain links; the app only reads which page it is on.
export type PageKind = 'home' | 'service' | 'privacy' | 'notfound'
export type PageInfo = { path: string; kind: PageKind; service?: string; title: string; description: string }

export const BASE = import.meta.env.BASE_URL // '/' locally, '/websitebuilder/' on GitHub Pages
export const pages = data.pages as PageInfo[]

export function currentPage(): PageInfo {
  let path = decodeURIComponent(window.location.pathname)
  if (path.startsWith(BASE)) path = path.slice(BASE.length)
  path = path.replace(/index\.html$/, '')
  if (path && !path.endsWith('/')) path += '/'
  return pages.find((p) => p.path === path) ?? { path, kind: 'notfound', title: 'Page not found', description: '' }
}

export const pageHref = (path: string) => BASE + path

export const servicePath = (serviceId: string) => pages.find((p) => p.service === serviceId)?.path ?? ''

export const serviceHref = (serviceId: string) => pageHref(servicePath(serviceId))

// Section anchors live on the home page; from other pages, link back to it.
export const homeHref = (hash: string) => (currentPage().kind === 'home' ? hash : BASE + hash)
