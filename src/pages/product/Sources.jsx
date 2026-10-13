import { useEffect, useRef, useState } from 'react'
import Eyebrow from '../../components/shared/Eyebrow'
import { useLoopStates } from './RiIllustrations'
import { Orb, DocGlyph, Check } from './shared'

// specs/product-pages.md §2c Sources ("Trust Section")

// XI right column: looping Lottie via lottie_light (SVG renderer; avoids full lottie-web clipPath id collisions).
function LottieLoop({ src }) {
  const box = useRef(null)
  useEffect(() => {
    let dead = false
    let anim = null
    Promise.all([import('lottie-web/build/player/lottie_light'), fetch(src).then((r) => r.json())]).then(([mod, data]) => {
      if (dead || !box.current) return
      const lottie = mod.default || mod
      anim = lottie.loadAnimation({
        container: box.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: data,
        rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
      })
      anim.setSpeed(1)
      anim.setDirection(1)
    })
    return () => {
      dead = true
      anim?.destroy()
    }
  }, [src])
  return <div ref={box} className="pp-src__lottie" aria-hidden="true" />
}

// ---------- RI "A3 Sources" 12s loop ----------
const A3 = { s: [['rest', 0.8], ['connect', 3.6], ['read', 2.4], ['answer', 1.6], ['trace', 1.6], ['hold', 1.4], ['fade', 0.6]] }
const A3_REDUCED = { s: 'hold' }
const DOCS = [
  ['Leases & addenda', 'PDF, DOCX, scanned', 'doc'],
  ['Rent rolls', 'Excel, CSV, PMS export', 'table'],
  ['Capex schedules', 'Budgets, tenders', 'tools'],
  ['Valuations', 'External reports', 'chart'],
]
const SYSTEMS = [
  ['Property management', 'PMS exports', 'building'],
  ['Data room', 'Deal folders', 'folder'],
  ['Shared drive', 'Team folders', 'drive'],
  ['Inbox', 'Deal correspondence', 'inbox'],
]

// Desktop geometry = spec (494x445 diagram, tiles 179x46, orb 61, beam 2x89, answer 323x86, clause 310x67), rows read from frames.
// Compact (M0x) geometry read from the 390 fullpage (approximation — not in spec).
function a3Geo(compact) {
  if (!compact) {
    const tiles = [...DOCS, ...SYSTEMS].map((_, i) => {
      const left = i < 4
      const top = 21 + (i % 4) * 61
      return { x: left ? 0 : 315, y: top, w: 179, h: 46, ax: left ? 179 : 315, ay: top + 23 }
    })
    return {
      w: 494, h: 445, scale: 0.95, tiles,
      labels: [{ x: 0, y: 0, t: 'DOCUMENTS' }, { x: 315, y: 0, t: 'SYSTEMS' }],
      orb: { x: 247, y: 135.5, r: 30.5 }, ri: { x: 247, y: 179, center: true },
      beam: { x: 246, y: 192, h: 89 }, answer: { x: 85.5, y: 281, w: 323 }, clause: { x: 92, y: 375, w: 310 },
    }
  }
  const cw = 68
  const gap = (300 - cw * 4) / 3
  const tiles = [...DOCS, ...SYSTEMS].map((_, i) => {
    const top = i < 4
    const x = (i % 4) * (cw + gap)
    const y = top ? 16 : 276
    return { x, y, w: cw, h: 58, ax: x + cw / 2, ay: top ? y + 58 : y }
  })
  return {
    w: 300, h: 532, scale: 1, tiles,
    labels: [{ x: 0, y: 0, t: 'DOCUMENTS' }, { x: 0, y: 258, t: 'SYSTEMS' }],
    orb: { x: 150, y: 196, r: 25 }, ri: { x: 182, y: 196 },
    beam: { x: 149, y: 222, h: 140 }, answer: { x: 0, y: 362, w: 300 }, clause: { x: 0, y: 456, w: 300 },
  }
}

function RiSourcesLoop() {
  const ref = useRef(null)
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const el = ref.current
    const ro = new ResizeObserver(([e]) => setCompact(e.contentRect.width < 500))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const { s } = useLoopStates(ref, A3, A3_REDUCED)
  const g = a3Geo(compact)
  const after = (list) => list.includes(s)
  const connected = after(['connect', 'read', 'answer', 'trace', 'hold'])
  const lit = after(['read', 'answer', 'trace', 'hold'])
  const answered = after(['answer', 'trace', 'hold'])
  const traced = after(['trace', 'hold'])
  const names = [...DOCS, ...SYSTEMS]
  return (
    <div className="ri-a3" ref={ref}>
      <img className="ri-panel__still" src="/assets/pages/realestate-intelligence/2qCwMSdou8S5NHxbINBs0qpKA0.jpg" alt="" />
      <div className={`ri-a3__diagram${s === 'fade' ? ' is-fading' : ''}${compact ? ' is-compact' : ''}`} style={{ width: g.w, height: g.h, transform: `translate(-50%,-50%) scale(${g.scale})` }}>
        <div className="ri-bloom ri-bloom--228" style={{ left: g.orb.x - 114, top: g.orb.y - 114, opacity: lit ? 1 : 0.5 }} />
        {g.labels.map((l) => (
          <div key={l.t} className="ri-a3__label" style={{ left: l.x, top: l.y }}>
            {l.t}
          </div>
        ))}
        <svg className="absolute left-0 top-0" width={g.w} height={g.h} viewBox={`0 0 ${g.w} ${g.h}`} fill="none">
          {g.tiles.map((t, i) => {
            const dx = g.orb.x - t.ax
            const dy = g.orb.y - t.ay
            const len = Math.hypot(dx, dy)
            const ex = g.orb.x - (dx / len) * (g.orb.r + 2)
            const ey = g.orb.y - (dy / len) * (g.orb.r + 2)
            const l2 = len - g.orb.r - 2
            return (
              <g key={i}>
                <line x1={t.ax} y1={t.ay} x2={ex} y2={ey} stroke="rgba(255,255,255,.16)" strokeWidth="1" strokeDasharray="2 3" />
                <line
                  x1={t.ax}
                  y1={t.ay}
                  x2={ex}
                  y2={ey}
                  stroke="rgb(63,209,188)"
                  strokeOpacity=".8"
                  strokeWidth="1"
                  className="ri-lit"
                  style={{ strokeDasharray: l2, strokeDashoffset: lit ? 0 : l2, transitionDelay: lit ? `${(i % 4) * 0.08}s` : '0s' }}
                />
              </g>
            )
          })}
        </svg>
        {g.tiles.map((t, i) => (
          <div
            key={names[i][0]}
            className={`ri-tile ri-tile--a3${connected ? ' is-read' : ''}${compact ? ' ri-tile--v' : ''}`}
            style={{ left: t.x, top: t.y, width: t.w, height: t.h }}
          >
            <span className="ri-tile__icon ri-tile__icon--23">
              <DocGlyph kind={names[i][2]} size={13} />
            </span>
            <span className="ri-tile__text">
              <span className="ri-tile__name">{names[i][0]}</span>
              {!compact && <span className="ri-tile__type">{names[i][1]}</span>}
            </span>
            <span className="ri-tile__check" style={{ opacity: connected ? 1 : 0, transform: connected ? 'scale(1)' : 'scale(.6)', transitionDelay: s === 'connect' ? `${0.2 + i * 0.4}s` : '0s' }}>
              <Check size={13} />
            </span>
          </div>
        ))}
        <div className="ri-sweep-ring ri-sweep-ring--a3" style={{ left: g.orb.x - g.orb.r - 4, top: g.orb.y - g.orb.r - 4, width: g.orb.r * 2 + 8, height: g.orb.r * 2 + 8, opacity: s === 'read' ? 1 : 0 }}>
          <i />
        </div>
        <div className="absolute" style={{ left: g.orb.x - g.orb.r, top: g.orb.y - g.orb.r }}>
          <Orb size={g.orb.r * 2} silk="/assets/pages/realestate-intelligence/WaXGrKsucEq11Bllm3bTIjrtr3s.png" />
        </div>
        <div className="ri-a3__ri" style={{ left: g.ri.x, top: g.ri.y, transform: g.ri.center ? 'translate(-50%,-50%)' : 'translateY(-50%)' }}>
          RI
        </div>
        <div className="ri-beam" style={{ left: g.beam.x, top: g.beam.y, height: g.beam.h, transform: answered ? 'scaleY(1)' : 'scaleY(0)' }}>
          {answered && <i className="ri-beam__spark" />}
        </div>
        <div className="ri-a3__answer" style={{ left: g.answer.x, top: g.answer.y, width: g.answer.w, opacity: answered ? 1 : 0, transform: answered ? 'none' : 'translateY(6px)' }}>
          <div className="ri-a3__answer-body">
            <div className="ri-a3__answer-text">Break option on 4.02: 30 Jun 2027, 6 months&apos; notice.</div>
            <span className={`ri-src ri-src--cite${traced ? ' is-pressed' : ''}`}>
              <span className="ri-src__icon">
                <DocGlyph size={10} />
              </span>
              Lease 4.02 · §4.3
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M3 7l4-4M4 3h3v3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
        <div className="ri-a3__clause" style={{ left: g.clause.x, top: g.clause.y, width: g.clause.w, opacity: traced ? 1 : 0, transform: traced ? 'scale(1)' : 'scale(.96)' }}>
          <div className="ri-clause__src">Lease 4.02 · §4.3 Break option</div>
          <div className="ri-clause__hl">The Tenant may terminate this lease as of 30 June 2027 on 6 months&apos; notice.</div>
        </div>
      </div>
    </div>
  )
}

export default function Sources({ variant, sources }) {
  return (
    <div className={`pp-src pp-src--${variant}`}>
      <div className="pp-src__inner">
        <div className="pp-src__left">
          <div className="flex flex-col gap-4">
            <Eyebrow>Sources</Eyebrow>
            <h2 className="t-h2 m-0">{sources.h2}</h2>
            <p className="t-lead m-0">{sources.p}</p>
          </div>
          <div style={{ height: sources.spacer, flex: 'none' }} />
          <div className="flex flex-col gap-6">
            {sources.items.map((it) => (
              <div key={it.title} className="flex flex-col gap-1.5">
                <span className="pp-src__icon" style={{ WebkitMaskImage: `url(${it.mask})`, maskImage: `url(${it.mask})` }} />
                <div className="text-[16px] font-medium leading-6 tracking-[-0.16px] text-ink-2">{it.title}</div>
                <div className="t-lead">{it.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="pp-src__right">
          {variant === 'ri' ? (
            <div className="ri-a3-panel">
              <RiSourcesLoop />
            </div>
          ) : (
            <LottieLoop src={sources.lottie} />
          )}
        </div>
      </div>
    </div>
  )
}
