import { documents, ui } from '../content'
import SectionHead from '../components/SectionHead'

export default function Documents({ n = '08' }: { n?: string }) {
  const groups = [...new Set(documents.map((d) => d.group))]
  return (
    <section id="documents" className="section documents">
      <div className="container">
        <SectionHead n={n} label={ui.docsLabel} title={ui.docsTitle}>
          {ui.docsLead}
        </SectionHead>
        <div className="doc-groups">
          {groups.map((g) => (
            <div key={g} className="doc-group">
              <h3 className="h4">{g}</h3>
              <ul>
                {documents
                  .filter((d) => d.group === g)
                  .map((d) => (
                    <li key={d.href}>
                      <a href={d.href} target="_blank" rel="noreferrer">
                        <span>{d.title}</span>
                        <span className="doc-tag">{ui.docTag}</span>
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
