// Languages. English lives at the site root; Thai and Japanese under /th/ and /ja/.
// Each page is a static file, so the language is fixed for the whole page load.
export type Lang = 'en' | 'th' | 'ja'

export const LANGS: { id: Lang; label: string; name: string; locale: string; prefix: string }[] = [
  { id: 'en', label: 'EN', name: 'English', locale: 'en-GB', prefix: '' },
  { id: 'th', label: 'ไทย', name: 'ภาษาไทย', locale: 'th-TH', prefix: 'th/' },
  { id: 'ja', label: '日本語', name: '日本語', locale: 'ja-JP', prefix: 'ja/' },
]

const BASE = import.meta.env.BASE_URL

// The path after the site base, with any language prefix still on it.
export const sitePath = () => {
  const p = decodeURIComponent(window.location.pathname)
  return p.startsWith(BASE) ? p.slice(BASE.length) : p.replace(/^\//, '')
}

function detect(): Lang {
  const first = sitePath().split('/')[0]
  return first === 'th' || first === 'ja' ? first : 'en'
}

export const lang: Lang = detect()
export const langInfo = LANGS.find((l) => l.id === lang)!
