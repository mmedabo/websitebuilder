import { useEffect, useRef, useState } from 'react'

export default function CountUp({ to, still, ms = 1600 }: { to: number; still: boolean; ms?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [v, setV] = useState(still ? to : 0)

  useEffect(() => {
    if (still) return setV(to)
    const el = ref.current
    if (!el) return
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / ms)
        setV(Math.round(to * (1 - Math.pow(1 - t, 3))))
        if (t < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [to, still, ms])

  return <span ref={ref}>{v.toLocaleString('en-US')}</span>
}
