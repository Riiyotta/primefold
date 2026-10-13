import { useEffect, useRef, useState } from 'react'
import { useInView, Orb, DocGlyph, Check } from './shared'
import { useBreakpoint } from '../../components/how/motion'

// specs/product-pages.md §2a — RI dark panels. All three cards share ONE 21.7s loop; each idles while the others play.
const DIR = '/assets/pages/realestate-intelligence'

export const SCHEDULES = {
  ask: [['rest', 0.8], ['ask', 2.6], ['sent', 0.4], ['hold', 17.3], ['fade', 0.6]],
  understand: [['rest', 5.3], ['find', 1.4], ['read', 2.0], ['think', 2.6], ['done', 9.8], ['fade', 0.6]],
  act: [['rest', 11.5], ['asked', 2.0], ['answer', 2.6], ['press', 0.25], ['trace', 4.75], ['fade', 0.6]],
}

const stateAt = (schedule, t) => {
  let acc = 0
  for (const [name, d] of schedule) {
    acc += d
    if (t < acc) return name
  }
  return schedule[schedule.length - 1][0]
}

/**
 * Shared loop clock: returns { [key]: stateName } for each schedule, advancing while `ref` is on screen
 * (paused offscreen, resumes where it left off). Re-renders only when a state changes.
 */
export function useLoopStates(ref, schedules, reducedState) {
  const total = Object.values(schedules)[0].reduce((s, [, d]) => s + d, 0)
  const initial = () => Object.fromEntries(Object.entries(schedules).map(([k, s]) => [k, stateAt(s, 0)]))
  const [states, setStates] = useState(initial)
  const inView = useInView(ref, 0)
  const elapsed = useRef(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (reducedState) setStates(reducedState)
      return undefined
    }
    if (!inView) return undefined
    let last = performance.now()
    const id = setInterval(() => {
      const now = performance.now()
      elapsed.current = (elapsed.current + (now - last) / 1000) % total
      last = now
      const next = Object.fromEntries(Object.entries(schedules).map(([k, s]) => [k, stateAt(s, elapsed.current)]))
      setStates((prev) => (Object.keys(next).some((k) => next[k] !== prev[k]) ? next : prev))
    }, 40)
    return () => clearInterval(id)
  }, [inView, schedules, total, reducedState])
  return states
}

const has = (state, list) => list.includes(state)

// ---------- RI 01 "A2 Ask" ----------
const QUESTION = 'Which leases have break options in 2027, and what rent is at stake?'
export function RiAsk({ state }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (state !== 'ask') {
      setN(0)
      return undefined
    }
    // typing speed not in spec: full question typed within the first ~2s of the 2.6s "Ask" hold
    const id = setInterval(() => setN((c) => (c >= QUESTION.length ? c : c + 1)), 30)
    return () => clearInterval(id)
  }, [state])
  const text = state === 'ask' ? QUESTION.slice(0, n) : ''
  return (
    <div className="ri-ask">
      <Orb size={40} silk={`${DIR}/IOC8KC5jHMKOyyOmPw4p500iQ0.png`} />
      <div className="ri-ask__greet">What would you like to find out?</div>
      <div className="ri-composer">
        <div className={`ri-composer__input${text ? ' has-text' : ''}`}>{text || 'Ask about your data, or describe what you want to find out…'}</div>
        <div className="ri-composer__actions">
          <span className="ri-composer__plus">+</span>
          <span className={`ri-composer__send${text ? ' is-on' : ''}`}>↑</span>
        </div>
      </div>
      <div className="ri-ask__chips">
        <span className="ri-chip ri-chip--on">Search lease contracts</span>
        <span className="ri-chip">Compare contracts</span>
      </div>
    </div>
  )
}

// ---------- RI 02 "A2 Understand" ----------
const FILES = [
  ['Lease 4.02', 'Lease', 'doc'],
  ['Lease 2.11', 'Lease', 'doc'],
  ['Lease 7.04', 'Lease', 'doc'],
  ['Addendum 3', 'Amendment', 'doc'],
  ['Rent roll Q2', 'Rent roll', 'table'],
  ['Facility agr.', 'Contract', 'doc'],
]

// geometry: desktop diagram 348x272 (spec); compact (phone) layout read from the 390 fullpage (approximation)
function understandGeo(compact) {
  if (!compact) {
    const orb = { x: 174, y: 120, r: 28 }
    const tiles = FILES.map((_, i) => {
      const left = i < 3
      const row = i % 3
      return { x: left ? 0 : 218, y: 25 + row * 76, w: 130, h: 38, ax: left ? 130 : 218, ay: 44 + row * 76 }
    })
    return { w: 348, h: 272, orb, tiles, status: 253 }
  }
  const orb = { x: 159, y: 136, r: 28 }
  const order = [0, 1, 2, 3, 4, 5]
  const tiles = order.map((i) => {
    const top = i < 3
    const col = i % 3
    return { x: col * 110, y: top ? 24 : 194, w: 98, h: 54, ax: col * 110 + 49, ay: top ? 78 : 194 }
  })
  return { w: 318, h: 290, orb, tiles, status: 272 }
}

function endOnOrb(t, orb) {
  const dx = orb.x - t.ax
  const dy = orb.y - t.ay
  const len = Math.hypot(dx, dy)
  return { x: orb.x - (dx / len) * (orb.r + 2), y: orb.y - (dy / len) * (orb.r + 2), len }
}

export function RiUnderstand({ state }) {
  const compact = useBreakpoint() === 'phone'
  const g = understandGeo(compact)
  const shown = has(state, ['find', 'read', 'think', 'done'])
  const lit = has(state, ['think', 'done'])
  const reading = state === 'read'
  const status =
    state === 'done' || state === 'fade' ? 'Read 38 documents · 11 leases ›' : state === 'think' ? 'Comparing 11 leases with market rent ›' : 'Reading 38 documents ›'
  return (
    <div className={`ri-und ri-und--${state}${compact ? ' is-compact' : ''}`} style={{ width: g.w, height: g.h }}>
      <div className="ri-bloom" style={{ left: g.orb.x - 108, top: g.orb.y - 108, opacity: shown ? 1 : 0 }} />
      <svg className="ri-und__lines" width={g.w} height={g.h} viewBox={`0 0 ${g.w} ${g.h}`} fill="none" style={{ opacity: shown ? 1 : 0 }}>
        <defs>
          {g.tiles.map((t, i) => {
            const e = endOnOrb(t, g.orb)
            return (
              <linearGradient key={i} id={`ri-und-g${i}`} gradientUnits="userSpaceOnUse" x1={t.ax} y1={t.ay} x2={e.x} y2={e.y}>
                <stop offset="0" stopColor="rgba(39,168,150,.35)" />
                <stop offset="1" stopColor="rgb(63,209,188)" />
              </linearGradient>
            )
          })}
        </defs>
        {g.tiles.map((t, i) => {
          const e = endOnOrb(t, g.orb)
          return (
            <g key={i}>
              <line x1={t.ax} y1={t.ay} x2={e.x} y2={e.y} stroke="rgba(255,255,255,.18)" strokeWidth="1" strokeDasharray="2 3" />
              <line
                x1={t.ax}
                y1={t.ay}
                x2={e.x}
                y2={e.y}
                stroke={`url(#ri-und-g${i})`}
                strokeWidth="1"
                className="ri-lit"
                style={{ strokeDasharray: e.len, strokeDashoffset: lit ? 0 : e.len, transitionDelay: lit ? `${i * 0.08}s` : '0s' }}
              />
            </g>
          )
        })}
      </svg>
      {reading &&
        g.tiles.map((t, i) => {
          const e = endOnOrb(t, g.orb)
          return <i key={i} className="ri-pulse" style={{ left: t.ax, top: t.ay, '--dx': `${e.x - t.ax}px`, '--dy': `${e.y - t.ay}px`, animationDelay: `${i * 0.18}s` }} />
        })}
      {g.tiles.map((t, i) => (
        <div
          key={FILES[i][0]}
          className={`ri-tile${lit ? ' is-read' : ''}${compact ? ' ri-tile--v' : ''}`}
          style={{ left: t.x, top: t.y, width: t.w, height: t.h, opacity: shown ? 1 : 0, transitionDelay: shown && state === 'find' ? `${i * 0.08}s` : '0s' }}
        >
          <span className="ri-tile__icon">
            <DocGlyph kind={FILES[i][2]} size={12} />
          </span>
          <span className="ri-tile__text">
            <span className="ri-tile__name">{FILES[i][0]}</span>
            {!compact && <span className="ri-tile__type">{FILES[i][1]}</span>}
          </span>
          <span className="ri-tile__check" style={{ opacity: lit ? 1 : 0, transform: lit ? 'scale(1)' : 'scale(.6)', transitionDelay: lit ? `${0.2 + i * 0.25}s` : '0s' }}>
            <Check size={14} />
          </span>
        </div>
      ))}
      <div className="ri-sweep-ring" style={{ left: g.orb.x - 34, top: g.orb.y - 34, opacity: reading ? 1 : 0 }}>
        <i />
      </div>
      <div className="absolute" style={{ left: g.orb.x - 28, top: g.orb.y - 28 }}>
        <Orb size={56} silk={`${DIR}/ZDaM2SysifJo4vNRlqD2XT4ZeA.png`} />
      </div>
      <div className="ri-und__status" style={{ top: g.status - 8, opacity: shown ? 1 : 0, color: state === 'done' ? 'rgb(203,199,192)' : 'rgb(161,156,148)' }}>
        <span key={status} className="ri-xfade">
          {status}
        </span>
      </div>
    </div>
  )
}

// ---------- RI 03 "A2 Act" ----------
const RENT = [
  ['Lease 4.02', '€1.9M', 194],
  ['Lease 2.11', '€1.4M', 143],
  ['Lease 7.04', '€1.1M', 112],
  ['Lease 3.08', '€0.8M', 82],
]
export function RiAct({ state }) {
  const asked = has(state, ['asked', 'answer', 'press', 'trace'])
  const answered = has(state, ['answer', 'press', 'trace'])
  const pressed = has(state, ['press', 'trace'])
  const trace = state === 'trace'
  return (
    <div className={`ri-act${state === 'fade' ? ' is-fading' : ''}`}>
      <div className="ri-act__q" style={{ opacity: asked ? 1 : 0, transform: asked ? 'none' : 'translateY(6px)' }}>
        Which leases have break options in 2027, and what rent is at stake?
      </div>
      <div className="ri-ans" style={{ opacity: asked ? 1 : 0 }}>
        <div className="ri-ans__sweep" style={{ opacity: state === 'asked' ? 1 : 0 }}>
          <i />
        </div>
        <div className="ri-ans__body">
          <div className="ri-ans__think" style={{ opacity: state === 'asked' ? 1 : 0, transform: state === 'asked' ? 'scale(1)' : 'scale(.8)' }}>
            <Orb size={59} silk={`${DIR}/5duIkDB521lrS5tEAbwfVbu4Bk.png`} />
          </div>
          <div className="ri-ans__text ri-rev" style={{ '--d': '0s' }} data-on={answered}>
            4 of 11 leases need notice before 31 Dec 2026. Renegotiate the 2 below market rent first.
          </div>
          <div className="ri-result ri-rev" style={{ '--d': '.25s' }} data-on={answered}>
            <div className="ri-result__title">Rent at stake · 2027 break options</div>
            {RENT.map(([l, v, w], i) => (
              <div key={l} className="ri-bar">
                <span className="ri-bar__label">{l}</span>
                <span className="ri-bar__value">{v}</span>
                <span className="ri-bar__track">
                  <i style={{ width: answered ? w : 0, transitionDelay: answered ? `${0.45 + i * 0.1}s` : '0s' }} />
                </span>
              </div>
            ))}
            <div className="ri-clause" style={{ opacity: trace ? 1 : 0, transform: trace ? 'none' : 'translateY(8px) scale(.98)' }}>
              <div className="ri-clause__src">Lease 4.02.pdf · §4.3</div>
              <div className="ri-clause__hl">The Tenant may terminate this lease as of 30 June 2027 on 6 months&apos; notice.</div>
            </div>
          </div>
          <div className="ri-srcs ri-rev" style={{ '--d': '.9s' }} data-on={answered}>
            {[
              ['Lease 4.02', 'doc'],
              ['Lease 2.11', 'doc'],
              ['Rent roll Q2', 'table'],
            ].map(([l, k], i) => (
              <span key={l} className={`ri-src${i === 0 && pressed ? ' is-pressed' : ''}`}>
                <span className="ri-src__icon">
                  <DocGlyph kind={k} size={10} />
                </span>
                {l}
              </span>
            ))}
          </div>
          <div className="ri-next ri-rev" style={{ '--d': '1.1s' }} data-on={answered}>
            <span aria-hidden="true">→</span> Build a notice-deadline calendar
          </div>
        </div>
      </div>
    </div>
  )
}

export const RI_STILLS = [`${DIR}/BStpgcNqGi2wH3pDgwuVOsCemOs.jpg`, `${DIR}/2fSp0Y2vmM6Y6mRapzzC4MFGi0o.jpg`, `${DIR}/EHWB7ZohB5b8RN5R7CDd7jgf9VY.jpg`]
