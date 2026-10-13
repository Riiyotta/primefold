import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import './testimonials/testimonials.css'

// CLONE_SPEC 5 — Testimonials carousel
const XI = { label: 'Experience Intelligence', badge: '/assets/svg/img-experience-intelligence-da4f266c.svg', cta: 'Explore XI', href: '/experience-intelligence' }
const RI = { label: 'Real Estate Intelligence', badge: '/assets/svg/img-real-estate-intelligence-f0b57e1f.svg', cta: 'Explore RI', href: '/realestate-intelligence' }

// logo: [md+ w, h] from spec 5; phone [w, h] measured in tree390 (DIRTS 94x40, Nicole 111x22) — others use the Outcomes sizes (spec 8)
const SLIDES = [
  { img: '/assets/9Yky6fB1AoenMkNm8rzRwLJxM8.jpg', product: XI, quote: '"The next bestselling color was never on the list."', name: 'Janek Strobel', role: 'Head of Operations', logo: '/assets/mlevCnZoqAApeTSZWClq74jYCg.png', logoAlt: 'DIRTS logo', lg: [132, 56], sm: [94, 40] },
  { img: '/assets/OCJYK6agr32RKk3h6WGSSJgSB0g.jpg', product: RI, quote: '"If you don\'t fully know your assets, collecting and analyzing everything about them is a struggle, try Primefold."', name: 'Ammar Tahirovic', role: 'Intelligence Analyst', logo: '/assets/0I7dW2NSk2zVnHLMvfACsc1BIr8.png', logoAlt: 'NAS Invest logo', lg: [130, 56], sm: [93, 40] },
  { img: '/assets/qkL7CkFhbnE5G6A9rxHv5zbgxz8.jpg', product: XI, quote: '"As an early-stage startup, you drown in signals. Primefold XI turned them into decisions."', name: 'Jakob Hebenstreit', role: 'Co-Founder', logo: '/assets/vBdLAfXU5G3G8FMre5KLbUkCzWc.svg', logoAlt: 'Gainback logo', lg: [56, 56], sm: [40, 40] },
  { img: '/assets/07ZMtQS80wekxrvQAxnTtIZWXc.jpeg', product: XI, quote: '"With Primefold, we were able to gain completely new insights into our target group, which led to more specific content formats and new sponsorships."', name: 'Nicole Bilecki', role: 'Head of Women & Lifestyle', logo: '/assets/zBz0VomWfjQ5l9E8sVDczIDkkM.webp', logoAlt: 'Customer logo', lg: [181, 36], sm: [111, 22] },
]
const N = SLIDES.length
const COPIES = 5 // loop buffer; active index is normalised back into the middle copy after each move
const MID = 2 * N
const SWIPE = 50

function Chevron({ flip }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M5 2l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Card({ s, phone, onClickCapture }) {
  const [lw, lh] = phone ? s.sm : s.lg
  return (
    <a
      href={s.product.href}
      onClickCapture={onClickCapture}
      draggable={false}
      className="tm-card relative flex h-full w-full flex-col items-start justify-between overflow-clip rounded-[24px] px-5 py-10 text-white no-underline md:p-16"
      style={{ boxShadow: '0 0 0 1px rgba(0,0,0,.16)' }}
    >
      <img src={s.img} alt="" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,.56)' }} />
      <div className="relative flex w-full max-w-[800px] flex-col items-start gap-4 md:gap-6">
        <div className="flex w-full flex-col items-start gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <img src={s.product.badge} alt="" width="20" height="20" className="h-5 w-5" />
            <p className="m-0 text-[14px] font-medium leading-5 tracking-[-0.084px] text-white">{s.product.label}</p>
          </div>
          <h2 className="tm-quote">{s.quote}</h2>
        </div>
        <span className="pf-btn pf-btn--white">{s.product.cta}</span>
      </div>
      <div className="relative flex w-full flex-col items-start gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
        <div className="flex flex-col justify-center">
          <p className="m-0 text-[18px] font-medium leading-6 tracking-[-0.18px] text-white">{s.name}</p>
          <p className="m-0 text-[16px] leading-6 tracking-[-0.16px] text-white opacity-80">{s.role}</p>
        </div>
        <img src={s.logo} alt={s.logoAlt} draggable={false} style={{ width: lw, height: lh }} className="shrink-0 object-cover" />
      </div>
    </a>
  )
}

export default function Testimonials() {
  const boxRef = useRef(null)
  const [cw, setCw] = useState(0)
  const [phone, setPhone] = useState(() => typeof window !== 'undefined' && !window.matchMedia('(min-width: 810px)').matches)
  const [idx, setIdx] = useState(MID)
  const [instant, setInstant] = useState(false)
  const drag = useRef({ x: 0, y: 0, active: false, swiped: false })

  useLayoutEffect(() => {
    const el = boxRef.current
    const ro = new ResizeObserver(() => setCw(el.clientWidth))
    ro.observe(el)
    setCw(el.clientWidth)
    const mq = window.matchMedia('(min-width: 810px)')
    const onMq = () => setPhone(!mq.matches)
    mq.addEventListener('change', onMq)
    return () => { ro.disconnect(); mq.removeEventListener('change', onMq) }
  }, [])

  // Re-enable the transition on the frame after an instant (loop) jump
  useEffect(() => {
    if (!instant) return
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)))
    return () => cancelAnimationFrame(id)
  }, [instant])

  // Slide geometry: phone 358 @390 (= container − 32, gap 20); md+ min(1280, container), gap 24 (step 1304 @1440, 794 @810)
  const slideW = phone ? cw - 32 : Math.min(1280, cw)
  const gap = phone ? 20 : 24
  const step = slideW + gap
  const x = (cw - slideW) / 2 - idx * step

  const go = useCallback((delta) => setIdx((i) => i + delta), [])
  const goTo = (n) => setIdx((i) => i - (((i % N) + N) % N) + n)

  const onTransitionEnd = (e) => {
    if (e.target !== e.currentTarget) return
    if (idx < MID || idx >= MID + N) {
      setInstant(true)
      setIdx(MID + (((idx % N) + N) % N))
    }
  }

  const onPointerDown = (e) => {
    drag.current = { x: e.clientX, y: e.clientY, active: true, swiped: false }
  }
  const onPointerUp = (e) => {
    const d = drag.current
    if (!d.active) return
    d.active = false
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (Math.abs(dx) >= SWIPE && Math.abs(dx) > Math.abs(dy)) {
      d.swiped = true
      go(dx < 0 ? 1 : -1)
    }
  }
  const onClickCapture = (e) => {
    if (drag.current.swiped) { e.preventDefault(); drag.current.swiped = false }
  }

  const active = ((idx % N) + N) % N
  const slides = []
  for (let c = 0; c < COPIES; c++) SLIDES.forEach((s, i) => slides.push({ s, key: `${c}-${i}` }))

  return (
    <section className="relative overflow-clip bg-white pb-6 pt-20 md:px-5 md:pt-[120px]" aria-roledescription="carousel" aria-label="Testimonials">
      <div
        ref={boxRef}
        className="relative h-[600px] w-full touch-pan-y select-none md:h-[650px]"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { drag.current.active = false }}
      >
        <div
          className={`tm-track absolute left-0 top-0 flex h-full ${instant ? 'is-instant' : ''}`}
          style={{ gap, transform: `translateX(${x}px)` }}
          onTransitionEnd={onTransitionEnd}
        >
          {cw > 0 && slides.map(({ s, key }, i) => (
            <div key={key} className="h-full shrink-0" style={{ width: slideW }} aria-hidden={i !== idx}>
              <Card s={s} phone={phone} onClickCapture={onClickCapture} />
            </div>
          ))}
        </div>
        <button type="button" className="tm-arrow left-6 md:left-[45px]" aria-label="Previous testimonial" onClick={() => go(-1)}>
          <Chevron flip />
        </button>
        <button type="button" className="tm-arrow right-6 md:right-[45px]" aria-label="Next testimonial" onClick={() => go(1)}>
          <Chevron />
        </button>
        <div className="absolute bottom-6 left-1/2 z-[2] flex -translate-x-1/2 gap-2">
          {SLIDES.map((s, i) => (
            <button key={s.name} type="button" className={`tm-dot ${i === active ? 'is-active' : ''}`} aria-label={`Go to testimonial ${i + 1}`} onClick={() => goTo(i)} />
          ))}
        </div>
      </div>
    </section>
  )
}
