import { useEffect, useState } from 'react'
import { company } from '../content'
import Glass from '../effects/Glass'
import LiquidLogo from '../effects/LiquidLogo'

const links = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#marks', label: 'Marks' },
  { href: '#boi', label: 'BOI' },
  { href: '#expertise', label: 'Products' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav({ still }: { still: boolean }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header className={`nav-wrap ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="topbar container">
        <span>Sukhumvit 63, Bangkok</span>
        <a href={company.phones[0].href}>Tel {company.phones[0].label}</a>
        <a href={`mailto:${company.email}`}>{company.email}</a>
        <span className="concept-tag" title="This is a design proposal, not the official website">
          Design concept
        </span>
      </div>
      <div className="container">
        <Glass as="nav" className="nav" radius={10} aria-label="Main">
          <a className="brand" href="#top" aria-label="International Inspection, home">
            <LiquidLogo size={36} still={still} />
            <span className="brand-text">
              <strong>International Inspection</strong>
              <small>Co., Ltd. · Est. 1989</small>
            </span>
          </a>
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
      </div>
    </header>
  )
}
