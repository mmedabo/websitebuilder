import { company, locale, services, ui } from '../content'
import { homeHref, pageHref, serviceHref } from '../routing'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <img className="footer-logo" src={`${import.meta.env.BASE_URL}img/ii-logo.png`} alt={company.name} width={142} height={132} />
          <p className="footer-tag">{ui.footerTag}</p>
          <address>
            {company.address.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </address>
        </div>
        <nav aria-label={ui.footerServices}>
          <h3 className="h4">{ui.footerServices}</h3>
          <ul>
            {services.map((s) => (
              <li key={s.id}>
                <a href={serviceHref(s.id)}>{s.title}</a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={ui.footerCompany}>
          <h3 className="h4">{ui.footerCompany}</h3>
          <ul>
            <li><a href={homeHref('#about')}>{ui.footerAbout}</a></li>
            <li><a href={homeHref('#expertise')}>{ui.footerProducts}</a></li>
            <li><a href={homeHref('#why')}>{ui.footerWhy}</a></li>
            <li><a href={homeHref('#documents')}>{ui.footerDocs}</a></li>
            <li><a href={homeHref('#contact')}>{ui.footerContact}</a></li>
            <li><a href={pageHref('guides/boi-scrap-write-off/')}>{ui.footerGuide}</a></li>
            <li><a href={pageHref('portal/')}>{ui.footerPortal}</a></li>
            <li><a href={pageHref('privacy/')}>{ui.footerPrivacy}</a></li>
          </ul>
        </nav>
      </div>
      <div className="container footer-base">
        <span>© {new Date().getFullYear()} {company.name} {ui.rights}</span>
        <span>{ui.footerConcept}</span>
        {locale.machineTranslated && <span>{ui.mtTitle}</span>}
        <span className="photo-credit">
          {ui.photoCredit}{' '}
          <a href="https://commons.wikimedia.org/wiki/File:Chao_Phraya_et_Bang_Rak_vus_de_l%27Iconsiam.jpg" target="_blank" rel="noreferrer">
            Chao Phraya et Bang Rak vus de l’Iconsiam
          </a>
          {ui.photoLicense}
        </span>
      </div>
    </footer>
  )
}
