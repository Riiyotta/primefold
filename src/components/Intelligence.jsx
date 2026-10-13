import { useEffect, useRef, useState } from 'react'
import Eyebrow from './shared/Eyebrow'
import { useBreakpoint, createSpring } from './how/motion'
import { XIVisual, RIVisual, CIVisual } from './intel/Visuals'
import './intel/intel.css'

const CARDS = [
  {
    key: 'xi',
    href: '/experience-intelligence',
    badge: '/assets/svg/img-experience-intelligence-da4f266c.svg',
    head: 'Experience Intelligence',
    eyebrow: (
      <>
        <span style={{ color: 'rgb(32,131,116)' }}>Live today ·</span>{' CX · HR · product'}
      </>
    ),
    title: 'Experience Intelligence',
    desc: 'Turn every survey, review, ticket and message into a prioritized decision your team can act on – in one conversation, on live data.',
    mTitle: 'Experience Intelligence',
    mDesc: 'Turn every survey, review, ticket and message into a prioritized decision your team can act on. In one conversation, on live data.',
  },
  {
    key: 'ri',
    href: '/realestate-intelligence',
    badge: '/assets/svg/img-real-estate-intelligence-f0b57e1f.svg',
    head: 'Real Estate Intelligence',
    eyebrow: <span style={{ color: 'rgb(202,123,87)' }}>Beta · GA H2 2026</span>,
    title: 'Real Estate Intelligence',
    desc: 'Underwriting, risk, rent rolls and capex, answered in one conversation.',
    mTitle: 'Real Estate Intelligence',
    mDesc: 'Make sense of underwriting, rent rolls and CapEx. Turn complexity into clarity and get ready for action. Every answer grounded in its source.',
  },
  {
    key: 'ci',
    badge: '/assets/svg/img-corporate-intelligence-08b2ee81.svg',
    head: 'Next Intelligence',
    eyebrow: <span style={{ color: 'rgb(89,74,255)' }}>Planned 2027</span>,
    title: 'More coming in 2027',
    desc: null,
    mTitle: 'Coming in 2027',
    mDesc: null,
  },
]

function Visual({ k, active, mobile }) {
  if (k === 'xi')
    return (
      <XIVisual
        active={active}
        lottieSrc={mobile ? '/assets/lottie/1ZEqVNGcLr5LXnzhYZ2dZA8Wl7I.json' : '/assets/lottie/xNm1ok67qiSXrtlhAImlRlSghE.json'}
      />
    )
  if (k === 'ri') return <RIVisual />
  return <CIVisual />
}

function Head({ c }) {
  return (
    <div className="ic-head">
      <img src={c.badge} alt="" width="20" height="20" />
      <span className="ic-head__title">{c.head}</span>
      <span className="ic-head__eyebrow">{c.eyebrow}</span>
    </div>
  )
}

/* 4.1 Desktop: hover-expanding row */
function DesktopCards() {
  const [hover, setHover] = useState(-1)
  return (
    <div className="ic-row" onMouseLeave={() => setHover(-1)}>
      {CARDS.map((c, i) => {
        const active = hover === i
        const Tag = c.href ? 'a' : 'div'
        return (
          <Tag
            key={c.key}
            href={c.href}
            className={`ic ic--${c.key}${active ? ' is-active' : ''}${active && i < 2 ? ' is-grow' : ''}`}
            onMouseEnter={() => setHover(i)}
          >
            <Head c={c} />
            <div className="ic-content">
              <div className="ic-visual">
                <Visual k={c.key} active={active} />
              </div>
              <div className="ic-text">
                <div className="ic-text__col">
                  <div className="ic-text__title">{c.title}</div>
                  {c.desc && <div className="ic-text__desc">{c.desc}</div>}
                </div>
                {c.href && (
                  <div className="ic-text__btn">
                    <span className="pf-btn pf-btn--black" tabIndex={-1}>
                      <span>Explore</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Tag>
        )
      })}
    </div>
  )
}

/* 4.2 Tablet & phone: sticky stacked cards.
   Measured on the live site (@810x1080 and @390x844):
   - sticky tops: tablet 144/200/244, phone 40/60/80
   - each card scales (origin centre) linearly over 400px of scroll, starting when the card's own in-flow top
     reaches START[bp][i] px from the viewport top (spring-smoothed k500 c60)
   - the "appear" variant (PDF card, CI chips, XI Lottie) switches on at that same moment and switches off for
     every card once the stack releases (card 1 leaves its sticky position) or when scrolled back above START */
const STACK = [
  { scale: 0.86, y: -20 },
  { scale: 0.91, y: -20, phone: { scale: 0.91, y: -10, opacity: 0.98 } },
  { scale: 0.96, y: 0 },
]
const TOPS = { tablet: [144, 200, 244], phone: [40, 60, 80] }
const START = { tablet: [682, 754, 840], phone: [445, 537, 650] }
const RANGE = 400
const GAP = 120

function MobileStack({ phone }) {
  const wrap = useRef(null)
  const cards = useRef([])
  const [appeared, setAppeared] = useState([false, false, false])
  const bp = phone ? 'phone' : 'tablet'

  useEffect(() => {
    const els = cards.current
    const tops = TOPS[bp]
    const start = START[bp]
    const springs = els.map((el, i) => {
      const cfg = (phone && STACK[i].phone) || STACK[i]
      return createSpring({
        stiffness: 500,
        damping: 60,
        initial: 0,
        onUpdate: (p) => {
          const s = 1 - p * (1 - cfg.scale)
          el.style.transform = p > 0.0005 ? `translateY(${(cfg.y * p).toFixed(2)}px) scale(${s.toFixed(4)})` : ''
          if (cfg.opacity) el.style.opacity = p > 0.0005 ? String(1 - p * (1 - cfg.opacity)) : ''
        },
      })
    })
    let first = true
    const update = () => {
      const w = wrap.current.getBoundingClientRect()
      let natural = w.top
      const on = []
      const released = w.bottom < tops[0] + els[0].offsetHeight - 0.5
      els.forEach((el, i) => {
        const raw = (start[i] - natural) / RANGE
        springs[i].set(Math.min(1, Math.max(0, raw)), first)
        on.push(raw > 0 && !released)
        natural += el.offsetHeight + GAP
      })
      first = false
      setAppeared((a) => (a.every((v, i) => v === on[i]) ? a : on))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      springs.forEach((s) => s.stop())
      els.forEach((el) => el && ((el.style.transform = ''), (el.style.opacity = '')))
    }
  }, [phone, bp])

  return (
    <div className="ic-stack" ref={wrap}>
      {CARDS.map((c, i) => {
        const Tag = c.href ? 'a' : 'div'
        return (
          <Tag
            key={c.key}
            href={c.href}
            ref={(el) => (cards.current[i] = el)}
            className={`ic ic--m ic--${c.key}${appeared[i] ? ' is-appear' : ''}`}
            style={{ top: TOPS[bp][i] }}
          >
            <Head c={c} />
            <div className="ic-content">
              <div className="ic-visual">
                <Visual k={c.key} active={appeared[i]} mobile />
              </div>
              <div className="ic-text">
                <div className="ic-text__col">
                  <div className="ic-text__title">{c.mTitle}</div>
                  {c.mDesc && <div className="ic-text__desc">{c.mDesc}</div>}
                </div>
                {c.href && (
                  <div className="ic-text__btn">
                    <span className="pf-btn pf-btn--black">
                      <span>Explore</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Tag>
        )
      })}
      {/* live: an empty trailing flex child adds one more 120px gap, so the stack stays pinned 120px longer */}
      <i className="ic-stack__end" aria-hidden="true" />
    </div>
  )
}

export default function Intelligence() {
  const bp = useBreakpoint()
  return (
    <section className="ic-section">
      <div className="ic-title">
        <div className="ic-title__stack">
          <Eyebrow className="justify-center">One intelligence. Applied to different fields.</Eyebrow>
          <h2 className="t-h2">
            Turn questions into
            <br />
            better decisions.
          </h2>
          <p className="t-lead">Each intelligence has its own language, its own sources, its own expertise.</p>
        </div>
      </div>
      {bp === 'desktop' ? <DesktopCards /> : <MobileStack phone={bp === 'phone'} />}
    </section>
  )
}
