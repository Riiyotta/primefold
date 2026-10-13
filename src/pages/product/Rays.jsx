import { useEffect, useRef, useState } from 'react'

// specs/product-pages.md §1.3 — hero "rays" WebGL background, ported from the captured source
// (specs/product-pages-src/hero-live-conversation-and-rays.js, `et`/`rt`). logo:false on both pages.
const VERT = 'attribute vec2 aPos;void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }'
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseGlow;
uniform float uLogo;
uniform vec2 uMix;
const vec3 BG = vec3(0.0431, 0.0431, 0.0471);
const vec3 TEAL = vec3(0.2471, 0.8196, 0.7373);
const vec3 ORANGE = vec3(0.9765, 0.6157, 0.4471);
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
  mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for(int i = 0; i < 4; i++){ v += a * noise(p); p = p * 2.03 + 19.7; a *= 0.5; }
  return v; }
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime * 0.06;
  float ar = max(aspect, 1.0);
  vec2 m = vec2(uMouse.x * aspect, uMouse.y);
  float md = distance(p, m);
  float pointer = exp(-md * md * 6.5) * uMouseGlow;
  vec2 L = vec2(aspect * 0.62, 0.5);
  float ld = distance(p, L);
  float wob = (fbm(p * 3.0 + t * 0.8) - 0.5) * 0.18;
  float nearFade = mix(0.04, 1.0, smoothstep(0.13, 0.42, ld + wob));
  nearFade = mix(1.0, nearFade, uLogo);
  vec2 A = vec2(aspect * 1.02, 1.05);
  float sway = 0.05 * sin(uTime * 0.35) + 0.05 * (noise(vec2(uTime * 0.22, 4.1)) - 0.5);
  vec2 od = normalize(L - A);
  od = normalize(vec2(od.x - od.y * sway, od.y + od.x * sway));
  vec2 operp = vec2(-od.y, od.x);
  float along = dot(p - A, od);
  float across = dot(p - L, operp);
  float core = exp(-abs(across) * 36.0);
  float halo = exp(-across * across * 110.0);
  float tex = smoothstep(0.45, 0.78, fbm(vec2(across * 9.0, along * 1.4 - t * 6.0)));
  float reach = exp(-max(along, 0.0) * 2.0 / ar);
  float flick = 0.72 + 0.34 * noise(vec2(uTime * 2.2, 7.3));
  float surge = pow(0.5 + 0.5 * sin(uTime * 0.55 + 1.0), 10.0) * 1.4 + pow(0.5 + 0.5 * sin(uTime * 0.23), 14.0) * 1.0;
  float oCut = 1.0 - smoothstep(length(L - A) * 0.95, length(L - A) * 1.3, along);
  float bolt = (core * 0.9 + halo * 0.5 * tex) * reach * (flick + surge) * oCut;
  bolt *= nearFade;
  bolt *= 1.0 + pointer * 1.4 + uMouseGlow * 0.4;
  vec2 TA = vec2(-0.06, 0.06);
  float tsway = 0.04 * sin(uTime * 0.28 + 2.0) + 0.04 * (noise(vec2(uTime * 0.19, 9.4)) - 0.5);
  vec2 td = normalize(L - TA);
  td = normalize(vec2(td.x - td.y * tsway, td.y + td.x * tsway));
  vec2 tperp = vec2(-td.y, td.x);
  float talong = dot(p - TA, td);
  float tacross = dot(p - L, tperp);
  float tcore = exp(-abs(tacross) * 42.0);
  float thalo = exp(-tacross * tacross * 130.0);
  float ttex = smoothstep(0.48, 0.8, fbm(vec2(tacross * 8.0, talong * 1.6 - t * 5.0)));
  float treach = exp(-max(talong, 0.0) * 2.2 / ar);
  float tflick = 0.8 + 0.25 * noise(vec2(uTime * 1.8, 2.2));
  float tsurge = pow(0.5 + 0.5 * sin(uTime * 0.42 + 3.0), 12.0) * 1.3;
  float tCut = 1.0 - smoothstep(length(L - TA) * 0.95, length(L - TA) * 1.3, talong);
  float tealBeam = (tcore * 0.8 + thalo * 0.6 * ttex) * treach * (tflick + tsurge) * tCut;
  tealBeam *= nearFade;
  tealBeam *= 1.0 + pointer * 1.3 + uMouseGlow * 0.45;
  vec3 col = BG;
  col += ORANGE * bolt * 0.85 * uMix.x;
  col += TEAL * tealBeam * 1.18 * uMix.y;
  vec3 pcol = mix(TEAL, ORANGE, smoothstep(0.15, 0.85, uv.x));
  col += pcol * pointer * 0.22;
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.035;
  gl_FragColor = vec4(col, 1.0); }
`

const MIX = { teal: [0.22, 1.75], orange: [2.2, 0.12], balanced: [1.35, 0.75] }

// Static fallback when WebGL is unavailable: CSS approximation of the two rays (not from spec).
const FALLBACK = {
  teal: 'linear-gradient(160deg, rgba(249,157,114,0) 70%, rgba(249,157,114,.08) 85%, rgba(249,157,114,0) 100%), linear-gradient(-18deg, rgba(63,209,188,0) 28%, rgba(63,209,188,.45) 33%, rgba(63,209,188,0) 40%)',
  orange: 'linear-gradient(-18deg, rgba(63,209,188,0) 28%, rgba(63,209,188,.06) 33%, rgba(63,209,188,0) 40%), linear-gradient(225deg, rgba(249,157,114,0) 8%, rgba(249,157,114,.7) 14%, rgba(249,157,114,0) 22%)',
}

export default function Rays({ colorMode = 'teal' }) {
  const wrap = useRef(null)
  const canvas = useRef(null)
  const [failed, setFailed] = useState(false)
  const [restore, setRestore] = useState(0)

  useEffect(() => {
    const box = wrap.current
    const cv = canvas.current
    if (!box || !cv) return
    const onLost = (e) => e.preventDefault()
    const onRestored = () => setRestore((n) => n + 1)
    cv.addEventListener('webglcontextlost', onLost)
    cv.addEventListener('webglcontextrestored', onRestored)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const gl = cv.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' })
    if (!gl) {
      setFailed(true)
      return () => {
        cv.removeEventListener('webglcontextlost', onLost)
        cv.removeEventListener('webglcontextrestored', onRestored)
      }
    }
    const sh = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFailed(true)
      return undefined
    }
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uMouse = gl.getUniformLocation(prog, 'uMouse')
    const uGlow = gl.getUniformLocation(prog, 'uMouseGlow')
    const uLogo = gl.getUniformLocation(prog, 'uLogo')
    const uMix = gl.getUniformLocation(prog, 'uMix')
    const mix = MIX[colorMode] || MIX.balanced
    gl.uniform2f(uMix, mix[0], mix[1])
    gl.uniform1f(uLogo, 0)

    let raf = 0
    let visible = true
    let debounce = 0
    const t0 = performance.now()
    const mouse = { x: 0.5, y: 0.5 }
    const target = { x: 0.5, y: 0.5 }
    let glow = 0
    let glowTarget = 0

    const resize = () => {
      const r = box.getBoundingClientRect()
      const s = Math.min(window.devicePixelRatio || 1, 1.5) * 0.75
      const w = Math.max(1, Math.round(r.width * s))
      const h = Math.max(1, Math.round(r.height * s))
      cv.width = w
      cv.height = h
      gl.viewport(0, 0, w, h)
      gl.uniform2f(uRes, w, h)
    }
    const draw = (now) => {
      mouse.x += (target.x - mouse.x) * 0.06
      mouse.y += (target.y - mouse.y) * 0.06
      glow += (glowTarget - glow) * 0.05
      gl.uniform1f(uTime, reduce ? 40 : (now - t0) / 1000)
      gl.uniform2f(uMouse, mouse.x, mouse.y)
      gl.uniform1f(uGlow, glow)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      draw(now)
    }
    const start = () => {
      if (!raf && !reduce && visible && !document.hidden) raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }
    const onMove = (e) => {
      const r = box.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = 1 - (e.clientY - r.top) / r.height
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1
      glowTarget = inside ? 1 : 0
      if (inside) {
        target.x = x
        target.y = y
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    const ro = new ResizeObserver(() => {
      clearTimeout(debounce)
      debounce = setTimeout(() => {
        resize()
        if (reduce || !raf) draw(performance.now())
      }, 120)
    })
    ro.observe(box)
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting
        if (visible) start()
        else stop()
      },
      { threshold: 0 },
    )
    io.observe(box)
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)
    resize()
    if (reduce) draw(performance.now())
    else start()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      clearTimeout(debounce)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('visibilitychange', onVis)
      cv.removeEventListener('webglcontextlost', onLost)
      cv.removeEventListener('webglcontextrestored', onRestored)
      gl.deleteProgram(prog)
      gl.deleteBuffer(buf)
    }
  }, [colorMode, restore])

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ background: '#0B0B0C', contain: 'layout paint style' }}
    >
      {failed ? (
        <div className="absolute inset-0" style={{ background: FALLBACK[colorMode] || FALLBACK.teal }} />
      ) : (
        <canvas ref={canvas} className="absolute inset-0 block h-full w-full" />
      )}
    </div>
  )
}
