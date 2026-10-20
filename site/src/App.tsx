import { useEffect, useState } from 'react'
import { useReducedMotion } from './hooks'
import GuidePage from './pages/GuidePage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PortalPage from './pages/PortalPage'
import PrivacyPage from './pages/PrivacyPage'
import ServicePage from './pages/ServicePage'
import { ui, type ServiceId } from './content'
import { lang } from './i18n'
import { currentPage } from './routing'
import Footer from './sections/Footer'
import Nav from './sections/Nav'
import { useVariant } from './variant'

export default function App() {
  const page = currentPage()
  const still = useReducedMotion()
  const [service, setService] = useState(page.service ?? '')
  const [variant, setVariant] = useVariant(page.kind === 'home')

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dataset.page = page.kind
    document.title = page.title
  }, [page.kind, page.title])

  return (
    <>
      <a className="skip" href="#main">
        {ui.skip}
      </a>
      <Nav still={still} variant={variant} onVariant={setVariant} />
      <main id="main">
        {page.kind === 'home' && <HomePage still={still} variant={variant} service={service} setService={setService} />}
        {page.kind === 'service' && <ServicePage id={page.service as ServiceId} still={still} service={service} setService={setService} />}
        {page.kind === 'guide' && <GuidePage />}
        {page.kind === 'portal' && <PortalPage />}
        {page.kind === 'privacy' && <PrivacyPage />}
        {page.kind === 'notfound' && <NotFoundPage />}
      </main>
      <Footer />
    </>
  )
}
