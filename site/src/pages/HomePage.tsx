import BookingSteps from '../components/BookingSteps'
import { bookingSteps, ui } from '../content'
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
      <Story />
      <Services />
      <BookingSteps n="03" steps={bookingSteps} title={ui.bookingTitle}>
        {ui.bookingHomeLead}
      </BookingSteps>
      <Marks n="04" />
      <Coverage n="05" />
      <BoiProcess still={still} n="06" />
      <Expertise n="07" />
      <WhyUs n="08" />
      <Clients />
      <Documents n="09" />
      <Contact n="10" service={service} setService={setService} still={still} />
    </>
  )
}
