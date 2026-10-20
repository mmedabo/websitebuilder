import { useEffect, useId, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'

// Liquid glass, after liquidglass.js: a per-element displacement map bends
// the backdrop near the rounded edges like a thick lens. Only Chromium
// applies SVG filters inside backdrop-filter, so other engines keep the
// plain frosted fallback from CSS.
const supportsRefraction =
  typeof navigator !== 'undefined' &&
  /Chrome\//.test(navigator.userAgent) &&
  !/Mobile/.test(navigator.userAgent)

const cache = new Map<string, string>()

function displacementMap(w: number, h: number, radius: number, bezel: number) {
  const key = `${w}x${h}r${radius}b${bezel}`
  const hit = cache.get(key)
  if (hit) return hit
  const k = 0.5 // generate at half resolution; feImage scales it up
  const W = Math.max(2, Math.round(w * k))
  const H = Math.max(2, Math.round(h * k))
  const r = Math.min(radius, w / 2, h / 2) * k
  const b = bezel * k
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')!
  const img = ctx.createImageData(W, H)
  const hx = W / 2
  const hy = H / 2
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const px = x + 0.5 - hx
      const py = y + 0.5 - hy
      const qx = Math.abs(px) - (hx - r)
      const qy = Math.abs(py) - (hy - r)
      const ox = Math.max(qx, 0)
      const oy = Math.max(qy, 0)
      const inside = r - (Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0))
      let dx = 0
      let dy = 0
      if (inside < b) {
        const t = 1 - Math.max(0, inside) / b
        const mag = t * t * (3 - 2 * t)
        if (qx > 0 && qy > 0) {
          const l = Math.hypot(qx, qy) || 1
          dx = (qx / l) * Math.sign(px)
          dy = (qy / l) * Math.sign(py)
        } else if (qx > qy) dx = Math.sign(px)
        else dy = Math.sign(py)
        dx *= mag
        dy *= mag
      }
      const i = (y * W + x) * 4
      img.data[i] = 128 + dx * 127
      img.data[i + 1] = 128 + dy * 127
      img.data[i + 2] = 128
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  const url = c.toDataURL()
  cache.set(key, url)
  return url
}

type Props = {
  as?: ElementType
  className?: string
  radius?: number
  strength?: number
  style?: CSSProperties
  children?: ReactNode
  [key: string]: unknown
}

export default function Glass({ as: Tag = 'div', className = '', radius = 24, strength = 36, style, children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null)
  const id = 'lg' + useId().replace(/[^a-zA-Z0-9]/g, '')
  const [box, setBox] = useState<{ w: number; h: number } | null>(null)

  useEffect(() => {
    if (!supportsRefraction || !ref.current) return
    const el = ref.current
    const ro = new ResizeObserver(([e]) => {
      const w = Math.round(e.borderBoxSize?.[0]?.inlineSize ?? el.offsetWidth)
      const h = Math.round(e.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight)
      setBox((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const map = box && box.w > 0 && box.h > 0 ? displacementMap(box.w, box.h, radius, Math.min(30, radius * 1.2)) : null
  const merged: CSSProperties = { borderRadius: radius, ...style }
  if (map) {
    const f = `url(#${id}) blur(9px) saturate(170%) brightness(1.08)`
    merged.backdropFilter = f
    ;(merged as Record<string, string>).WebkitBackdropFilter = f
  }

  return (
    <Tag ref={ref} className={`glass ${className}`} style={merged} {...rest}>
      {map && box && (
        <svg className="glass-defs" width="0" height="0" aria-hidden>
          <filter id={id} x="0" y="0" width={box.w} height={box.h} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feImage href={map} x="0" y="0" width={box.w} height={box.h} preserveAspectRatio="none" result="map" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale={strength} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      )}
      {children}
    </Tag>
  )
}
