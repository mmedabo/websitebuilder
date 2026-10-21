import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { locale } from '../content'
import { track } from '../analytics'
import { search, suggestions, type Entry } from '../search'

// Quick search: Ctrl+K / Cmd+K, "/", or the search button in the nav.
export const OPEN_SEARCH = 'ii:open-search'
export const openSearch = () => window.dispatchEvent(new Event(OPEN_SEARCH))

// Wrap the first match of the query in <mark>.
function Highlight({ text, q }: { text: string; q: string }) {
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  )
}

export default function QuickSearch() {
  const t = locale.search
  const ref = useRef<HTMLDialogElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const results = useMemo<Entry[]>(() => (q.trim() ? search(q) : suggestions()), [q])

  useEffect(() => {
    const open = () => {
      if (ref.current?.open) return
      setQ('')
      setActive(0)
      ref.current?.showModal()
      track('search_open')
    }
    const onKey = (e: globalThis.KeyboardEvent) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement).tagName)
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing)) {
        e.preventDefault()
        open()
      }
    }
    window.addEventListener(OPEN_SEARCH, open)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener(OPEN_SEARCH, open)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => setActive(0), [q])

  // Keep the active result in view.
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const n = results.length
      if (n) setActive((a) => (a + (e.key === 'ArrowDown' ? 1 : -1) + n) % n)
    } else if (e.key === 'Escape') {
      // A search field clears itself on the first Esc; close at once instead.
      e.preventDefault()
      ref.current?.close()
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault()
      listRef.current?.querySelector<HTMLAnchorElement>(`[data-i="${active}"] a`)?.click()
    }
  }

  const go = (r: Entry) => {
    track('search_go', { group: r.group, query: q.slice(0, 40) })
    ref.current?.close()
  }

  // Group results under headings, keeping the ranked order of groups.
  const groups: [string, { r: Entry; i: number }[]][] = []
  results.forEach((r, i) => {
    const g = groups.find(([k]) => k === r.group)
    if (g) g[1].push({ r, i })
    else groups.push([r.group, [{ r, i }]])
  })

  return (
    <dialog ref={ref} className="search" aria-label={t.open} onClick={(e) => e.target === ref.current && ref.current?.close()}>
      <div className="search-box">
        <svg viewBox="0 0 24 24" aria-hidden className="search-icon">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.5 15.5 21 21" />
        </svg>
        <input
          autoFocus
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKey}
          placeholder={t.placeholder}
          aria-label={t.placeholder}
          aria-controls="search-results"
          aria-activedescendant={results[active] ? `sr-${active}` : undefined}
          role="combobox"
          aria-expanded
        />
        <kbd>Esc</kbd>
      </div>
      <ul className="search-results" id="search-results" role="listbox" ref={listRef}>
        {groups.map(([g, items]) => (
          <li key={g} role="presentation">
            <p className="sr-group">{t.groups[g as keyof typeof t.groups]}</p>
            <ul role="presentation">
              {items.map(({ r, i }) => (
                <li key={r.href + r.title} data-i={i} role="presentation" onMouseMove={() => setActive(i)}>
                  <a
                    id={`sr-${i}`}
                    role="option"
                    aria-selected={i === active}
                    tabIndex={-1}
                    href={r.href}
                    target={r.external ? '_blank' : undefined}
                    rel={r.external ? 'noreferrer' : undefined}
                    onClick={() => go(r)}
                  >
                    <strong>
                      <Highlight text={r.title} q={q.trim()} />
                    </strong>
                    <span>{r.sub}</span>
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
        {q.trim() && !results.length && <li className="sr-empty">{t.empty}</li>}
      </ul>
      <p className="search-hint">{t.hint}</p>
    </dialog>
  )
}
