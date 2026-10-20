import { useEffect, useState } from 'react'

// Two hero versions for review: A = shader field + thinking orb, B = Bangkok night photo.
export type Variant = 'shader' | 'photo'

const KEY = 'ii-concept-variant'
const isVariant = (v: unknown): v is Variant => v === 'shader' || v === 'photo'

function initial(): Variant {
  const q = new URLSearchParams(window.location.search).get('v')
  if (isVariant(q)) return q
  try {
    const saved = localStorage.getItem(KEY)
    if (isVariant(saved)) return saved
  } catch {
    // storage blocked: fall back to the default
  }
  return 'shader'
}

// The URL (?v=photo) makes a version shareable; storage remembers the last choice.
// Only the home page has the two versions, so other pages leave the URL alone.
export function useVariant(syncUrl = true) {
  const [variant, setVariant] = useState<Variant>(initial)
  useEffect(() => {
    document.documentElement.dataset.variant = variant
    try {
      localStorage.setItem(KEY, variant)
    } catch {
      // storage blocked: the URL still carries the choice
    }
    if (!syncUrl) return
    const url = new URL(window.location.href)
    url.searchParams.set('v', variant)
    window.history.replaceState(null, '', url)
  }, [variant, syncUrl])
  return [variant, setVariant] as const
}
