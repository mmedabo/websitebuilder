import BookingSteps from '../components/BookingSteps'
import Faq from '../components/Faq'
import { boiBookingSteps, bookingSteps, company, faqs, services, ui, type ServiceId } from '../content'
import { track } from '../analytics'
import { pageHref, serviceHref } from '../routing'
import BoiProcess from '../sections/BoiProcess'
import Contact from '../sections/Contact'
import Documents from '../sections/Documents'
import Expertise from '../sections/Expertise'
import Marks from '../sections/Marks'
import { Blueprint } from '../sections/Services'

type Props = { id: ServiceId; still: boolean; service: string; setService: (id: string) => void }

export default function ServicePage({ id, still, service, setService }: Props) {
  const s = services.find((x) => x.id === id)!
  const boi = id === 'boi'
  // Section numbers follow render order, because some sections appear only on some pages.
  let k = 0
  const n = () => String(++k).padStart(2, '0')

  return (
    <>
      <section className="svc-hero">
        <Blueprint />
        <div className="container svc-hero-inner">
          <nav className="crumbs" aria-label={ui.crumbsAria}>
            <a href={pageHref('')}>{ui.crumbHome}</a>
            <span aria-hidden>/</span>
            <a href={pageHref('#services')}>{ui.crumbServices}</a>
            <span aria-hidden>/</span>
            <span aria-current="page">{s.title}</span>
          </nav>
          <h1 className="page-title">{s.title}</h1>
          <p className="svc-lead">{s.lead}</p>
          <div className="svc-actions">
            <a className="btn btn-yellow" href="#contact">
              {ui.requestThis}
            </a>
            <a
              className="btn btn-line-light"
              href={company.phones[0].href}
              onClick={() => track('phone_click', { place: 'service_hero', service: id })}
            >
              {ui.call} {company.phones[0].label.split(/ (?:–|ถึง) /)[0]}, {ui.ext} {s.ext}
            </a>
          </div>
          <ul className="keyfacts">
            {s.keyFacts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section scope">
        <div className="container">
          <div className="section-head">
            <p className="label">
              <span className="label-n">{n()}</span>
              {ui.scopeLabel}
            </p>
            <h2 className="h2">{ui.scopeTitle}</h2>
          </div>
          <div className="scope-grid">
            <ul className="check-list">
              {s.provide.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <div className="benefits">
              <h3 className="h4">{ui.whyWork}</h3>
              {s.benefits.map((b) => (
                <div key={b.title}>
                  <strong>{b.title}</strong>
                  <p>{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {id === 'follow-up' && <Marks n={n()} />}
      {id === 'commercial' && <Expertise n={n()} />}
      {boi && <BoiProcess still={still} n={n()} />}

      <BookingSteps
        n={n()}
        steps={boi ? boiBookingSteps : bookingSteps}
        title={boi ? ui.bookingBoiTitle : ui.bookingTitle}
      >
        {boi ? ui.bookingBoiLead : ui.bookingServiceLead}
      </BookingSteps>

      <Faq n={n()} items={faqs[id]} service={id} />

      {boi && <Documents n={n()} />}

      <Contact n={n()} service={service} setService={setService} still={still} />

      <section className="other-services" aria-label={ui.otherServices}>
        <div className="container">
          <h2 className="h4">{ui.otherServices}</h2>
          <ul>
            {services
              .filter((x) => x.id !== id)
              .map((x) => (
                <li key={x.id}>
                  <a href={serviceHref(x.id)}>
                    <span className="os-index">{x.index}</span>
                    <span className="os-title">{x.title}</span>
                    <span className="os-short">{x.short}</span>
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </section>
    </>
  )
}
