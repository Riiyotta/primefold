import { useEffect, useState } from 'react'

// Breakpoints from CLONE_SPEC 0.1
export const MQ_DESKTOP = '(min-width: 1200px)'
export const MQ_PHONE = '(max-width: 809.98px)'

export function useMediaQuery(query) {
  const get = () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false)
  const [match, setMatch] = useState(get)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const on = () => setMatch(mql.matches)
    on()
    mql.addEventListener('change', on)
    return () => mql.removeEventListener('change', on)
  }, [query])
  return match
}

// 'desktop' | 'tablet' | 'phone'
export function useBreakpoint() {
  const desktop = useMediaQuery(MQ_DESKTOP)
  const phone = useMediaQuery(MQ_PHONE)
  return desktop ? 'desktop' : phone ? 'phone' : 'tablet'
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Minimal damped spring (Framer-style stiffness/damping/mass) that follows a target
 * value and calls onUpdate(value) every frame until settled. Returns { set, value, stop }.
 */
export function createSpring({ stiffness = 500, damping = 60, mass = 1, initial = 0, onUpdate }) {
  let x = initial
  let v = 0
  let target = initial
  let raf = 0
  let last = 0
  const step = (t) => {
    const dt = Math.min(0.064, (t - last) / 1000 || 0.016)
    last = t
    // integrate in small sub-steps for stability with stiff springs
    const n = Math.ceil(dt / 0.004)
    const h = dt / n
    for (let i = 0; i < n; i++) {
      const a = (-stiffness * (x - target) - damping * v) / mass
      v += a * h
      x += v * h
    }
    if (Math.abs(v) < 0.001 && Math.abs(x - target) < 0.001) {
      x = target
      v = 0
      raf = 0
      onUpdate(x)
      return
    }
    onUpdate(x)
    raf = requestAnimationFrame(step)
  }
  return {
    set(next, immediate = false) {
      target = next
      if (immediate) {
        x = next
        v = 0
        onUpdate(x)
        return
      }
      if (!raf) {
        last = performance.now()
        raf = requestAnimationFrame(step)
      }
    },
    get value() {
      return x
    },
    stop() {
      cancelAnimationFrame(raf)
      raf = 0
    },
  }
}
