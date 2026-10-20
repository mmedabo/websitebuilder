import { ui } from './content'
import data from './pages.json'
import { LANGS, lang, langInfo, sitePath, type Lang } from './i18n'

// Every page is a real static HTML file (see scripts/build-pages.mjs), so
// navigation is plain links; the app only reads which page it is on.
export type PageKind = 'home' | 'service' | 'guide' | 'portal' | 'privacy' | 'notfound'
type Text = Record<Lang, string>
type PageDef = { path: string; kind: PageKind; service?: string; title: Text; description: Text }
export type PageInfo = { path: string; kind: PageKind; service?: string; title: string; description: string }

export const BASE = import.meta.env.BASE_URL // '/' locally, '/websitebuilder/' on GitHub Pages
const defs = data.pages as PageDef[]

// The page path without the base and the language prefix, e.g. 'services/sourcing/'.
function pagePath() {
  let path = sitePath().replace(/index\.html$/, '')
  if (langInfo.prefix && path.startsWith(langInfo.prefix)) path = path.slice(langInfo.prefix.length)
  else if (langInfo.prefix && path === langInfo.prefix.slice(0, -1)) path = ''
  if (path && !path.endsWith('/')) path += '/'
  return path
}

export function currentPage(): PageInfo {
  const path = pagePath()
  const def = defs.find((p) => p.path === path)
  if (!def) return { path, kind: 'notfound', title: ui.nfTitle, description: '' }
  return { path, kind: def.kind, service: def.service, title: def.title[lang], description: def.description[lang] }
}

// Links stay in the current language.
export const pageHref = (path: string) => BASE + langInfo.prefix + path

export const servicePath = (serviceId: string) => defs.find((p) => p.service === serviceId)?.path ?? ''

export const serviceHref = (serviceId: string) => pageHref(servicePath(serviceId))

// Section anchors live on the home page; from other pages, link back to it.
export const homeHref = (hash: string) => (currentPage().kind === 'home' ? hash : pageHref('') + hash)

// The same page in another language. Keeps ?v= (hero version) and the #section.
export const langHref = (target: Lang) => {
  const info = LANGS.find((l) => l.id === target)!
  return BASE + info.prefix + pagePath() + window.location.search + window.location.hash
}
