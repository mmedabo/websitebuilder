import { useEffect, useState } from 'react'
import { useReducedMotion } from './hooks'
import DayPage from './pages/DayPage'
import GuidePage from './pages/GuidePage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PortalPage from './pages/PortalPage'
import PresentPage from './pages/PresentPage'
import PrivacyPage from './pages/PrivacyPage'
import ServicePage from './pages/ServicePage'
import { ui, type ServiceId } from './content'
import { lang } from './i18n'
import { currentPage } from './routing'
import Footer from './sections/Footer'
import Nav from './sections/Nav'
import QuickSearch from './components/QuickSearch'
import ServiceFinder from './components/ServiceFinder'
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

  // Presentation mode is a full-screen deck: no site nav or footer.
  if (page.kind === 'present') return <PresentPage still={still} />

  return (
    <>
      <a className="skip" href="#main">
        {ui.skip}
      </a>
      <Nav variant={variant} onVariant={setVariant} />
      <main id="main">
        {page.kind === 'home' && <HomePage still={still} variant={variant} service={service} setService={setService} />}
        {page.kind === 'service' && <ServicePage id={page.service as ServiceId} still={still} service={service} setService={setService} />}
        {page.kind === 'guide' && <GuidePage />}
        {page.kind === 'day' && <DayPage />}
        {page.kind === 'portal' && <PortalPage />}
        {page.kind === 'privacy' && <PrivacyPage />}
        {page.kind === 'notfound' && <NotFoundPage />}
      </main>
      <Footer />
      <ServiceFinder />
      <QuickSearch />
    </>
  )
}
