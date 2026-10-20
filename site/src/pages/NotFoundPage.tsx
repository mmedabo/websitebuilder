import { services, ui } from '../content'
import { pageHref, serviceHref } from '../routing'

export default function NotFoundPage() {
  return (
    <section className="section legal">
      <div className="container legal-inner">
        <h1 className="page-title">{ui.nfTitle}</h1>
        <p className="lead">{ui.nfLead}</p>
        <ul className="nf-links">
          <li>
            <a href={pageHref('')}>{ui.nfHome}</a>
          </li>
          {services.map((s) => (
            <li key={s.id}>
              <a href={serviceHref(s.id)}>{s.title}</a>
            </li>
          ))}
          <li>
            <a href={pageHref('#contact')}>{ui.nfContact}</a>
          </li>
        </ul>
      </div>
    </section>
  )
}
