import { useState, type FormEvent } from 'react'
import { aseanCountries, company, services } from '../content'
import Glass from '../effects/Glass'
import LiquidLogo from '../effects/LiquidLogo'
import { focusOrb, releaseOrb } from '../state'

// No backend: the form composes an email to info@ii-th.com in the
// visitor's own mail app, so nothing is sent or stored by this site.
export default function Contact({ service, setService, still }: { service: string; setService: (id: string) => void; still: boolean }) {
  const [sent, setSent] = useState(false)

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const svc = services.find((s) => s.id === f.get('service'))?.title ?? 'General enquiry'
    const subject = `Inspection request — ${svc}`
    const body = [
      `Name: ${f.get('name')}`,
      `Company: ${f.get('company')}`,
      `Email: ${f.get('email')}`,
      `Service: ${svc}`,
      `Factory country: ${f.get('country')}`,
      `Product: ${f.get('product')}`,
      '',
      String(f.get('message') ?? ''),
    ].join('\n')
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <section id="contact" className="section contact">
      <div className="container contact-layout">
        <div className="contact-info">
          <LiquidLogo size={132} still={still} />
          <p className="eyebrow">Contact</p>
          <h2 className="h2">
            Let’s inspect <em>together</em>.
          </h2>
          <address>
            <strong>{company.name}</strong>
            {company.address.map((l) => (
              <span key={l}>{l}</span>
            ))}
            <a href={company.mapsUrl} target="_blank" rel="noreferrer" className="link">
              Open in Maps ↗
            </a>
          </address>
          <div className="contact-lines">
            <a href={`mailto:${company.email}`}>{company.email}</a>
            {company.phones.map((p) => (
              <a key={p.href} href={p.href}>
                {p.label}
              </a>
            ))}
            <span>Fax {company.fax}</span>
          </div>
          <dl className="ext-table">
            {company.extensions.map((x) => (
              <div key={x.service}>
                <dt>{x.service}</dt>
                <dd>ext. {x.ext}</dd>
              </div>
            ))}
          </dl>
        </div>

        <Glass as="form" className="contact-form" radius={32} strength={28} onSubmit={submit}>
          <h3 className="h3">Request an inspection</h3>
          <p className="form-note">This opens your email app with a ready-to-send message to {company.email}.</p>
          <div className="field-row">
            <label>
              <span>Name</span>
              <input name="name" required autoComplete="name" />
            </label>
            <label>
              <span>Company</span>
              <input name="company" required autoComplete="organization" />
            </label>
          </div>
          <label>
            <span>Email</span>
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <div className="field-row">
            <label>
              <span>Service</span>
              <select
                name="service"
                value={service}
                onChange={(e) => setService(e.target.value)}
                onFocus={() => focusOrb(0.12)}
                onBlur={releaseOrb}
              >
                <option value="">General enquiry</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Factory country</span>
              <select name="country" defaultValue="Thailand">
                {aseanCountries.map((c) => (
                  <option key={c}>{c}</option>
                ))}
                <option>Outside ASEAN</option>
              </select>
            </label>
          </div>
          <label>
            <span>Product</span>
            <input name="product" placeholder="e.g. LED luminaires, wire harness, used CNC machine" />
          </label>
          <label>
            <span>Message</span>
            <textarea name="message" rows={4} placeholder="Dates, quantities, standards or marks…" />
          </label>
          <button className="btn btn-block" type="submit">
            Compose email
          </button>
          {sent && (
            <p className="form-note" role="status">
              If your email app did not open, write to <a href={`mailto:${company.email}`}>{company.email}</a>.
            </p>
          )}
        </Glass>
      </div>
    </section>
  )
}
