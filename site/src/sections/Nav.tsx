import { useEffect, useState } from 'react'
import VersionSwitcher from '../components/VersionSwitcher'
import { company, locale, ui } from '../content'
import Glass from '../effects/Glass'
import LiquidLogo from '../effects/LiquidLogo'
import type { Variant } from '../variant'
import { track } from '../analytics'
import { LANGS, lang } from '../i18n'
import { currentPage, homeHref, langHref, pageHref, serviceHref } from '../routing'

// Built per page: section anchors point back to the home page from other pages.
const navLinks = () => [
  { href: homeHref('#about'), label: ui.nav.about },
  { href: homeHref('#services'), label: ui.nav.services },
  { href: homeHref('#marks'), label: ui.nav.marks },
  { href: serviceHref('boi'), label: ui.nav.boi },
  { href: homeHref('#expertise'), label: ui.nav.products },
  { href: contactHref(), label: ui.nav.contact },
]

// Home and service pages carry the request form; other pages link to the home one.
const contactHref = () => (['home', 'service'].includes(currentPage().kind) ? '#contact' : homeHref('#contact'))

export default function Nav({ still, variant, onVariant }: { still: boolean; variant: Variant; onVariant: (v: Variant) => void }) {
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
        <div className="review">
          <span className="concept-tag" title={ui.conceptTitle}>
            {ui.conceptTag}
          </span>
          {locale.machineTranslated && (
            <span className="mt-note" title={ui.mtTitle}>
              {ui.mtNote}
            </span>
          )}
          {/* The two versions differ only in the home-page hero. */}
          {currentPage().kind === 'home' && <VersionSwitcher variant={variant} onChange={onVariant} />}
        </div>
        <nav className="langs" aria-label={ui.langsLabel}>
          {LANGS.map((l) => (
            <a
              key={l.id}
              href={langHref(l.id)}
              hrefLang={l.locale}
              lang={l.locale}
              title={l.name}
              aria-current={l.id === lang}
              onClick={() => track('language_switch', { from: lang, to: l.id })}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <span className="topbar-info">{ui.topbarAddress}</span>
        <a className="topbar-info" href={company.phones[0].href} onClick={() => track('phone_click', { place: 'topbar' })}>
          {ui.tel} {company.phones[0].label}
        </a>
        <a className="topbar-info" href={`mailto:${company.email}`} onClick={() => track('email_click', { place: 'topbar' })}>
          {company.email}
        </a>
      </div>
      <div className="container">
        <Glass as="nav" className="nav" radius={10} aria-label={ui.navAria}>
          <a className="brand" href={pageHref('')} aria-label={ui.brandAria}>
            <LiquidLogo size={36} still={still} />
            <span className="brand-text">
              <strong>International Inspection</strong>
              <small>{ui.brandSmall}</small>
            </span>
          </a>
          <ul className={`nav-links ${open ? 'is-open' : ''}`}>
            {navLinks().map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="btn btn-small nav-cta" href={contactHref()}>
            {ui.requestInspection}
          </a>
          <button
            className="nav-toggle"
            aria-expanded={open}
            aria-label={open ? ui.menuClose : ui.menuOpen}
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
