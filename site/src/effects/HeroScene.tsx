import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { orb } from '../state'
import { brandRamp, simplex3 } from './glsl'

const { lerp, damp } = THREE.MathUtils

/* ------------------------------------------------------------------ */
/* Shader gradient field — a domain-warped noise flow behind the hero. */
/* ------------------------------------------------------------------ */

const fieldVert = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

const fieldFrag = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uHue;
uniform float uThink;
${simplex3}
${brandRamp}

void main(){
  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  float t = uTime * 0.05;

  // Two levels of domain warp give the soft, liquid ShaderGradient look.
  vec2 q = vec2(snoise(vec3(p * 0.9, t)), snoise(vec3(p * 0.9 + 5.2, t)));
  vec2 r = vec2(
    snoise(vec3(p * 1.4 + q * 1.6 + uMouse * 0.15, t * 1.3)),
    snoise(vec3(p * 1.4 + q * 1.6 + 8.3, t * 1.3))
  );
  float f = snoise(vec3(p * 1.1 + r * 1.2, t * 0.7));

  vec3 paper = vec3(0.969, 0.961, 0.941);

  // Colour lives on the right and lower edge; the left stays pale for the copy.
  float w = smoothstep(-0.65, 0.55, p.x) * 0.85 + smoothstep(0.1, 0.55, -p.y) * 0.25;
  w = clamp(w, 0.0, 1.0);

  // Each band picks a brand colour; the active service nudges the ramp.
  vec3 a = brandRamp(0.00 + uHue * 0.35 + q.x * 0.08);
  vec3 b = brandRamp(0.42 + uHue * 0.35 + r.y * 0.08);
  vec3 c = brandRamp(0.62 + uHue * 0.35);

  vec3 col = paper;
  col = mix(col, a, smoothstep(0.05, 0.85, f + q.y * 0.3) * w * 0.85);
  col = mix(col, b, smoothstep(0.25, 0.95, r.x + f * 0.3) * w * 0.8);
  col = mix(col, c, smoothstep(0.45, 1.0, q.x * 0.8 - f * 0.4) * w * 0.7);

  // Faint inspection grid, strongest where the colour is.
  vec2 g = abs(fract(p * 9.0) - 0.5);
  float grid = smoothstep(0.485, 0.5, max(g.x, g.y));
  col -= grid * 0.045 * (0.3 + w) * (1.0 + uThink);

  // Film grain.
  float n = fract(sin(dot(uv * uRes + uTime, vec2(12.9898, 78.233))) * 43758.5453);
  col += (n - 0.5) * 0.03;

  gl_FragColor = vec4(col, 1.0);
}
`

// Materials are built once and attached as primitives, so the uniforms
// updated every frame are guaranteed to be the material's own objects.
function useShader(params: THREE.ShaderMaterialParameters) {
  const mat = useMemo(() => new THREE.ShaderMaterial(params), [])
  useEffect(() => () => mat.dispose(), [mat])
  return mat
}

function Field() {
  const { size } = useThree()
  const mat = useShader({
    vertexShader: fieldVert,
    fragmentShader: fieldFrag,
    uniforms: {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2() },
      uHue: { value: orb.hue },
      uThink: { value: 0 },
    },
    depthWrite: false,
    depthTest: false,
  })
  useFrame((_, dt) => {
    const u = mat.uniforms
    u.uTime.value += dt * (1 + orb.think * 1.5)
    u.uRes.value.set(size.width, size.height)
    u.uMouse.value.x = lerp(u.uMouse.value.x, orb.pointer.x, 0.04)
    u.uMouse.value.y = lerp(u.uMouse.value.y, orb.pointer.y, 0.04)
    u.uHue.value = orb.hue
    u.uThink.value = orb.think
  })
  return (
    <mesh renderOrder={-1} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/* Thinking orb — iridescent, noise-displaced lens that scans.        */
/* ------------------------------------------------------------------ */

const orbVert = /* glsl */ `
uniform float uTime;
uniform float uAmp;
varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;
${simplex3}

float disp(vec3 p){
  return snoise(p * 1.2 + vec3(0.0, uTime * 0.3, uTime * 0.18)) * uAmp
       + snoise(p * 2.6 - uTime * 0.4) * uAmp * 0.15;
}

void main(){
  vec3 n = normalize(normal);
  float d = disp(position);
  vec3 pos = position + n * d;

  // Re-derive the normal from two displaced neighbours.
  vec3 t = normalize(abs(n.y) > 0.99 ? cross(n, vec3(1.0, 0.0, 0.0)) : cross(n, vec3(0.0, 1.0, 0.0)));
  vec3 b = normalize(cross(n, t));
  float e = 0.01;
  vec3 p1 = position + t * e; p1 += normalize(p1) * disp(p1);
  vec3 p2 = position + b * e; p2 += normalize(p2) * disp(p2);
  vec3 dn = normalize(cross(p1 - pos, p2 - pos));
  if (dot(dn, n) < 0.0) dn = -dn;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vNormal = normalize(normalMatrix * dn);
  vView = normalize(-mv.xyz);
  vDisp = d;
  gl_Position = projectionMatrix * mv;
}
`

const orbFrag = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uHue;
uniform float uThink;
varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;
${brandRamp}

void main(){
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vView);
  float ndv = clamp(dot(n, v), 0.0, 1.0);
  float fres = pow(1.0 - ndv, 2.0);

  // Candy-glass body: brand colours flow across the surface.
  // Narrow ramp span: a smooth two-colour gradient, not a patchwork.
  // +0.5 puts the resting hue (0.55) on signal blue.
  float t = uHue + 0.5 + n.y * 0.09 + n.x * 0.04 + vDisp * 0.5 + sin(uTime * 0.2) * 0.03;
  vec3 body = brandRamp(t);

  // Soft key light from the top-left; the underside stays rich, not grey.
  vec3 l = normalize(vec3(-0.6, 0.8, 0.7));
  float diff = 0.62 + 0.38 * dot(n, l);
  vec3 col = body * diff * 1.08;

  // Glass: a pale sky reflection at the top and a bright white rim.
  vec3 r = reflect(-v, n);
  col += vec3(1.0) * smoothstep(0.55, 1.0, r.y) * 0.22;
  col = mix(col, vec3(1.0), fres * 0.6);

  vec3 h = normalize(l + v);
  float spec = pow(max(dot(n, h), 0.0), 110.0);
  col += spec * 1.2;

  // Inner pulse while thinking.
  float pulse = 0.5 + 0.5 * sin(uTime * 3.0);
  col += brandRamp(t + 0.4) * (1.0 - fres) * uThink * pulse * 0.12;

  gl_FragColor = vec4(col, 1.0);
}
`

const glowFrag = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uHue;
uniform float uThink;
${brandRamp}
void main(){
  // A soft coloured halo; normal blending so it tints, not washes out, on paper.
  float d = length(vUv - 0.5) * 2.0;
  float a = smoothstep(1.0, 0.2, d);
  a = a * a * (0.32 + uThink * 0.2);
  gl_FragColor = vec4(brandRamp(uHue + 0.6), a);
}
`

const glowVert = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`

function Orb() {
  const group = useRef<THREE.Group>(null)
  const scan = useRef<THREE.Mesh>(null)
  const ringA = useRef<THREE.Mesh>(null)
  const ringB = useRef<THREE.Mesh>(null)
  const { viewport, size } = useThree()

  const orbMat = useShader({
    vertexShader: orbVert,
    fragmentShader: orbFrag,
    uniforms: {
      uTime: { value: 0 },
      uAmp: { value: 0.035 },
      uHue: { value: orb.hue },
      uThink: { value: 0 },
    },
  })
  const glowMat = useShader({
    vertexShader: glowVert,
    fragmentShader: glowFrag,
    uniforms: { uHue: { value: orb.hue }, uThink: { value: 0 } },
    transparent: true,
    depthWrite: false,
  })

  const placed = useRef(false)

  useFrame((state, dt) => {
    orb.think = damp(orb.think, orb.targetThink, 3, dt)
    orb.hue = damp(orb.hue, orb.targetHue, 2.5, dt)
    const k = orb.think

    const u = orbMat.uniforms
    u.uTime.value += dt * (1 + k * 2.2)
    u.uAmp.value = 0.035 + k * 0.08
    u.uHue.value = orb.hue
    u.uThink.value = k
    glowMat.uniforms.uHue.value = orb.hue
    glowMat.uniforms.uThink.value = k

    const g = group.current
    if (!g) return
    // Desktop: orb sits right of the copy. Portrait: above it. On phones
    // the hero is taller than the screen, so place the orb in screen pixels.
    const wide = viewport.aspect > 1.05
    const upp = viewport.height / size.height
    const s = wide ? viewport.height * 0.16 : Math.min(size.width * 0.27, window.innerHeight * 0.12) * upp
    const x = wide ? viewport.width * 0.29 : viewport.width * 0.12
    const y = wide ? 0.05 : viewport.height / 2 - window.innerHeight * 0.25 * upp
    // Damping is frame-rate independent, and the first frame snaps into
    // place, so slow GPUs never show the orb drifting over the headline.
    const lam = placed.current ? 4 : Infinity
    g.position.x = damp(g.position.x, x, lam, dt)
    g.position.y = damp(g.position.y, y, lam, dt)
    g.scale.setScalar(damp(g.scale.x, s, lam, dt))
    placed.current = true
    g.rotation.y = damp(g.rotation.y, orb.pointer.x * 0.5, 2.5, dt)
    g.rotation.x = damp(g.rotation.x, -orb.pointer.y * 0.35, 2.5, dt)

    const t = state.clock.elapsedTime
    if (scan.current) {
      // A horizontal ring sweeps the sphere like an inspection scan line.
      const y = Math.sin(t * (0.6 + k * 1.2)) * 0.92
      scan.current.position.y = y
      const r = Math.sqrt(Math.max(0.0001, 1 - y * y)) * 1.06
      scan.current.scale.set(r, r, 1)
    }
    if (ringA.current) ringA.current.rotation.z += dt * (0.15 + k * 0.8)
    if (ringB.current) ringB.current.rotation.z -= dt * (0.1 + k * 0.6)
  })

  return (
    <group ref={group}>
      <mesh position={[0, 0, -0.6]} scale={4.6}>
        <planeGeometry />
        <primitive object={glowMat} attach="material" />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1, 64]} />
        <primitive object={orbMat} attach="material" />
      </mesh>
      <mesh ref={scan} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.006, 8, 160]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>
      <mesh ref={ringA} rotation={[1.25, 0.25, 0]}>
        <torusGeometry args={[1.55, 0.005, 8, 200]} />
        <meshBasicMaterial color="#2340f5" transparent opacity={0.55} />
      </mesh>
      <mesh ref={ringB} rotation={[1.05, -0.5, 0.4]}>
        <torusGeometry args={[1.85, 0.004, 8, 220]} />
        <meshBasicMaterial color="#ff5a1f" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

export default function HeroScene({ active, still }: { active: boolean; still: boolean }) {
  return (
    <Canvas
      className="hero-canvas"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5], fov: 40 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      frameloop={active && !still ? 'always' : 'demand'}
      aria-hidden
    >
      <Field />
      <Orb />
    </Canvas>
  )
}
