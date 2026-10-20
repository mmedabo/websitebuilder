import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { orb } from '../state'
import { simplex3 } from './glsl'

// Version B hero: "Chao Phraya et Bang Rak vus de l'Iconsiam" (Wikimedia Commons, CC0).
// The city stays still; only the river moves: a slow shimmer, light glints,
// and ripples that follow the pointer. Pointing at a service makes it livelier.
const IMG_ASPECT = 4032 / 3024
const WATERLINE = 0.25 // where the river meets the far bank, from the image bottom
const SIZES = [960, 1600, 2560, 3840]

function photoUrl() {
  // Cover-crop needs the wider of: screen width, or screen height at the image's aspect.
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
  const need = Math.max(window.innerWidth, window.innerHeight * IMG_ASPECT) * dpr
  const w = SIZES.find((s) => s >= need) ?? SIZES[SIZES.length - 1]
  return `./img/bangkok-night-${w}.jpg`
}

const vert = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`

const frag = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uTime;
uniform float uThink;
uniform float uAspect;
uniform float uWater;
${simplex3}

void main(){
  // object-fit: cover, zoomed 2% so the pointer parallax never shows an edge.
  float sa = uRes.x / uRes.y;
  vec2 scale = (sa > uAspect ? vec2(1.0, uAspect / sa) : vec2(sa / uAspect, 1.0)) * 0.98;
  // Bias the crop slightly low so the skyline and river both stay in frame.
  vec2 focus = clamp(vec2(0.5, 0.42), scale * 0.5, 1.0 - scale * 0.5);
  vec2 iuv = (vUv - 0.5) * scale + focus + (uMouse - 0.5) * scale * 0.01;
  vec2 m = (uMouse - 0.5) * scale + focus;

  float water = smoothstep(uWater, uWater - 0.03, iuv.y);
  float depth = clamp((uWater - iuv.y) / uWater, 0.0, 1.0);
  float t = uTime;

  // Horizontal shimmer, stronger toward the viewer.
  float amp = (0.0012 + depth * 0.004) * (1.0 + uThink * 1.5);
  vec2 d = vec2(
    snoise(vec3(iuv.x * 6.0, iuv.y * 90.0 - t * 0.8, t * 0.25)),
    snoise(vec3(iuv.x * 4.0 + 7.0, iuv.y * 60.0 - t * 0.6, t * 0.2)) * 0.35
  ) * amp;

  // Ripples around the pointer, only when the pointer is over the water.
  vec2 pd = (iuv - m) * vec2(uAspect, 1.0);
  float dist = length(pd);
  float ring = sin(dist * 140.0 - t * 5.0) * exp(-dist * 14.0) * (0.0035 + uThink * 0.002);
  ring *= smoothstep(uWater, uWater - 0.03, m.y);
  d += (pd / max(dist, 1e-4)) * ring * vec2(1.0 / uAspect, 1.0);

  vec2 suv = iuv + d * water;
  vec3 col = texture2D(uTex, suv).rgb;

  // Glints: brighten already-lit reflections in small, moving specks.
  float glint = snoise(vec3(suv.x * 220.0, suv.y * 700.0, t * 1.2));
  col += water * smoothstep(0.75, 1.0, glint) * dot(col, vec3(0.333)) * 0.6;

  gl_FragColor = vec4(col, 1.0);
}
`

function Photo({ url }: { url: string }) {
  const tex = useLoader(THREE.TextureLoader, url)
  const { size } = useThree()

  const mat = useMemo(() => {
    tex.minFilter = THREE.LinearFilter
    tex.generateMipmaps = false
    return new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uTex: { value: tex },
        uRes: { value: new THREE.Vector2(1, 1) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uTime: { value: 0 },
        uThink: { value: 0 },
        uAspect: { value: IMG_ASPECT },
        uWater: { value: WATERLINE },
      },
      depthTest: false,
      depthWrite: false,
    })
  }, [tex])
  useEffect(() => () => mat.dispose(), [mat])

  useFrame((_, dt) => {
    orb.think = THREE.MathUtils.damp(orb.think, orb.targetThink, 3, dt)
    const u = mat.uniforms
    u.uTime.value += dt
    u.uThink.value = orb.think
    u.uRes.value.set(size.width, size.height)
    // orb.pointer is -1..1 with y up; the shader wants 0..1.
    u.uMouse.value.x = THREE.MathUtils.damp(u.uMouse.value.x, (orb.pointer.x + 1) / 2, 4, dt)
    u.uMouse.value.y = THREE.MathUtils.damp(u.uMouse.value.y, (orb.pointer.y + 1) / 2, 4, dt)
  })

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}

export default function PhotoScene({ active, still }: { active: boolean; still: boolean }) {
  const url = useMemo(photoUrl, [])
  return (
    <Canvas
      className="hero-canvas"
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true }}
      frameloop={active && !still ? 'always' : 'demand'}
      aria-hidden
    >
      {/* Transparent until the texture loads, so the CSS photo underneath shows first. */}
      <Suspense fallback={null}>
        <Photo url={url} />
      </Suspense>
    </Canvas>
  )
}
