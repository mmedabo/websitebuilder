import { company, services } from '../content'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-word">
            International <em>Inspection</em>
          </p>
          <p className="muted">Quality is our priority. Bangkok, since 1989.</p>
        </div>
        <nav aria-label="Services">
          <h3 className="mono-label">Services</h3>
          <ul>
            {services.map((s) => (
              <li key={s.id}>
                <a href={`#svc-${s.id}`}>{s.title}</a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Company">
          <h3 className="mono-label">Company</h3>
          <ul>
            <li><a href="#story">Our story</a></li>
            <li><a href="#expertise">What we inspect</a></li>
            <li><a href="#why">Why II</a></li>
            <li><a href="#documents">ISO/IEC 17020 documents</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
      <div className="container footer-base">
        <span>© {new Date().getFullYear()} {company.name} All rights reserved.</span>
        <span className="concept-note">Concept redesign — not the official website.</span>
      </div>
    </footer>
  )
}
