// parity_capture.mjs - live-vs-clone per-section screenshot capture for the product routes (R12).
// Usage: PLAYWRIGHT_MODULE=<path to playwright/index.mjs> node extraction/parity_capture.mjs <live|clone> <url> <width> <outdir> [reduce]
// Same viewport + same section-relative scroll offset on both sides: the page is wheel-scrolled to each section (arrive by
// scrolling), corrected until the section top sits 20px below the viewport top, then fonts/images are awaited. Sections
// taller than the viewport are captured in viewport-sized slices. Nothing machine-specific is stored in this repo.
// Run with "reduce" (prefers-reduced-motion) on both sides: the live hero rays shader then renders one fixed frame.
const { chromium } = (await import(process.env.PLAYWRIGHT_MODULE || 'playwright')).default ?? (await import(process.env.PLAYWRIGHT_MODULE || 'playwright'))
import fs from 'node:fs'
const [side, url, W, out, red] = [process.argv[2], process.argv[3], +process.argv[4], process.argv[5], process.argv[6]]
fs.mkdirSync(out, { recursive: true })
const H = 900
const LIVE = { hero: 'section[data-framer-name="Hero"]', steps: '[data-framer-name="Ask-Read-Decide"]', uses: '[data-framer-name="CX And insight teams"]',
  sources: '[data-framer-name="Trust Section"]', solutions: '[data-framer-name="Outcomes"]', loop: '[data-framer-name="The loop"]',
  cta: 'div[data-framer-name="XI"], div[data-framer-name="Main"]', footer: 'footer' }
const CLONE = { hero: '.pp-hero', steps: '.pp-steps', uses: '.pp-uses', sources: '.pp-src', solutions: '.pp-sol', loop: '.pp-loop', cta: '.pp > div:last-child', footer: 'footer' }
const SEL = side === 'live' ? LIVE : CLONE
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: W, height: H }, reducedMotion: red ? 'reduce' : 'no-preference', deviceScaleFactor: 1 })
const p = await ctx.newPage()
await p.goto(url, { waitUntil: 'load', timeout: 60000 })
await p.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {})
// cookie banner = runtime consent UI (not part of any section): hidden, never clicked
const hideConsent = () => p.evaluate(() => {
  const h = [...document.querySelectorAll('h2,h3,p,div')].find((e) => e.children.length === 0 && /^We value your privacy$/.test(e.textContent.trim()))
  let e = h; while (e && e !== document.body && getComputedStyle(e).position !== 'fixed') e = e.parentElement
  if (e && e !== document.body) e.style.setProperty('display', 'none', 'important')
})
await hideConsent()
await p.evaluate(() => document.fonts.ready)
await p.waitForTimeout(1500)
const plan = await p.evaluate((SEL) => Object.fromEntries(Object.entries(SEL).map(([k, s]) => { const e = document.querySelector(s); if (!e) return [k, null]; const r = e.getBoundingClientRect(); return [k, { y: r.top + scrollY, h: r.height }] })), SEL)
const res = {}
let cur = 0
for (const [k, r] of Object.entries(plan)) {
  if (!r) { res[k] = null; continue }
  const shots = []
  // sections taller than the viewport are captured in viewport-sized slices
  for (let off = 0; off < r.h - 1; off += H) {
    let target = Math.max(0, Math.round(r.y - 20 + off))
    while (Math.abs(cur - target) > 2) {
      const d = Math.max(-600, Math.min(600, target - cur))
      await p.mouse.wheel(0, d); await p.waitForTimeout(120)
      const now = await p.evaluate(() => scrollY); if (now === cur) break; cur = now
    }
    await p.evaluate((t) => window.scrollTo(0, t), target)
    await p.waitForTimeout(700)
    // correct for scroll-linked offsets so the slice starts at the same place relative to the section
    for (let k2 = 0; k2 < 3; k2++) {
      const dy = await p.evaluate(({ s, off }) => document.querySelector(s).getBoundingClientRect().top - 20 + off, { s: SEL[k], off })
      if (Math.abs(dy) < 1) break
      await p.evaluate((dy) => window.scrollBy(0, dy), dy); await p.waitForTimeout(500)
    }
    await hideConsent()
    await p.waitForTimeout(2600)
    await p.evaluate(() => Promise.all([document.fonts.ready, ...[...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r }))]))
    cur = await p.evaluate(() => scrollY)
    const info = await p.evaluate(({ s, side }) => {
      const e = document.querySelector(s); const r = e.getBoundingClientRect()
      const masks = []
      const add = (el) => { const q = el.getBoundingClientRect(); if (q.width && q.height) masks.push([q.left, q.top, q.width, q.height]) }
      // eyebrow braille spinner (80ms frame cycle)
      document.querySelectorAll('span').forEach((x) => { if (/^[⠀-⣿]$/.test(x.textContent.trim())) add(x) })
      // continuously animated, time-based layers (no shared clock between live and clone):
      // WebGL/canvas outside the hero (CTA wave shader, dotLottie), the clone's CTA wave image + Lottie, and the
      // solutions marquee rows (40.6 px/s, phase depends on load time), and the hero chat thread + prompt bar
      // (typing loop keeps running on live even under prefers-reduced-motion)
      document.querySelectorAll('canvas').forEach((c) => { if (!c.closest('section[data-framer-name="Hero"], .pp-hero')) add(c) })
      document.querySelectorAll('.pf-cta-wave').forEach((e) => add(e.parentElement))
      document.querySelectorAll('.pp-src__lottie, .pp-tick__row, .pp-hero__chat > div > div:nth-child(n+3)').forEach(add)
      return { sy: scrollY, rect: [r.left, r.top, r.width, r.height], masks }
    }, { s: SEL[k], side })
    const file = `${out}/${k}-${shots.length}.png`
    await p.screenshot({ path: file })
    shots.push({ file, ...info })
  }
  res[k] = shots
}
fs.writeFileSync(`${out}/index.json`, JSON.stringify({ plan, res }, null, 1))
console.log(JSON.stringify(plan))
await b.close()
