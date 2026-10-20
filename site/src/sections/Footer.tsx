import { company, services } from '../content'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-word">International Inspection</p>
          <p className="footer-tag">Quality is our priority.</p>
          <address>
            {company.address.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </address>
        </div>
        <nav aria-label="Services">
          <h3 className="h4">Services</h3>
          <ul>
            {services.map((s) => (
              <li key={s.id}>
                <a href={`#svc-${s.id}`}>{s.title}</a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Company">
          <h3 className="h4">Company</h3>
          <ul>
            <li><a href="#about">About II</a></li>
            <li><a href="#expertise">Products we inspect</a></li>
            <li><a href="#why">Why II</a></li>
            <li><a href="#documents">ISO/IEC 17020 documents</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
      <div className="container footer-base">
        <span>© {new Date().getFullYear()} {company.name} All rights reserved.</span>
        <span>Design concept. This is not the official website.</span>
        <span className="photo-credit">
          Hero photo:{' '}
          <a href="https://commons.wikimedia.org/wiki/File:Chao_Phraya_et_Bang_Rak_vus_de_l%27Iconsiam.jpg" target="_blank" rel="noreferrer">
            Chao Phraya et Bang Rak vus de l’Iconsiam
          </a>
          , Wikimedia Commons, CC0.
        </span>
      </div>
    </footer>
  )
}
