import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { BANGKOK, MARKETS, type MarketId } from '../content'
import landDots from '../data/land-dots.json'

// Dotted globe for the export-market explorer. Land is a field of ink dots
// (Natural Earth, generated once into src/data/land-dots.json). Choosing a
// market turns the globe to it and draws an arc from Bangkok.

const R = 1
const TILT_MAX = 0.55
const rad = (d: number) => (d * Math.PI) / 180

function toVec(lat: number, lon: number, r = R) {
  const la = rad(lat)
  const lo = rad(lon)
  return new THREE.Vector3(r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo))
}

// Rotation that brings (lat, lon) to the front of the globe.
const facing = (lat: number, lon: number) => ({ x: THREE.MathUtils.clamp(rad(lat), -TILT_MAX, TILT_MAX), y: -rad(lon) })

// Shortest way round from a to b.
const wrap = (a: number, b: number) => a + ((((b - a + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI

function Dots() {
  const geo = useMemo(() => {
    const d = landDots as number[]
    const pos = new Float32Array((d.length / 2) * 3)
    for (let i = 0; i < d.length; i += 2) toVec(d[i], d[i + 1], R * 1.001).toArray(pos, (i / 2) * 3)
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [])
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uSize: { value: 5.5 * Math.min(window.devicePixelRatio, 2) } },
        vertexShader: /* glsl */ `
          uniform float uSize;
          varying float vFacing;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vec3 n = normalize(normalMatrix * position);
            vFacing = dot(n, normalize(-mv.xyz));
            gl_PointSize = uSize * (0.55 + 0.45 * max(vFacing, 0.0));
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */ `
          varying float vFacing;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            if (dot(c, c) > 0.25) discard;
            float a = smoothstep(-0.05, 0.45, vFacing);
            gl_FragColor = vec4(0.07, 0.075, 0.1, 0.78 * a);
          }`,
      }),
    [],
  )
  return (
    <points geometry={geo}>
      <primitive object={mat} attach="material" />
    </points>
  )
}

function Arc({ to, still }: { to: MarketId; still: boolean }) {
  const m = MARKETS.find((x) => x.id === to)!
  const t = useRef(still ? 1 : 0)
  const geo = useMemo(() => {
    const a = toVec(BANGKOK.lat, BANGKOK.lon)
    const b = toVec(m.lat, m.lon)
    const pts: THREE.Vector3[] = []
    const lift = Math.min(0.32, 0.12 + a.angleTo(b) * 0.12)
    for (let i = 0; i <= 64; i++) {
      const s = i / 64
      const p = a.clone().lerp(b, s).normalize()
      pts.push(p.multiplyScalar(R + Math.sin(Math.PI * s) * lift))
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 96, 0.009, 6, false)
  }, [m])
  useEffect(() => {
    t.current = still ? 1 : 0
  }, [to, still])
  useFrame((_, dt) => {
    t.current = Math.min(1, t.current + dt * 1.4)
    const count = geo.index!.count
    geo.setDrawRange(0, Math.floor((count * t.current) / 6) * 6)
  })
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial color="#2340f5" transparent opacity={0.9} />
    </mesh>
  )
}

function Pin({ lat, lon, color, size, onClick, pulse }: { lat: number; lon: number; color: string; size: number; onClick?: (e: ThreeEvent<MouseEvent>) => void; pulse?: boolean }) {
  const ring = useRef<THREE.Mesh>(null)
  const p = useMemo(() => toVec(lat, lon, R * 1.01), [lat, lon])
  const q = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), p.clone().normalize()), [p])
  useFrame(({ clock }) => {
    if (!ring.current) return
    const k = pulse ? 1 + ((clock.elapsedTime * 0.9) % 1) * 1.6 : 1
    ring.current.scale.setScalar(k)
    ;(ring.current.material as THREE.MeshBasicMaterial).opacity = pulse ? 0.9 * (1 - ((clock.elapsedTime * 0.9) % 1)) : 0.55
  })
  return (
    <group position={p} quaternion={q}>
      <mesh
        onClick={onClick}
        onPointerOver={() => onClick && (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = '')}
      >
        <circleGeometry args={[size, 24]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={ring} position={[0, 0, 0.001]}>
        <ringGeometry args={[size * 1.35, size * 1.6, 32]} />
        <meshBasicMaterial color={color} transparent />
      </mesh>
    </group>
  )
}

function Globe({ selected, onSelect, still }: { selected: MarketId | null; onSelect: (id: MarketId) => void; still: boolean }) {
  const group = useRef<THREE.Group>(null)
  // Start looking at Asia, a little west of Bangkok.
  const start = facing(BANGKOK.lat + 8, BANGKOK.lon - 25)
  const target = useRef({ ...start })
  const drag = useRef<{ x: number; y: number } | null>(null)
  const idle = useRef(0)

  useEffect(() => {
    const m = MARKETS.find((x) => x.id === selected)
    // Near markets: face a point between Bangkok and the market (nearer the
    // market), so the whole arc shows. Far markets: face the market; the arc
    // comes in over the horizon from Bangkok.
    if (m) {
      const a = toVec(BANGKOK.lat, BANGKOK.lon)
      const b = toVec(m.lat, m.lon)
      const mid = b.clone().multiplyScalar(0.65).add(a.clone().multiplyScalar(0.35)).normalize()
      target.current =
        a.angleTo(b) > 1.4 ? facing(m.lat, m.lon) : facing(THREE.MathUtils.radToDeg(Math.asin(mid.y)), THREE.MathUtils.radToDeg(Math.atan2(mid.x, mid.z)))
    }
    idle.current = 0
  }, [selected])

  useEffect(() => {
    const el = document.querySelector('.market-globe canvas') as HTMLCanvasElement | null
    if (!el) return
    const down = (e: PointerEvent) => {
      drag.current = { x: e.clientX, y: e.clientY }
      el.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!drag.current) return
      target.current.y += (e.clientX - drag.current.x) * 0.008
      target.current.x = THREE.MathUtils.clamp(target.current.x + (e.clientY - drag.current.y) * 0.006, -TILT_MAX, TILT_MAX)
      drag.current = { x: e.clientX, y: e.clientY }
      idle.current = 0
    }
    const up = () => (drag.current = null)
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
  }, [])

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    idle.current += dt
    // Drift slowly when nobody has touched it for a while and nothing is chosen.
    if (!still && !selected && !drag.current && idle.current > 2) target.current.y += dt * 0.12
    const ty = wrap(g.rotation.y, target.current.y)
    target.current.y = ty
    const k = still ? 1 : 1 - Math.pow(0.002, dt)
    g.rotation.y += (ty - g.rotation.y) * k
    g.rotation.x += (target.current.x - g.rotation.x) * k
  })

  return (
    <group ref={group} rotation={[start.x, start.y, 0]}>
      <mesh>
        <sphereGeometry args={[R, 64, 48]} />
        <meshBasicMaterial color="#ebe7dc" />
      </mesh>
      <Dots />
      <Pin lat={BANGKOK.lat} lon={BANGKOK.lon} color="#ff5a1f" size={0.03} pulse />
      {MARKETS.map((m) => (
        <Pin
          key={m.id}
          lat={m.lat}
          lon={m.lon}
          color={m.id === selected ? '#ffd60a' : '#2340f5'}
          size={m.id === selected ? 0.042 : 0.03}
          pulse={m.id === selected}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(m.id)
          }}
        />
      ))}
      {selected && <Arc key={selected} to={selected} still={still} />}
    </group>
  )
}

export default function MarketGlobe({ selected, onSelect, active, still }: { selected: MarketId | null; onSelect: (id: MarketId) => void; active: boolean; still: boolean }) {
  const [ready, setReady] = useState(false)
  return (
    <Canvas
      className={ready ? 'is-ready' : ''}
      camera={{ position: [0, 0, 3.9], fov: 36 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      frameloop={active && !still ? 'always' : 'demand'}
      onCreated={() => setReady(true)}
    >
      <Globe selected={selected} onSelect={onSelect} still={still} />
    </Canvas>
  )
}
