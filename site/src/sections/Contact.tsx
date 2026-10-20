import { useRef, useState, type FormEvent } from 'react'
import { track } from '../analytics'
import {
  BOI_NOTICE_WORKING_DAYS,
  chat,
  company,
  countries,
  earliestBoiDate,
  formFields,
  isoDate,
  serviceEmailTitle,
  services,
  ui,
  type Field,
} from '../content'
import { langInfo } from '../i18n'
import Glass from '../effects/Glass'
import { pageHref } from '../routing'
import { focusOrb, releaseOrb } from '../state'

// No backend on a static host: the form composes an email to info@ii-th.com.
// After sending, the full text is shown with a copy button, so people whose
// email app does not open (webmail users) can still send the request.
type Props = { n?: string; service: string; setService: (id: string) => void }

function FieldInput({ f, service }: { f: Field; service: string }) {
  if (f.type === 'select') {
    return (
      <select name={f.name} required={f.required} defaultValue="">
        <option value="" disabled>
          {ui.fChoose}
        </option>
        {f.choices!.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
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

export default function Contact({ n = '09', service, setService }: Props) {
  const [sent, setSent] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const textRef = useRef<HTMLTextAreaElement>(null)
  const fields = formFields(service)

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    // The email is always in English, whatever the page language.
    const title = serviceEmailTitle(service)
    const header = [
      `Name: ${f.get('name')}`,
      `Company: ${f.get('company')}`,
      `Email: ${f.get('email')}`,
      f.get('phone') ? `Phone: ${f.get('phone')}` : '',
      `Service: ${title}`,
      `Factory country: ${f.get('country')}`,
      ...fields.map((fd) => (f.get(fd.name) ? `${fd.emailLabel}: ${f.get(fd.name)}` : '')),
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
            <span className="label-n">{n}</span>
            {ui.contactLabel}
          </p>
          <img className="contact-logo" src={`${import.meta.env.BASE_URL}img/ii-logo.png`} alt="" width={120} height={112} />
          <h2 className="h2">{ui.contactTitle}</h2>
          <address>
            <strong>{company.name}</strong>
            {company.address.map((l) => (
              <span key={l}>{l}</span>
            ))}
            <a href={company.mapsUrl} target="_blank" rel="noreferrer" className="link">
              {ui.openMaps}
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
            <span>
              {ui.fax} {company.fax}
            </span>
          </div>

          <div className="chat-buttons">
            {chat.line ? (
              <a className="chat line" href={`https://line.me/R/ti/p/${encodeURIComponent(chat.line)}`} target="_blank" rel="noreferrer" onClick={() => track('line_click')}>
                LINE
              </a>
            ) : (
              <span className="chat line is-pending" title={ui.chatLineTitle}>
                LINE <small>{ui.chatIdNeeded}</small>
              </span>
            )}
            {chat.whatsapp ? (
              <a className="chat whatsapp" href={`https://wa.me/${chat.whatsapp}`} target="_blank" rel="noreferrer" onClick={() => track('whatsapp_click')}>
                WhatsApp
              </a>
            ) : (
              <span className="chat whatsapp is-pending" title={ui.chatWhatsappTitle}>
                WhatsApp <small>{ui.chatNumberNeeded}</small>
              </span>
            )}
          </div>

          <dl className="ext-table">
            {company.extensions.map((x) => (
              <div key={x.service}>
                <dt>{x.service}</dt>
                <dd>
                  {ui.ext} {x.ext}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <Glass as="form" className="contact-form" radius={10} strength={24} onSubmit={submit}>
          <h3 className="h3">{ui.formTitle}</h3>
          <p className="form-note">{ui.formNote}</p>

          <label>
            <span>{ui.fService} *</span>
            <select
              name="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              onFocus={() => focusOrb(0.1)}
              onBlur={releaseOrb}
            >
              <option value="">{ui.fGeneral}</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </label>

          <div className="field-row">
            <label>
              <span>{ui.fName} *</span>
              <input name="name" required autoComplete="name" />
            </label>
            <label>
              <span>{ui.fCompany} *</span>
              <input name="company" required autoComplete="organization" />
            </label>
          </div>
          <div className="field-row">
            <label>
              <span>{ui.fEmail} *</span>
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label>
              <span>{ui.fPhone}</span>
              <input name="phone" type="tel" autoComplete="tel" />
            </label>
          </div>
          <label>
            <span>{ui.fCountry}</span>
            <select name="country" defaultValue="Thailand">
              {countries.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
              <option value="Outside ASEAN">{ui.fOutsideAsean}</option>
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
              {ui.boiHint(
                BOI_NOTICE_WORKING_DAYS,
                earliestBoiDate().toLocaleDateString(langInfo.locale, { weekday: 'short', day: 'numeric', month: 'short' }),
              )}
            </p>
          )}

          <label>
            <span>{ui.fMessage}</span>
            <textarea name="message" rows={4} placeholder={ui.fMessagePh} />
          </label>

          <label className="consent">
            <input type="checkbox" name="consent" required />
            <span>
              {ui.consentBefore}
              <a href={pageHref('privacy/')} target="_blank" rel="noreferrer">
                {ui.consentLink}
              </a>
              {ui.consentAfter} *
            </span>
          </label>

          <button className="btn btn-block" type="submit">
            {ui.submit}
          </button>

          {sent && (
            <div className="sent" role="status">
              <p>
                <strong>{ui.sentStrong}</strong> {ui.sentBody} <a href={`mailto:${company.email}`}>{company.email}</a>.{' '}
                {ui.sentAttach}
              </p>
              <textarea ref={textRef} readOnly value={sent} rows={8} aria-label={ui.requestAria} />
              <button type="button" className="btn btn-line btn-small" onClick={copy}>
                {copied ? ui.copied : ui.copy}
              </button>
            </div>
          )}
        </Glass>
      </div>
    </section>
  )
}
