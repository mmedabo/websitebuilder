import type { PointerEvent as RPointerEvent } from 'react'
import { expertise, yearsInService } from '../content'
import SectionHead from '../components/SectionHead'
import { useReveal } from '../hooks'

function spot(e: RPointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export default function Expertise() {
  const ref = useReveal<HTMLUListElement>()
  return (
    <section id="expertise" className="section expertise">
      <div className="container">
        <SectionHead
          kicker="What we inspect"
          title={
            <>
              {yearsInService()} years of eyes on <em>almost everything</em> made.
            </>
          }
        >
          As a trusted third-party inspector since 1989, our team has deep expertise in product quality. Here are some
          of the product types we inspect. The list is not complete.
        </SectionHead>
        <ul className="exp-grid reveal-stagger" ref={ref}>
          {expertise.map((x, i) => (
            <li key={x.title} style={{ ['--i' as string]: i }} onPointerMove={spot}>
              <span className="exp-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{x.title}</h3>
              <p>{x.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
