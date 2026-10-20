import { useEffect, useRef } from 'react'
import { brandRamp } from './glsl'

// Liquid-metal "II" mark in raw WebGL, after paper-design/liquid-logo.
// A 2D canvas draws the mark; R holds the sharp mask and G a blurred
// height field. The shader derives a normal from G and reflects a
// flowing, striped environment tinted with the brand colours.

const SIZE = 256

function buildMask() {
  const c = document.createElement('canvas')
  c.width = c.height = SIZE
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, SIZE, SIZE)
  ctx.fillStyle = '#fff'
  const w = SIZE * 0.2
  const h = SIZE * 0.66
  const y = (SIZE - h) / 2
  const r = w * 0.32
  for (const x of [SIZE * 0.23, SIZE * 0.57]) {
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, r)
    ctx.fill()
  }
  const src = ctx.getImageData(0, 0, SIZE, SIZE)
  const mask = new Float32Array(SIZE * SIZE)
  for (let i = 0; i < mask.length; i++) mask[i] = src.data[i * 4] / 255

  // Three separable box-blur passes approximate a Gaussian bevel.
  let height = mask.slice()
  const tmp = new Float32Array(mask.length)
  // A blur close to half the bar width turns each bar into a dome.
  const rad = 18
  for (let pass = 0; pass < 3; pass++) {
    for (let yy = 0; yy < SIZE; yy++) {
      let acc = 0
      for (let xx = -rad; xx <= rad; xx++) acc += height[yy * SIZE + Math.min(SIZE - 1, Math.max(0, xx))]
      for (let xx = 0; xx < SIZE; xx++) {
        tmp[yy * SIZE + xx] = acc / (rad * 2 + 1)
        const add = Math.min(SIZE - 1, xx + rad + 1)
        const sub = Math.max(0, xx - rad)
        acc += height[yy * SIZE + add] - height[yy * SIZE + sub]
      }
    }
    for (let xx = 0; xx < SIZE; xx++) {
      let acc = 0
      for (let yy = -rad; yy <= rad; yy++) acc += tmp[Math.min(SIZE - 1, Math.max(0, yy)) * SIZE + xx]
      for (let yy = 0; yy < SIZE; yy++) {
        height[yy * SIZE + xx] = acc / (rad * 2 + 1)
        const add = Math.min(SIZE - 1, yy + rad + 1)
        const sub = Math.max(0, yy - rad)
        acc += tmp[add * SIZE + xx] - tmp[sub * SIZE + xx]
      }
    }
  }
  height = height.map((v, i) => v * mask[i])
  const peak = height.reduce((m, v) => (v > m ? v : m), 0) || 1
  height = height.map((v) => v / peak)

  const out = new Uint8Array(SIZE * SIZE * 4)
  for (let i = 0; i < mask.length; i++) {
    out[i * 4] = mask[i] * 255
    out[i * 4 + 1] = height[i] * 255
    out[i * 4 + 3] = 255
  }
  return out
}

const vert = `
attribute vec2 aPos;
varying vec2 vUv;
void main(){ vUv = aPos * 0.5 + 0.5; vUv.y = 1.0 - vUv.y; gl_Position = vec4(aPos, 0.0, 1.0); }
`

const frag = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform float uTime;
uniform vec2 uPointer;
${brandRamp}

float env(vec3 r, float t){
  // Flowing stripes, bent by the reflection vector — the liquid-metal look.
  float a = r.y * 2.2 + r.x * 0.8 + sin(r.x * 3.0 + t) * 0.35 + t * 0.25;
  float s = 0.5 + 0.5 * sin(a * 6.2831);
  s = smoothstep(0.05, 0.95, s);
  return mix(0.22, 1.0, s);
}

void main(){
  float px = 1.0 / ${SIZE}.0;
  float mask = texture2D(uTex, vUv).r;
  if (mask < 0.02) { gl_FragColor = vec4(0.0); return; }
  float hL = texture2D(uTex, vUv - vec2(px, 0.0)).g;
  float hR = texture2D(uTex, vUv + vec2(px, 0.0)).g;
  float hD = texture2D(uTex, vUv - vec2(0.0, px)).g;
  float hU = texture2D(uTex, vUv + vec2(0.0, px)).g;
  float h = texture2D(uTex, vUv).g;
  vec3 n = normalize(vec3((hL - hR) * 14.0, (hD - hU) * 14.0, 1.0));
  vec3 r = reflect(vec3(uPointer * 0.25, -1.0), n);

  float t = uTime;
  float e = env(r, t);
  // Colour metal: the reflection picks a brand colour, then shades it.
  vec3 col = brandRamp(e * 0.55 + r.x * 0.25 + t * 0.04) * (0.5 + 0.62 * e);
  // White glints on the brightest bands.
  col = mix(col, vec3(1.0), pow(e, 7.0) * 0.7);
  // Darken the rim so each bar reads as a rounded, solid form.
  col *= mix(0.55, 1.0, smoothstep(0.0, 0.45, h));
  gl_FragColor = vec4(col * mask, mask);
}
`

export default function LiquidLogo({ size = 40, still = false }: { size?: number; still?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true })
    if (!gl) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = canvas.height = Math.round(size * dpr)

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vert))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, frag))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SIZE, SIZE, 0, gl.RGBA, gl.UNSIGNED_BYTE, buildMask())
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uPointer = gl.getUniformLocation(prog, 'uPointer')
    gl.viewport(0, 0, canvas.width, canvas.height)

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    const onMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)

    let raf = 0
    const start = performance.now()
    const draw = () => {
      pointer.x += (pointer.tx - pointer.x) * 0.06
      pointer.y += (pointer.ty - pointer.y) * 0.06
      gl.uniform1f(uTime, still ? 1.2 : (performance.now() - start) / 1000)
      gl.uniform2f(uPointer, pointer.x, pointer.y)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    const loop = () => {
      if (visible) draw()
      raf = requestAnimationFrame(loop)
    }
    if (still) draw()
    else loop()

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [size, still])

  return <canvas ref={ref} className="liquid-logo" style={{ width: size, height: size }} aria-hidden />
}
