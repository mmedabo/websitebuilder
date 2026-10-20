import { services } from '../content'
import { pageHref, serviceHref } from '../routing'

export default function NotFoundPage() {
  return (
    <section className="section legal">
      <div className="container legal-inner">
        <h1 className="page-title">Page not found.</h1>
        <p className="lead">The page you are looking for has moved or does not exist. These pages may help:</p>
        <ul className="nf-links">
          <li>
            <a href={pageHref('')}>Home</a>
          </li>
          {services.map((s) => (
            <li key={s.id}>
              <a href={serviceHref(s.id)}>{s.title}</a>
            </li>
          ))}
          <li>
            <a href={pageHref('#contact')}>Contact us</a>
          </li>
        </ul>
      </div>
    </section>
  )
}
