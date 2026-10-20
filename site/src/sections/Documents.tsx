import { documents } from '../content'
import SectionHead from '../components/SectionHead'

export default function Documents() {
  const groups = [...new Set(documents.map((d) => d.group))]
  return (
    <section id="documents" className="section documents">
      <div className="container">
        <SectionHead
          kicker="Transparency"
          title={
            <>
              Impartial by <em>design</em>.
            </>
          }
        >
          II works as a Type A (third-party) inspection body under ISO/IEC 17020. Our policies, inspection scope and the
          BOI regulations we inspect to are public. The documents are in Thai.
        </SectionHead>
        <div className="doc-groups">
          {groups.map((g) => (
            <div key={g} className="doc-group">
              <h3 className="mono-label">{g}</h3>
              <ul>
                {documents
                  .filter((d) => d.group === g)
                  .map((d) => (
                    <li key={d.href}>
                      <a href={d.href} target="_blank" rel="noreferrer">
                        <span>{d.title}</span>
                        <span className="doc-tag">PDF · TH ↗</span>
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
