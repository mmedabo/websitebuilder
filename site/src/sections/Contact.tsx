import { useRef, useState, type FormEvent } from 'react'
import { track } from '../analytics'
import {
  BOI_NOTICE_WORKING_DAYS,
  aseanCountries,
  chat,
  company,
  earliestBoiDate,
  formFields,
  isoDate,
  services,
  type Field,
} from '../content'
import Glass from '../effects/Glass'
import LiquidLogo from '../effects/LiquidLogo'
import { pageHref } from '../routing'
import { focusOrb, releaseOrb } from '../state'

// No backend on a static host: the form composes an email to info@ii-th.com.
// After sending, the full text is shown with a copy button, so people whose
// email app does not open (webmail users) can still send the request.
type Props = { n?: string; service: string; setService: (id: string) => void; still: boolean }

function FieldInput({ f, service }: { f: Field; service: string }) {
  if (f.type === 'select') {
    return (
      <select name={f.name} required={f.required} defaultValue="">
        <option value="" disabled>
          Choose…
        </option>
        {f.options!.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    )
  }
  if (f.type === 'date') {
    const min = service === 'boi' ? isoDate(earliestBoiDate()) : isoDate(new Date())
    return <input name={f.name} type="date" min={min} required={f.required} />
  }
  return <input name={f.name} type={f.type} placeholder={f.placeholder} required={f.required} />
}

export default function Contact({ n = '09', service, setService, still }: Props) {
  const [sent, setSent] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const textRef = useRef<HTMLTextAreaElement>(null)
  const fields = formFields[service] ?? formFields['']
  const svc = services.find((s) => s.id === service)

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const title = svc?.title ?? 'General enquiry'
    const header = [
      `Name: ${f.get('name')}`,
      `Company: ${f.get('company')}`,
      `Email: ${f.get('email')}`,
      f.get('phone') ? `Phone: ${f.get('phone')}` : '',
      `Service: ${title}`,
      `Factory country: ${f.get('country')}`,
      ...fields.map((fd) => (f.get(fd.name) ? `${fd.label}: ${f.get(fd.name)}` : '')),
    ].filter(Boolean)
    const message = String(f.get('message') ?? '').trim()
    const subject = `Inspection request: ${title}`
    const body = message ? `${header.join('\n')}\n\n${message}` : header.join('\n')
    track('request_submit', { service: service || 'general' })
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setCopied(false)
    setSent(`To: ${company.email}\nSubject: ${subject}\n\n${body}`)
  }

  const copy = async () => {
    if (!sent) return
    try {
      await navigator.clipboard.writeText(sent)
    } catch {
      textRef.current?.select()
      document.execCommand('copy')
    }
    setCopied(true)
    track('request_copy', { service: service || 'general' })
  }

  return (
    <section id="contact" className="section contact">
      <div className="container contact-layout">
        <div className="contact-info">
          <p className="label">
            <span className="label-n">{n}</span>Contact
          </p>
          <LiquidLogo size={120} still={still} />
          <h2 className="h2">Contact us.</h2>
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
            <a href={`mailto:${company.email}`} onClick={() => track('email_click', { place: 'contact' })}>
              {company.email}
            </a>
            {company.phones.map((p) => (
              <a key={p.href} href={p.href} onClick={() => track('phone_click', { place: 'contact' })}>
                {p.label}
              </a>
            ))}
            <span>Fax {company.fax}</span>
          </div>

          <div className="chat-buttons">
            {chat.line ? (
              <a className="chat line" href={`https://line.me/R/ti/p/${encodeURIComponent(chat.line)}`} target="_blank" rel="noreferrer" onClick={() => track('line_click')}>
                LINE
              </a>
            ) : (
              <span className="chat line is-pending" title="Add II's LINE Official Account ID in content.ts">
                LINE <small>ID needed</small>
              </span>
            )}
            {chat.whatsapp ? (
              <a className="chat whatsapp" href={`https://wa.me/${chat.whatsapp}`} target="_blank" rel="noreferrer" onClick={() => track('whatsapp_click')}>
                WhatsApp
              </a>
            ) : (
              <span className="chat whatsapp is-pending" title="Add II's WhatsApp number in content.ts">
                WhatsApp <small>number needed</small>
              </span>
            )}
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

        <Glass as="form" className="contact-form" radius={10} strength={24} onSubmit={submit}>
          <h3 className="h3">Request an inspection</h3>
          <p className="form-note">We reply by email. Fields marked * are required.</p>

          <label>
            <span>Service *</span>
            <select
              name="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              onFocus={() => focusOrb(0.1)}
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

          <div className="field-row">
            <label>
              <span>Name *</span>
              <input name="name" required autoComplete="name" />
            </label>
            <label>
              <span>Company *</span>
              <input name="company" required autoComplete="organization" />
            </label>
          </div>
          <div className="field-row">
            <label>
              <span>Email *</span>
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label>
              <span>Phone</span>
              <input name="phone" type="tel" autoComplete="tel" />
            </label>
          </div>
          <label>
            <span>Factory country</span>
            <select name="country" defaultValue="Thailand">
              {aseanCountries.map((c) => (
                <option key={c}>{c}</option>
              ))}
              <option>Outside ASEAN</option>
            </select>
          </label>

          {/* Fields for the chosen service; the key resets them when the service changes. */}
          <div className="field-grid" key={service}>
            {fields.map((f) => (
              <label key={f.name} className={f.type === 'text' && fields.length % 2 === 1 ? 'is-wide' : ''}>
                <span>
                  {f.label}
                  {f.required ? ' *' : ''}
                </span>
                <FieldInput f={f} service={service} />
              </label>
            ))}
          </div>
          {service === 'boi' && (
            <p className="form-hint">
              BOI inspections need at least {BOI_NOTICE_WORKING_DAYS} working days notice, so the first date you can pick
              is {earliestBoiDate().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}.
              Thai public holidays are not counted here; we confirm the date with you.
            </p>
          )}

          <label>
            <span>Message</span>
            <textarea name="message" rows={4} placeholder="Quantities, standards, marks, or anything else we should know" />
          </label>

          <label className="consent">
            <input type="checkbox" name="consent" required />
            <span>
              I agree that II may use these details to reply to my request. See the{' '}
              <a href={pageHref('privacy/')} target="_blank" rel="noreferrer">
                privacy notice
              </a>
              . *
            </span>
          </label>

          <button className="btn btn-block" type="submit">
            Send request by email
          </button>

          {sent && (
            <div className="sent" role="status">
              <p>
                <strong>Your email app should now open with this message.</strong> If it did not, copy the text and send
                it to <a href={`mailto:${company.email}`}>{company.email}</a>. You can attach drawings or specifications to
                the email.
              </p>
              <textarea ref={textRef} readOnly value={sent} rows={8} aria-label="Your request" />
              <button type="button" className="btn btn-line btn-small" onClick={copy}>
                {copied ? 'Copied' : 'Copy request'}
              </button>
            </div>
          )}
        </Glass>
      </div>
    </section>
  )
}
