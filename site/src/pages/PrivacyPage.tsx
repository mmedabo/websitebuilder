import { company, locale } from '../content'

// Draft only. II and its legal adviser must review this before launch.
export default function PrivacyPage() {
  const t = locale.privacy
  const mail = <a href={`mailto:${company.email}`}>{company.email}</a>
  return (
    <article className="section legal">
      <div className="container legal-inner">
        <p className="draft-note">
          <strong>{t.draftStrong}</strong> {t.draftNote}
        </p>
        <h1 className="page-title">{t.title}</h1>
        <p className="lead">{t.lead(company.name)}</p>

        <h2 className="h3">{t.whoTitle}</h2>
        <p>
          {company.name}, {company.address.join(', ')}. {t.email}: {mail}.
        </p>

        <h2 className="h3">{t.collectTitle}</h2>
        <p>{t.collect}</p>
        <p>{t.noCookies}</p>

        <h2 className="h3">{t.whyTitle}</h2>
        <p>{t.why}</p>

        <h2 className="h3">{t.seeTitle}</h2>
        <p>{t.see}</p>

        <h2 className="h3">{t.keepTitle}</h2>
        <p className="todo">{t.keepTodo}</p>

        <h2 className="h3">{t.rightsTitle}</h2>
        <p>
          {t.rightsBefore}
          {mail}
          {t.rightsAfter}
        </p>

        <p className="todo">{t.updatedTodo}</p>
      </div>
    </article>
  )
}
