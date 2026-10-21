import BookingSteps from '../components/BookingSteps'
import SectionTabs from '../components/SectionTabs'
import ServiceCompare from '../components/ServiceCompare'
import { bookingSteps, locale, ui } from '../content'
import { pageHref } from '../routing'
import BoiProcess from '../sections/BoiProcess'
import Clients from '../sections/Clients'
import Contact from '../sections/Contact'
import Coverage from '../sections/Coverage'
import Documents from '../sections/Documents'
import Expertise from '../sections/Expertise'
import Hero from '../sections/Hero'
import Marks from '../sections/Marks'
import Services from '../sections/Services'
import Story from '../sections/Story'
import WhyUs from '../sections/WhyUs'
import type { Variant } from '../variant'

type Props = { still: boolean; variant: Variant; service: string; setService: (id: string) => void }

export default function HomePage({ still, variant, service, setService }: Props) {
  return (
    <>
      <Hero still={still} variant={variant} />
      <Clients />
      <SectionTabs
        panels={[
          { id: 'about', label: ui.nav.about, node: <Story /> },
          {
            id: 'services',
            label: ui.nav.services,
            node: (
              <>
                <Services />
                <ServiceCompare n="02" />
                <BookingSteps n="02" steps={bookingSteps} title={ui.bookingTitle}>
                  {ui.bookingHomeLead}{' '}
                  <a className="link" href={pageHref('inspection-day/')}>
                    {locale.day.link} →
                  </a>
                </BookingSteps>
              </>
            ),
          },
          { id: 'marks', label: ui.nav.marks, node: <Marks n="03" /> },
          { id: 'coverage', label: ui.coverageLabel, node: <Coverage n="04" /> },
          { id: 'boi', label: ui.nav.boi, node: <BoiProcess still={still} n="05" /> },
          { id: 'expertise', label: ui.nav.products, node: <Expertise n="06" /> },
          { id: 'why', label: ui.whyLabel, node: <WhyUs n="07" /> },
          { id: 'documents', label: ui.docsLabel, node: <Documents n="08" /> },
          { id: 'contact', label: ui.nav.contact, node: <Contact n="09" service={service} setService={setService} /> },
        ]}
      />
    </>
  )
}
