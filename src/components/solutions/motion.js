// Small motion primitives for the Solutions carousel (CLONE_SPEC 6 / 12 #17-19)

// Damped spring integrator (Framer-style stiffness/damping/mass). Mutates s = { x, v }.
export function stepSpring(s, target, { stiffness, damping, mass }, dt) {
  // fixed sub-steps for stability
  const n = Math.max(1, Math.ceil(dt / (1 / 240)))
  const h = dt / n
  for (let i = 0; i < n; i++) {
    const f = -stiffness * (s.x - target) - damping * s.v
    s.v += (f / mass) * h
    s.x += s.v * h
  }
  if (Math.abs(s.x - target) < 0.01 && Math.abs(s.v) < 0.01) { s.x = target; s.v = 0; return true }
  return false
}

// cubic-bezier(x1,y1,x2,y2) easing -> t => progress
export function cubicBezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by
  const sx = (t) => ((ax * t + bx) * t + cx) * t
  const sy = (t) => ((ay * t + by) * t + cy) * t
  const dsx = (t) => (3 * ax * t + 2 * bx) * t + cx
  return (x) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let t = x
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x
      const d = dsx(t)
      if (Math.abs(e) < 1e-6) break
      if (Math.abs(d) < 1e-6) break
      t -= e / d
    }
    // bisection fallback
    if (Math.abs(sx(t) - x) > 1e-4) {
      let lo = 0, hi = 1
      t = x
      for (let i = 0; i < 30; i++) { if (sx(t) < x) lo = t; else hi = t; t = (lo + hi) / 2 }
    }
    return sy(t)
  }
}
