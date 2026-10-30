import { useEffect, useRef, useState } from 'react'
import { useInView, BlurChars, PrimefoldMark } from './shared'

// specs/product-pages.md §2a — XI light illustrations (cards 01–03).
const DIR = '/assets/pages/experience-intelligence'

// ---------- XI 01 "Ask" — prompt card ----------
export function XiAsk() {
  const ref = useRef(null)
  const inView = useInView(ref, 0.5) // box appear replays every time
  const [typed, setTyped] = useState(false) // per-char text effect: once
  useEffect(() => {
    if (inView) setTyped(true)
  }, [inView])
  return (
    <div ref={ref} className="absolute inset-0">
      <div className={`xi-ask${inView ? ' is-in' : ''}`}>
        <div className="xi-ask__head">
          <img src="/assets/svg/logo-dark.svg" alt="Primefold" width="83" height="16" className="h-4 w-[83px]" />
          <img src={`${DIR}/icon-xi-badge-20.svg`} alt="" width="20" height="20" className="h-5 w-5" />
        </div>
        <div className="xi-ask__panel">
          <div className="xi-ask__text">
            <BlurChars text="Which accounts are at highest risk this quarter?" play={typed} />
          </div>
          <span className="xi-ask__send" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 10V2M6 2L2.5 5.5M6 2l3.5 3.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}

// ---------- XI 02 "Understand" — orbit ----------
// Ring diameters / spin from spec; item placement & which dots turn teal are approximated from frames 01–18.
const RINGS = [
  { d: 150, dur: 9, dir: -1, angle: 12 },
  { d: 196, dur: 10, dir: 1, angle: 48 },
  { d: 336, dur: 11, dir: -1, angle: 160 },
  { d: 306, dur: 12, dir: 1, angle: 95 },
]
// type: icon (absorb order k) | dot (teal at step k, 0 = teal from start, null = stays white)
const ITEMS = [
  { ring: 0, a: 150, type: 'icon', src: 'YBfKsuVihJd5As1b5tx0UaIR8rg.svg', k: 1 },
  { ring: 0, a: 30, type: 'dot', s: 11, k: 0 },
  { ring: 0, a: 250, type: 'dot', s: 10, k: null },
  { ring: 1, a: 20, type: 'icon', src: 'HrV7906XM5NNguIDPaNODeUaGek.svg', k: 2 },
  { ring: 1, a: 300, type: 'icon', src: 'IqTCcF1NoPgN3HPveLsmOfTTe4.svg', k: 3 },
  { ring: 1, a: 110, type: 'dot', s: 10, k: 1 },
  { ring: 1, a: 210, type: 'dot', s: 11, k: null },
  { ring: 2, a: 10, type: 'dot', s: 10, k: null },
  { ring: 2, a: 100, type: 'dot', s: 13, k: 3 },
  { ring: 2, a: 200, type: 'dot', s: 10, k: null },
  { ring: 2, a: 320, type: 'dot', s: 14, k: 5 },
  { ring: 3, a: 60, type: 'icon', src: '9euztWnrazUfkGrAoTxTOQk9fls.svg', k: 4 },
  { ring: 3, a: 230, type: 'icon', src: 'DOaHKQwBKxFj1mHniDaFfbQJcNk.svg', k: 5 },
  { ring: 3, a: 170, type: 'dot', s: 11, k: 2 },
  { ring: 3, a: 290, type: 'dot', s: 13, k: 4 },
  { ring: 0, a: 330, type: 'dot', s: 10, k: 0 },
]
// V1 →1.0s→ V2 →0.1s→ V3 →1.0s→ V4 →0.1s→ V5 →1.0s→ V6 →0.3s→ V7 →1.0s→ V8 →0.2s→ V9 →1.0s→ V10 →0.3s→ V11
const XI2_DELAYS = [1.0, 0.1, 1.0, 0.1, 1.0, 0.3, 1.0, 0.2, 1.0, 0.3]

function useVariantTimeline(ref, delays, threshold = 0.5) {
  const inView = useInView(ref, threshold)
  const [v, setV] = useState(1)
  useEffect(() => {
    if (!inView) {
      setV(1)
      return undefined
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(delays.length + 1)
      return undefined
    }
    const timers = []
    let t = 0
    delays.forEach((d, i) => {
      t += d * 1000
      timers.push(setTimeout(() => setV(i + 2), t))
    })
    return () => timers.forEach(clearTimeout)
  }, [inView, delays])
  return [v, inView]
}

export function XiUnderstand() {
  const ref = useRef(null)
  const [v] = useVariantTimeline(ref, XI2_DELAYS)
  // even variant 2k = icon k being absorbed; odd 2k+1 = icon k gone, its dot turns teal
  const absorbing = (k) => v >= 2 * k
  const gone = (k) => v >= 2 * k + 1
  const instant = v === 5 || v === 9 || v === 11
  return (
    <div ref={ref} className={`xi-orbit${instant ? ' is-instant' : ''}`}>
      {RINGS.map((r, ri) => (
        <div key={ri} className="xi-orbit__ring" style={{ width: r.d, height: r.d, marginLeft: -r.d / 2, marginTop: -r.d / 2, '--a': `${r.angle}deg` }}>
          <div className="xi-orbit__spin" style={{ animationDuration: `${r.dur}s`, animationDirection: r.dir > 0 ? 'normal' : 'reverse' }}>
            <svg width={r.d} height={r.d} viewBox={`0 0 ${r.d} ${r.d}`} fill="none" className="absolute inset-0">
              <circle cx={r.d / 2} cy={r.d / 2} r={r.d / 2 - 0.45} stroke="rgba(0,0,0,.16)" strokeWidth=".9" strokeDasharray="1.81" />
            </svg>
            {ITEMS.filter((it) => it.ring === ri).map((it, i) => {
              const radius = r.d / 2
              if (it.type === 'icon') {
                const abs = absorbing(it.k)
                return (
                  <div
                    key={i}
                    className="xi-orbit__item"
                    style={{ transform: `rotate(${it.a}deg) translateX(${abs ? 0 : radius}px) rotate(${-it.a}deg)`, opacity: gone(it.k) ? 0 : 1 }}
                  >
                    <div className="xi-orbit__upright" style={{ animationDuration: `${r.dur}s`, animationDirection: r.dir > 0 ? 'normal' : 'reverse', '--a': `${-r.angle}deg` }}>
                      <span className={`xi-orbit__icon${abs ? ' is-small' : ''}`}>
                        <img src={`${DIR}/${it.src}`} alt="" width="20" height="20" />
                      </span>
                    </div>
                  </div>
                )
              }
              const teal = it.k === 0 || (it.k != null && gone(it.k))
              return (
                <div key={i} className="xi-orbit__item" style={{ transform: `rotate(${it.a}deg) translateX(${radius}px) rotate(${-it.a}deg)` }}>
                  <span className="xi-orbit__dot" style={{ width: it.s, height: it.s }}>
                    <i style={{ opacity: teal ? 1 : 0 }} />
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
      <div className="xi-orbit__core">
        <PrimefoldMark size={50} color="rgb(26,24,20)" />
      </div>
      <div className="xi-orbit__fade xi-orbit__fade--top" />
      <div className="xi-orbit__fade xi-orbit__fade--bottom" />
    </div>
  )
}

// ---------- XI 03 "Act" — chat + charts ----------
// 1 →2.0s→ 2 →1.0s→ 3 →0.5s→ 4 … →0.5s→ 9. Step mapping (question, answer, charts, 5 bars, donut) from frames.
const XI3_DELAYS = [2.0, 1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
const BARS = [
  [115, 'rgb(228,172,145)'],
  [91, 'rgb(119,178,169)'],
  [39, 'rgb(119,178,169)'],
  [51, 'rgb(228,172,145)'],
  [74, 'rgb(119,178,169)'],
]
// donut segments [fraction, colour], clockwise from 3 o'clock — read from the live final state (re-measured 2026-10-30)
const DONUT = [
  [0.25, 'rgb(119,178,169)'],
  [0.2, 'rgb(58,55,45)'],
  [0.55, 'rgb(228,172,145)'],
]

export function XiAct() {
  const ref = useRef(null)
  const [v, inView] = useVariantTimeline(ref, XI3_DELAYS)
  const [run, setRun] = useState(0)
  useEffect(() => {
    if (inView) setRun((n) => n + 1)
  }, [inView])
  const C = 2 * Math.PI * 70
  let acc = 0
  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center">
      <div className={`xi-act${inView ? ' is-on' : ''}`} data-v={v}>
        <div className="xi-act__q">{inView && <BlurChars key={run} text="Which accounts are at highest risk this quarter?" play />}</div>
        <div className={`xi-act__collapse${v >= 2 ? ' is-open' : ''}`}>
          <div className="xi-act__inner">
            <div className="xi-act__a">{v >= 2 && <BlurChars key={run} text="Three DACH accounts at risk." play />}</div>
          </div>
        </div>
        <div className={`xi-act__collapse${v >= 3 ? ' is-open' : ''}`}>
          <div className="xi-act__inner">
            <div className="xi-act__charts">
              <div className="xi-act__chart">
                <div className="xi-act__title">NPS by Region</div>
                <div className="xi-act__bars">
                  {BARS.map(([h, c], i) => (
                    <i key={i} style={{ height: v >= 4 + i ? h : 1, background: c }} />
                  ))}
                </div>
              </div>
              <div className="xi-act__chart">
                <div className="xi-act__title">Ticket volume by week</div>
                <div className="xi-act__donut">
                  <svg width="120" height="120" viewBox="0 0 164 164" className={v >= 9 ? 'is-drawn' : ''}>
                    <g className="xi-act__ring">
                      {DONUT.map(([f, c], i) => {
                        const len = f * C
                        const off = acc
                        acc += len
                        return (
                          <circle
                            key={i}
                            cx="82"
                            cy="82"
                            r="70"
                            fill="none"
                            stroke={c}
                            strokeWidth="20"
                            strokeDasharray={`${v >= 9 ? len : 0} ${C}`}
                            strokeDashoffset={-off}
                            style={{ transitionDelay: `${i * 0.12}s` }}
                          />
                        )
                      })}
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
