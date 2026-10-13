import { useEffect, useRef, useState } from 'react'
import Eyebrow from './shared/Eyebrow'
import Button from './shared/Button'
import { stepSpring, cubicBezier } from './solutions/motion'

// CLONE_SPEC 6 — "Built for every team." drag/drift card carousel
const CARDS = [
  { img: '/assets/RIjH19JJ8DvQamX9HDKg7VWbBM.webp', title: 'Asset manager', text: 'Talk to your portfolio. Know your exposure, renewals and obligations, down to the clause.', cta: 'Explore  RI', href: '/realestate-intelligence' },
  { img: '/assets/gKDbEEFrzbOGZRjHe04RbEaotM.webp', title: 'CX manager', text: 'Know why customers leave and how to fix it.', cta: 'Explore  XI', href: '/experience-intelligence' },
  { img: '/assets/JGTzpslef9rSgfzJqV3ZOBMFwQ.webp', title: 'HR / People manager', text: 'Ask your people. Act while it still matters.', cta: 'Explore  XI', href: '/experience-intelligence' },
  { img: '/assets/R6Jj9Z2JPALtAXaI6edzv92aGE.webp', title: 'Marketing manager', text: 'Every campaign, survey and review. Read and turned into your next move.', cta: 'Explore  XI', href: '/experience-intelligence' },
  { img: '/assets/TxwVY1FIAJFI0frWJNMxfQCJecU.webp', title: 'Product manager', text: 'Talk to your users. Know what to build next, ranked by impact.', cta: 'Explore  XI', href: '/experience-intelligence' },
]
const GAP = 24
const ENTRY = 120 // translate(120px,120px) -> 0
const SCROL2_TOP = 100 // hidden "Scrol 2" spacer: top at section top + 100, 500px tall
const SCROL2_H = 500
const SPEED = 0.4 // scrollSpeed 40
const DELTA_CLAMP = 150
const SWIPE = 50
const DRIFT_SPRING = { stiffness: 110, damping: 28, mass: 0.6 }
const ENTRY_SPRING = { stiffness: 500, damping: 83, mass: 1 }
const TWEEN_MS = 500
const ease = cubicBezier(0.42, 0, 0, 1)

const btnShadow = '0 0 0 1px rgba(38,57,90,.16), 0 1px 1px 0 rgba(38,57,91,.1)'

function Chevron({ flip }) {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M5 2l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowButton({ disabled, onClick, label, flip }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-10 w-14 items-center justify-center rounded-full border-0 bg-white p-0 text-[rgb(19,19,19)] [transition:opacity_.2s,scale_.15s] active:[scale:.9] disabled:cursor-default disabled:opacity-40 enabled:cursor-pointer"
      style={{ boxShadow: btnShadow }}
    >
      <Chevron flip={flip} />
    </button>
  )
}

function Card({ c, onClickCapture }) {
  return (
    <div
      className="relative flex h-[364px] w-[320px] shrink-0 flex-col items-start justify-end gap-2 overflow-clip rounded-xl md:h-[488px] md:w-[465px]"
      style={{ boxShadow: '0 0 0 1px rgba(0,0,0,.08)' }}
    >
      <img src={c.img} alt="" draggable={false} loading="lazy" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      <div className="absolute bottom-0 left-0 h-[319px] w-full" style={{ backgroundImage: 'linear-gradient(rgba(8,8,8,0) 0%, rgb(9,9,9) 100%)' }} />
      <div className="relative flex w-full flex-col items-start gap-4 p-8">
        {/* text is a fixed 401px wide in source — on the 320px phone card it is clipped by the card, as measured */}
        <div className="flex flex-col items-start gap-2">
          <h3 className="m-0 w-[401px] font-headline text-[20px] font-normal leading-7 text-white">{c.title}</h3>
          <div className="w-[401px] opacity-[.72]">
            <p className="m-0 text-[14px] leading-5 tracking-[-0.084px] text-white">{c.text}</p>
          </div>
        </div>
        <Button variant="arrow" href={c.href} draggable={false} onClickCapture={onClickCapture}>
          <span className="whitespace-pre">{c.cta}</span>
        </Button>
      </div>
    </div>
  )
}

export default function Solutions() {
  const sectionRef = useRef(null)
  const viewRef = useRef(null)
  const entryRef = useRef(null)
  const rowRef = useRef(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const st = useRef({
    max: 0, step: 489, target: 0,
    x: { x: 0, v: 0 }, entry: { x: ENTRY, v: 0 }, entryTarget: ENTRY,
    tween: null, lastY: 0, raf: 0, last: 0,
  })
  const drag = useRef({ x: 0, y: 0, active: false, swiped: false })
  const flags = useRef({ start: true, end: false })

  useEffect(() => {
    const s = st.current
    const view = viewRef.current

    const syncFlags = () => {
      const start = s.target <= 0.5
      const end = s.target >= s.max - 0.5
      if (start !== flags.current.start) { flags.current.start = start; setAtStart(start) }
      if (end !== flags.current.end) { flags.current.end = end; setAtEnd(end) }
    }

    const measure = () => {
      const phone = !window.matchMedia('(min-width: 810px)').matches
      const cardW = phone ? 320 : 465
      s.step = cardW + GAP
      s.max = Math.max(0, CARDS.length * cardW + (CARDS.length - 1) * GAP - view.clientWidth)
      s.target = Math.min(s.target, s.max)
      syncFlags()
      kick()
    }

    const entryProgress = () => {
      const top = sectionRef.current.getBoundingClientRect().top + SCROL2_TOP
      const p = (window.innerHeight - top) / SCROL2_H
      return Math.min(1, Math.max(0, p))
    }

    const apply = () => {
      entryRef.current.style.transform = `translate(${s.entry.x}px, ${s.entry.x}px)`
      rowRef.current.style.transform = `translateX(${-s.x.x}px)`
    }

    const frame = (now) => {
      const dt = Math.min(0.064, (now - (s.last || now)) / 1000) || 1 / 60
      s.last = now
      let done = true
      if (s.tween) {
        const t = Math.min(1, (now - s.tween.t0) / TWEEN_MS)
        s.x.x = s.tween.from + (s.tween.to - s.tween.from) * ease(t)
        s.x.v = 0
        if (t >= 1) s.tween = null
        done = false
      } else if (!stepSpring(s.x, s.target, DRIFT_SPRING, dt)) done = false
      if (!stepSpring(s.entry, s.entryTarget, ENTRY_SPRING, dt)) done = false
      apply()
      if (done) { s.raf = 0; s.last = 0 } else s.raf = requestAnimationFrame(frame)
    }
    const kick = () => { if (!s.raf) s.raf = requestAnimationFrame(frame) }

    const onScroll = () => {
      const y = window.scrollY
      const d = Math.max(-DELTA_CLAMP, Math.min(DELTA_CLAMP, y - s.lastY))
      s.lastY = y
      s.entryTarget = ENTRY * (1 - entryProgress())
      const r = view.getBoundingClientRect()
      if (r.bottom > 0 && r.top < window.innerHeight && d !== 0) {
        s.target = Math.max(0, Math.min(s.max, s.target + SPEED * d))
        syncFlags()
      }
      kick()
    }

    s.lastY = window.scrollY
    s.entryTarget = ENTRY * (1 - entryProgress())
    s.entry.x = s.entryTarget
    measure()
    apply()

    const ro = new ResizeObserver(measure)
    ro.observe(view)
    window.addEventListener('scroll', onScroll, { passive: true })
    s.move = (dir) => {
      const cur = s.tween ? s.tween.to : s.target
      const k = dir > 0 ? Math.floor(cur / s.step + 1e-3) + 1 : Math.ceil(cur / s.step - 1e-3) - 1
      const to = Math.max(0, Math.min(s.max, k * s.step))
      s.target = to
      s.tween = { from: s.x.x, to, t0: performance.now() }
      syncFlags()
      kick()
    }
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      if (s.raf) cancelAnimationFrame(s.raf)
      s.raf = 0
    }
  }, [])

  const move = (dir) => st.current.move && st.current.move(dir)

  const onPointerDown = (e) => { drag.current = { x: e.clientX, y: e.clientY, active: true, swiped: false } }
  const onPointerUp = (e) => {
    const d = drag.current
    if (!d.active) return
    d.active = false
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (Math.abs(dx) >= SWIPE && Math.abs(dx) > Math.abs(dy)) { d.swiped = true; move(dx < 0 ? 1 : -1) }
  }
  const onClickCapture = (e) => { if (drag.current.swiped) { e.preventDefault(); drag.current.swiped = false } }

  return (
    <section ref={sectionRef} className="relative flex flex-col items-center gap-8 bg-white pb-20 [overflow-x:clip] md:gap-14 md:pb-[120px]">
      <div className="container-pf flex flex-col items-end gap-4 pt-20 md:flex-row md:gap-2 md:pt-[120px]">
        <div className="flex w-full flex-col items-start gap-4 md:w-auto md:flex-1 lg:w-[548px] lg:flex-none">
          <Eyebrow>Solutions</Eyebrow>
          <h2 className="t-h2 m-0">Built for every team.</h2>
        </div>
        <div className="flex w-full items-center justify-end gap-2 md:w-auto md:flex-1">
          <ArrowButton label="Previous" flip disabled={atStart} onClick={() => move(-1)} />
          <ArrowButton label="Next" disabled={atEnd} onClick={() => move(1)} />
        </div>
      </div>
      <div className="container-pf">
        <div
          ref={viewRef}
          className="relative w-full touch-pan-y select-none"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { drag.current.active = false }}
        >
          <div ref={entryRef} className="will-change-transform">
            <div ref={rowRef} className="flex w-max gap-6 will-change-transform">
              {CARDS.map((c) => <Card key={c.title} c={c} onClickCapture={onClickCapture} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
