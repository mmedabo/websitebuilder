import { useEffect, useState } from 'react'
import Glass from '../effects/Glass'
import LiquidLogo from '../effects/LiquidLogo'

const links = [
  { href: '#services', label: 'Services' },
  { href: '#marks', label: 'Marks' },
  { href: '#coverage', label: 'Coverage' },
  { href: '#boi', label: 'BOI' },
  { href: '#why', label: 'Why II' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav({ still }: { still: boolean }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header className={`nav-wrap ${scrolled ? 'is-scrolled' : ''}`}>
      <Glass as="nav" className="nav" radius={22} aria-label="Main">
        <a className="brand" href="#top" aria-label="International Inspection — home">
          <LiquidLogo size={38} still={still} />
          <span className="brand-text">
            <strong>International Inspection</strong>
            <small>Thailand · since 1989</small>
          </span>
        </a>
        <span className="concept-tag" title="Concept redesign — not the official website">
          Concept
        </span>
        <ul className={`nav-links ${open ? 'is-open' : ''}`}>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a className="btn btn-small nav-cta" href="#contact">
          Request inspection
        </a>
        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </Glass>
    </header>
  )
}
