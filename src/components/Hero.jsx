import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import './hero/hero.css'

const CALENDLY = 'https://calendly.com/d/dv3b-wwt-mfy/talk-to-primefold'

const SLIDES = [
  {
    bg: '/assets/RAjs2AsxMPYWQK7qgQzwPegjUEI.webp',
    alt: '',
    title: 'Everything answers. If you simply ask.',
    body: 'Type a question, get the work done: the analysis, the report, the next move. One intelligence per field.',
    ctas: [
      { label: 'Book a call', href: CALENDLY, external: true },
      { label: 'See how it works', href: '#see-the-platform', anchor: true },
    ],
  },
  {
    bg: '/assets/whU1ew3cUmTlwn8jZq7aYOjcWOU.webp',
    alt: 'People browsing in a modern store with large windows.',
    title: 'Ask your customers, your tenants, your teams. Anyone.',
    body: 'Experience Intelligence, built to find the value in every voice.',
    ctas: [
      { label: 'Explore XI', href: '/experience-intelligence' },
      { label: 'Book a call', href: CALENDLY, external: true },
    ],
  },
  {
    bg: '/assets/0ludMTRIYsIsZjBXbYoAOYh09IY.webp',
    alt: 'a view of a city skyline at dusk',
    title: 'Ask your portfolio anything.',
    body: 'Real Estate Intelligence, built to grow asset value.',
    ctas: [
      { label: 'Explore RI', href: '/realestate-intelligence' },
      { label: 'Book a call', href: CALENDLY, external: true },
    ],
  },
]

const TABS = [
  { label: 'Platform', icon: '/assets/0ngLiiCSe7c81sENFiXDCxUe8Ew.svg', iconOn: '/assets/Ok2FqoeufFP2awsp0MRNxJXTDA.svg' },
  { label: 'Experience Intelligence', icon: '/assets/8Xe3QbAF8z173WRaVrPeURWrGc.svg' },
  { label: 'Real Estate Intelligence', icon: '/assets/Vmatt47vXW6vUstSo8WnUvQwvRQ.svg' },
  { label: 'More coming in 2027', icon: '/assets/FKdTY48jmzOKCr6FVHOYD8MSv7s.svg', static: true },
]

const OFFSETS = [60, 80, 100, 120]

function scrollToAnchor(e, href) {
  const el = document.querySelector(href)
  if (!el) return
  e.preventDefault()
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export default function Hero() {
  const [state, setState] = useState({ index: 0, prev: null, dir: null, cycle: 0 })
  const parallaxRef = useRef(null)
  const scrollerRef = useRef(null)
  const rowRef = useRef(null)
  const tabRefs = useRef([])
  const prevTimer = useRef(0)

  const go = useCallback((next, dirHint) => {
    setState((s) => {
      if (next === s.index) return { ...s, cycle: s.cycle + 1 }
      const dir = dirHint || (next > s.index ? 'r' : 'l')
      return { index: next, prev: s.index, dir, cycle: s.cycle + 1 }
    })
  }, [])

  // drop the previous slide once the incoming panel + content blocks have finished
  useEffect(() => {
    if (state.prev === null) return
    clearTimeout(prevTimer.current)
    prevTimer.current = setTimeout(() => setState((s) => ({ ...s, prev: null })), 1000)
    return () => clearTimeout(prevTimer.current)
  }, [state.prev, state.index])

  const advance = () => go((state.index + 1) % SLIDES.length, 'r')

  // Parallax: translateY = 0.6 × scrollY
  useEffect(() => {
    let raf = 0
    const apply = () => {
      raf = 0
      const y = window.scrollY
      if (parallaxRef.current && y <= window.innerHeight * 1.5) {
        parallaxRef.current.style.transform = `translate3d(0, ${(y * 0.6).toFixed(2)}px, 0)`
      }
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }
    apply()
    window.addEventListener('scroll', on, { passive: true })
    return () => {
      window.removeEventListener('scroll', on)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Phone: keep the active chip scrolled into view (row translateX)
  useLayoutEffect(() => {
    const row = rowRef.current
    const scroller = scrollerRef.current
    const tab = tabRefs.current[state.index]
    if (!row || !scroller || !tab) return
    const isPhone = window.matchMedia('(max-width: 809.98px)').matches
    if (!isPhone) {
      row.style.transform = ''
      return
    }
    const max = Math.max(0, row.scrollWidth - (scroller.clientWidth - 40))
    const x = Math.min(max, Math.max(0, tab.offsetLeft))
    row.style.transform = `translateX(${-x}px)`
  }, [state.index])

  return (
    <section className="pf-hero" aria-roledescription="carousel" aria-label="Primefold">
      <div className="pf-hero__trigger" aria-hidden="true" />
      <div className="pf-hero__parallax" ref={parallaxRef}>
        <div className="pf-hero__section">
          {SLIDES.map((s, i) => {
            const active = i === state.index
            const isPrev = i === state.prev
            const anim = active && state.dir ? ` anim-${state.dir}` : ''
            const cls = `pf-slide${active ? ' is-active' : ''}${isPrev ? ' is-prev' : ''}${anim}`
            const TitleTag = i === 1 ? 'h1' : 'div'
            return (
              <div key={i} className={cls} aria-hidden={!active}>
                <img className="pf-slide__bg" src={s.bg} alt={s.alt} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
                <div className="pf-slide__overlay" />
                <div className="pf-slide__content">
                  <div className="pf-slide__inner">
                    <div className="pf-slide__stack" key={active ? `a${state.cycle}` : 'i'}>
                      <TitleTag className="pf-slide__title pf-blk" style={{ '--off': `${OFFSETS[0]}px` }}>
                        {s.title}
                      </TitleTag>
                      <p className="pf-slide__body pf-blk" style={{ '--off': `${OFFSETS[1]}px` }}>
                        {s.body}
                      </p>
                      <div className="pf-slide__ctas pf-blk" style={{ '--off': `${OFFSETS[2]}px` }}>
                        {s.ctas.map((c, ci) => (
                          <a
                            key={c.label}
                            className={`pf-hcta ${ci === 0 ? 'pf-hcta--white' : 'pf-hcta--glass'}`}
                            href={c.href}
                            tabIndex={active ? 0 : -1}
                            {...(c.external ? { target: '_blank', rel: 'noopener' } : {})}
                            onClick={c.anchor ? (e) => scrollToAnchor(e, c.href) : undefined}
                          >
                            {c.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          <div className="pf-tabs">
            <div className="pf-tabs__inner">
              <span className="pf-sr" aria-live="polite">
                Autoplay is on. Use the Pause button for a better experience with a screen reader.
              </span>
              {/* live site: "Back to first" (jump to slide 1) shows once index > 0; "Next card" always shows and wraps */}
              <div className="pf-tabs__arrows">
                {state.index > 0 && (
                  <button type="button" className="pf-tabs__arrow" aria-label="Back to first" onClick={() => go(0, 'l')}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M13 2v12M10 8L4 3v10l6-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" transform="scale(-1,1) translate(-16,0)" />
                    </svg>
                  </button>
                )}
                <button type="button" className="pf-tabs__arrow" aria-label="Next card" onClick={advance}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M5 2l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div className="pf-tabs__scroller" ref={scrollerRef}>
                <div className="pf-tabs__row" ref={rowRef} role="tablist">
                  {TABS.map((t, i) => {
                    const active = i === state.index
                    const content = (
                      <>
                        <span className="pf-tab__icon" aria-hidden="true">
                          <img className={`is-off${t.iconOn ? ' has-on' : ''}`} src={t.icon} alt="" />
                          {t.iconOn && <img className="is-on" src={t.iconOn} alt="" />}
                        </span>
                        <span className="pf-tab__label">{t.label}</span>
                        {active && (
                          <span className="pf-tab__progress" aria-hidden="true">
                            <i key={state.cycle} onAnimationEnd={advance} />
                          </span>
                        )}
                      </>
                    )
                    return t.static ? (
                      <div key={t.label} className="pf-tab is-static" ref={(el) => (tabRefs.current[i] = el)}>
                        {content}
                      </div>
                    ) : (
                      <button
                        key={t.label}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        className={`pf-tab${active ? ' is-active' : ''}`}
                        ref={(el) => (tabRefs.current[i] = el)}
                        onClick={() => go(i)}
                      >
                        {content}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
