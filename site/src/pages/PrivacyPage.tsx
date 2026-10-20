import { company } from '../content'

// Draft only. II and its legal adviser must review this before launch.
export default function PrivacyPage() {
  return (
    <article className="section legal">
      <div className="container legal-inner">
        <p className="draft-note">
          <strong>Draft for review.</strong> II and its legal adviser must check and complete this notice before the
          site goes live. It is a starting point, not legal advice.
        </p>
        <h1 className="page-title">Privacy notice</h1>
        <p className="lead">
          This notice explains how {company.name} uses the personal data you send through this website, under Thailand’s
          Personal Data Protection Act B.E. 2562 (2019).
        </p>

        <h2 className="h3">Who we are</h2>
        <p>
          {company.name}, {company.address.join(', ')}. Email: <a href={`mailto:${company.email}`}>{company.email}</a>.
        </p>

        <h2 className="h3">What we collect</h2>
        <p>
          When you send a request, we receive the details you enter: your name, company, email address, and the details
          of the service you need, such as the product, factory location, preferred date and your message.
        </p>
        <p>This website does not use analytics or advertising cookies at present.</p>

        <h2 className="h3">Why we use it</h2>
        <p>
          We use your details only to answer your request, to prepare a quotation, and to schedule and carry out the
          service you ask for.
        </p>

        <h2 className="h3">Who can see it</h2>
        <p>
          Only II staff who handle your request. We do not sell your data. We disclose it to others only with your
          permission or when the law requires it.
        </p>

        <h2 className="h3">How long we keep it</h2>
        <p className="todo">[II to set the retention period, for example: as long as needed to answer your request and to keep business records required by law.]</p>

        <h2 className="h3">Your rights</h2>
        <p>
          You can ask to see, correct or delete your data, withdraw your consent, or object to how we use it. To do so,
          email <a href={`mailto:${company.email}`}>{company.email}</a>. You can also complain to the Office of the
          Personal Data Protection Committee (PDPC).
        </p>

        <p className="todo">[Last updated: date to be added on publication.]</p>
      </div>
    </article>
  )
}
