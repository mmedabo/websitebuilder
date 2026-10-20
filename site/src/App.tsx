import { useState } from 'react'
import { useReducedMotion } from './hooks'
import BoiProcess from './sections/BoiProcess'
import Clients from './sections/Clients'
import Contact from './sections/Contact'
import Coverage from './sections/Coverage'
import Documents from './sections/Documents'
import Expertise from './sections/Expertise'
import Footer from './sections/Footer'
import Hero from './sections/Hero'
import Marks from './sections/Marks'
import Nav from './sections/Nav'
import Services from './sections/Services'
import Story from './sections/Story'
import WhyUs from './sections/WhyUs'

export default function App() {
  const still = useReducedMotion()
  const [service, setService] = useState('')

  const request = (id: string) => {
    setService(id)
    document.getElementById('contact')?.scrollIntoView({ behavior: still ? 'auto' : 'smooth' })
  }

  return (
    <>
      <a className="skip" href="#services">
        Skip to services
      </a>
      <Nav still={still} />
      <main>
        <Hero still={still} />
        <Story />
        <Services onRequest={request} />
        <Marks />
        <Coverage />
        <BoiProcess still={still} />
        <Expertise />
        <WhyUs />
        <Clients />
        <Documents />
        <Contact service={service} setService={setService} still={still} />
      </main>
      <Footer />
    </>
  )
}
