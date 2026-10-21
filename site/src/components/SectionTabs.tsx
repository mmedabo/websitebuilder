import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { track } from '../analytics'
import { ui } from '../content'
import Glass from '../effects/Glass'

export type Panel = { id: string; label: string; node: ReactNode }

// The home page sections as tabs: one topic at a time instead of one long
// page. Every section keeps its id, so #links (nav, hero buttons, footer,
// shared URLs) open the right tab and scroll to it.
export default function SectionTabs({ panels }: { panels: Panel[] }) {
  const [active, setActive] = useState(panels[0].id)
  const activeRef = useRef(active)
  const pending = useRef<{ target: string; force: boolean } | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [mark, setMark] = useState({ x: 0, w: 0 })
  const index = panels.findIndex((p) => p.id === active)

  // The panel that holds the element with this id.
  const panelFor = (id: string) =>
    (id && document.getElementById(id)?.closest<HTMLElement>('[data-panel]')?.dataset.panel) || null

  // Scroll so the target sits under the sticky bar. Without force, only
  // scroll up (opening a tab from the top of the page stays put).
  const scrollTo = (target: string, force: boolean) => {
    const root = rootRef.current
    if (!root) return
    const el = document.getElementById(target)
    const first = panels.some((p) => p.id === target)
    const offset = (parseFloat(getComputedStyle(root).getPropertyValue('--tabs-top')) || 76) + 8
    const top = (first || !el ? root : el).getBoundingClientRect().top + window.scrollY - offset
    if (force || window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' })
  }

  const open = (id: string, target = id, force = false) => {
    if (id === activeRef.current) return scrollTo(target, force)
    pending.current = { target, force }
    activeRef.current = id
    setActive(id)
  }

  // After a tab opens, scroll to what was asked for.
  useEffect(() => {
    const p = pending.current
    if (!p) return
    pending.current = null
    requestAnimationFrame(() => scrollTo(p.target, p.force))
  }, [active])

  // In-page links and the URL hash open tabs.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]')
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return
      const id = a.getAttribute('href')!.slice(1)
      const panel = panelFor(id)
      if (!panel) return
      e.preventDefault()
      history.pushState(null, '', `#${id}`)
      open(panel, id, true)
    }
    const onHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      const panel = panelFor(id)
      if (panel) open(panel, id, true)
    }
    document.addEventListener('click', onClick)
    window.addEventListener('hashchange', onHash)
    onHash()
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('hashchange', onHash)
    }
  }, [])

  // The yellow highlighter slides to the active tab; the list scrolls it into view.
  useLayoutEffect(() => {
    const list = listRef.current
    const btn = list?.querySelector<HTMLElement>(`#tab-${active}`)
    if (!list || !btn) return
    const place = () => setMark({ x: btn.offsetLeft, w: btn.offsetWidth })
    place()
    list.scrollTo({ left: btn.offsetLeft - (list.clientWidth - btn.offsetWidth) / 2, behavior: 'smooth' })
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [active])

  const choose = (id: string) => {
    track('tab_open', { tab: id })
    history.replaceState(null, '', `#${id}`)
    open(id, id, true)
  }

  const onKey = (e: KeyboardEvent) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    const to = e.key === 'Home' ? 0 : e.key === 'End' ? panels.length - 1 : step ? (index + step + panels.length) % panels.length : -1
    if (to < 0) return
    e.preventDefault()
    choose(panels[to].id)
    listRef.current?.querySelector<HTMLElement>(`#tab-${panels[to].id}`)?.focus()
  }

  const prev = panels[index - 1]
  const next = panels[index + 1]
  const n = (i: number) => String(i + 1).padStart(2, '0')

  return (
    <div className="tabs" ref={rootRef}>
      <div className="tabs-bar">
        <div className="container">
          <Glass className="tabs-glass" radius={10} strength={18}>
            <div className="tabs-list" role="tablist" aria-label={ui.tabsAria} ref={listRef} onKeyDown={onKey}>
              <span className="tabs-mark" aria-hidden style={{ transform: `translateX(${mark.x}px)`, width: mark.w }} />
              {panels.map((p, i) => (
                <button
                  key={p.id}
                  id={`tab-${p.id}`}
                  role="tab"
                  aria-selected={p.id === active}
                  aria-controls={`panel-${p.id}`}
                  tabIndex={p.id === active ? 0 : -1}
                  onClick={() => choose(p.id)}
                >
                  <span className="tab-n">{n(i)}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </Glass>
        </div>
      </div>

      {panels.map((p) => (
        <div
          key={p.id}
          id={`panel-${p.id}`}
          className="tab-panel"
          role="tabpanel"
          aria-labelledby={`tab-${p.id}`}
          data-panel={p.id}
          hidden={p.id !== active}
        >
          {p.node}
        </div>
      ))}

      <nav className="container tabs-pager" aria-label={ui.tabsAria}>
        {prev ? (
          <button className="pager-btn is-prev" onClick={() => choose(prev.id)}>
            <small>
              ← {n(index - 1)} / {n(panels.length - 1)}
            </small>
            {prev.label}
          </button>
        ) : (
          <span />
        )}
        {next && (
          <button className="pager-btn is-next" onClick={() => choose(next.id)}>
            <small>
              {n(index + 1)} / {n(panels.length - 1)} →
            </small>
            {next.label}
          </button>
        )}
      </nav>
    </div>
  )
}
