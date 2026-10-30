import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

// specs/product-pages.md §1.2 — "Live Conversation" hero chat, ported from the captured source (`He`).
// Props on page: charsPerTick 3, holdSeconds 3.8, autoAdvance true, layoutMode auto (compact < 480px wide).
const INK = '#1A1814'
const PANEL = '#282622'
const BORDER = 'rgba(255, 255, 255, 0.12)'
const WIN_SHADOW = '0px 2px 2px 0px rgba(0,0,0,0.12), 0px 0px 0px 2px rgba(0,0,0,0.24), 0px 0px 0px 1px rgba(255,255,255,0.18)'
const BODY_SHADOW = '0px 1px 2px 0px rgba(36,36,36,0.04), 0px 0px 0px 1px rgba(0,0,0,0.08)'
const CHIP_SHADOW = '0px 1px 1px 0px rgba(38,57,91,0.1), 0px 0px 0px 1px rgba(38,57,91,0.16)'
const FONT = '"Inter", "Inter Placeholder", system-ui, sans-serif'
const FEATURES = '"cv09" 1, "ss11" 1, "calt" 0, "liga" 0'
const AVATAR = '/assets/pages/experience-intelligence/avatar-default-72.png'

const DOC = 'M3 1.5C3 1.22 3.22 1 3.5 1H9.5L13 4.5V14.5C13 14.78 12.78 15 12.5 15H3.5C3.22 15 3 14.78 3 14.5V1.5Z'
const FOLD = 'M9.5 1L13 4.5H9.5V1Z'
const svgStyle = { display: 'block', flexShrink: 0 }

function ChipIcon({ name }) {
  const s = { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', style: svgStyle }
  switch (name) {
    case 'zendesk':
      return (
        <svg {...s}>
          <path d="M8.60933 1.93599V10.86L16 1.93666L8.60933 1.93599ZM0 1.93733C0 3.97733 1.65533 5.63333 3.69533 5.63333C5.73533 5.63333 7.39 3.97733 7.39067 1.93733H0ZM7.39067 5.14199L0 14.064H7.39067V5.14199ZM8.60933 14.064H16C16 12.024 14.3467 10.3687 12.3047 10.3687C10.2647 10.3687 8.60933 12.024 8.60933 14.064Z" fill="#2E9BA6" />
        </svg>
      )
    case 'trustpilot':
      return (
        <svg {...s} viewBox="0 0 16 15.33">
          <path d="M16 5.85766H9.88727L8.00557 0L6.11274 5.85766L0 5.84644L4.94363 9.47101L3.0508 15.3287L7.99443 11.7041L12.9381 15.3287L11.0564 9.47101L16 5.85766Z" fill="#00B67A" />
          <path d="M11.4795 10.7951L11.0564 9.47099L8.00557 11.7041L11.4795 10.7951Z" fill="#005128" />
        </svg>
      )
    case 'sheets':
      return (
        <svg {...s}>
          <path d={DOC} fill="#23A566" />
          <path d={FOLD} fill="#1C8F5A" />
          <path d="M5 8H11V12.5H5V8ZM5.9 8.9V9.8H7.55V8.9H5.9ZM8.45 8.9V9.8H10.1V8.9H8.45ZM5.9 10.7V11.6H7.55V10.7H5.9ZM8.45 10.7V11.6H10.1V10.7H8.45Z" fill="#fff" />
        </svg>
      )
    case 'excel':
      return (
        <svg {...s}>
          <path d={DOC} fill="#1D6F42" />
          <path d={FOLD} fill="#175934" />
          <path d="M5.4 7.5H6.8L8 9.4L9.2 7.5H10.6L8.7 10.25L10.7 13H9.3L8 11.05L6.7 13H5.3L7.3 10.25L5.4 7.5Z" fill="#fff" />
        </svg>
      )
    case 'word':
      return (
        <svg {...s}>
          <path d={DOC} fill="#2B7CD3" />
          <path d={FOLD} fill="#2367B0" />
          <path d="M4.7 7.5H5.75L6.45 11L7.45 7.5H8.55L9.55 11L10.25 7.5H11.3L10.2 13H9.05L8 9.6L6.95 13H5.8L4.7 7.5Z" fill="#fff" />
        </svg>
      )
    case 'pdf':
      return (
        <svg {...s}>
          <path d={DOC} fill="#E5252A" />
          <path d={FOLD} fill="#C11E22" />
          <path d="M4.6 12.6V8.4H6.1C6.98 8.4 7.6 8.95 7.6 9.8C7.6 10.65 6.98 11.2 6.1 11.2H5.55V12.6H4.6ZM5.55 10.4H6.02C6.4 10.4 6.63 10.17 6.63 9.8C6.63 9.43 6.4 9.2 6.02 9.2H5.55V10.4ZM8.1 12.6V8.4H9.55C10.75 8.4 11.5 9.2 11.5 10.5C11.5 11.8 10.75 12.6 9.55 12.6H8.1ZM9.05 11.76H9.5C10.14 11.76 10.53 11.28 10.53 10.5C10.53 9.72 10.14 9.24 9.5 9.24H9.05V11.76Z" fill="#fff" />
        </svg>
      )
    case 'chart':
      return (
        <svg {...s}>
          <rect x="2.5" y="8.5" width="3" height="5.5" rx="0.8" fill="#fff" fillOpacity="0.85" />
          <rect x="6.5" y="5" width="3" height="9" rx="0.8" fill="#fff" fillOpacity="0.85" />
          <rect x="10.5" y="2" width="3" height="12" rx="0.8" fill="#fff" fillOpacity="0.85" />
        </svg>
      )
    case 'cloud':
      return (
        <svg {...s}>
          <path d="M12.1 12H4.6C3.1 12 1.9 10.85 1.9 9.4C1.9 8.1 2.85 7.05 4.1 6.85C4.45 5.2 5.95 4 7.7 4C9.2 4 10.5 4.9 11.05 6.2C12.7 6.3 14.1 7.6 14.1 9.15C14.1 10.7 13.2 12 12.1 12Z" fill="#7EB9E8" />
        </svg>
      )
    case 'phone':
      return (
        <svg {...s}>
          <path d="M5.1 2.2L6.6 3.7C6.95 4.05 7 4.6 6.7 5L5.9 6.05C6.5 7.35 8.65 9.5 9.95 10.1L11 9.3C11.4 9 11.95 9.05 12.3 9.4L13.8 10.9C14.2 11.3 14.2 11.95 13.8 12.35L12.9 13.25C12.4 13.75 11.65 13.95 10.95 13.7C7.6 12.5 3.5 8.4 2.3 5.05C2.05 4.35 2.25 3.6 2.75 3.1L3.65 2.2C4.05 1.8 4.7 1.8 5.1 2.2Z" fill="#fff" fillOpacity="0.85" />
        </svg>
      )
    default:
      return (
        <svg {...s}>
          <path d={DOC} fill="#fff" fillOpacity="0.22" />
          <path d={FOLD} fill="#fff" fillOpacity="0.35" />
          <rect x="5" y="7" width="6" height="1" rx="0.5" fill="#fff" fillOpacity="0.9" />
          <rect x="5" y="9.2" width="6" height="1" rx="0.5" fill="#fff" fillOpacity="0.9" />
          <rect x="5" y="11.4" width="4" height="1" rx="0.5" fill="#fff" fillOpacity="0.9" />
        </svg>
      )
  }
}

function Star({ color, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
      <path
        d="M21.9647 10.7672L17.7459 14.4075L19.0312 19.8516C19.1022 20.1471 19.0839 20.457 18.9788 20.7422C18.8736 21.0273 18.6863 21.2749 18.4406 21.4537C18.1948 21.6325 17.9015 21.7344 17.5979 21.7466C17.2942 21.7589 16.9937 21.681 16.7344 21.5222L11.9906 18.5926L7.25628 21.5222C7.00353 21.6798 6.70341 21.7571 6.40025 21.7445C6.0971 21.7318 5.80446 21.6298 5.55919 21.4512C5.31392 21.2726 5.12698 21.0254 5.02191 20.7407C4.91684 20.4561 4.89835 20.1467 4.96875 19.8516L6.25875 14.4075L2.04 10.7672C1.81059 10.5689 1.64468 10.3075 1.56298 10.0155C1.48129 9.72345 1.48743 9.41385 1.58064 9.12531C1.67385 8.83678 1.85 8.5821 2.08709 8.39308C2.32418 8.20407 2.6117 8.08908 2.91375 8.0625L8.445 7.61625L10.5787 2.4525C10.6942 2.17108 10.8908 1.93036 11.1435 1.76094C11.3961 1.59153 11.6935 1.50107 11.9977 1.50107C12.3019 1.50107 12.5992 1.59153 12.8518 1.76094C13.1045 1.93036 13.3011 2.17108 13.4166 2.4525L15.5494 7.61625L21.0806 8.0625C21.3833 8.0881 21.6716 8.20244 21.9096 8.39119C22.1475 8.57995 22.3245 8.83473 22.4183 9.12361C22.5121 9.4125 22.5185 9.72263 22.4368 10.0152C22.3552 10.3077 22.189 10.5696 21.9591 10.7681L21.9647 10.7672Z"
        fill={color}
      />
    </svg>
  )
}

const KEYFRAMES = `
@keyframes pfconv-in { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }
.pfconv-bar { scrollbar-width: none; -ms-overflow-style: none; overscroll-behavior-x: contain; }
.pfconv-bar::-webkit-scrollbar { display: none; }
`

export default function LiveConversation({ data, charsPerTick = 3, holdSeconds = 3.8, autoAdvance = true, style }) {
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [idx, setIdx] = useState(0)
  const [chars, setChars] = useState(0)
  const [width, setWidth] = useState(582)
  const [ghostH, setGhostH] = useState(0)
  const root = useRef(null)
  const bar = useRef(null)
  const fadeL = useRef(null)
  const fadeR = useRef(null)
  const pills = useRef([])
  const ghosts = useRef([])
  const holdTicks = useRef(0)
  const charsRef = useRef(0)

  const prompt = data.prompts[idx] ?? data.prompts[0]
  const done = reduce || chars >= prompt.answer.length
  const typed = reduce ? prompt.answer : prompt.answer.slice(0, chars)
  const compact = width < 480

  // edge fades
  const updateFades = useCallback(() => {
    const el = bar.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    if (fadeL.current) fadeL.current.style.opacity = el.scrollLeft > 4 ? '1' : '0'
    if (fadeR.current) fadeR.current.style.opacity = el.scrollLeft < max - 4 ? '1' : '0'
  }, [])
  useEffect(() => {
    const el = bar.current
    if (!el) return undefined
    updateFades()
    el.addEventListener('scroll', updateFades, { passive: true })
    const ro = new ResizeObserver(updateFades)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateFades)
      ro.disconnect()
    }
  }, [updateFades])

  // component width → compact layout
  useLayoutEffect(() => {
    const el = root.current
    if (!el) return undefined
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) if (e.contentRect.width > 0) setWidth(e.contentRect.width)
    })
    ro.observe(el)
    if (el.offsetWidth > 0) setWidth(el.offsetWidth)
    return () => ro.disconnect()
  }, [])

  // typing loop: 24ms ticks, charsPerTick chars, hold holdSeconds, then next prompt
  useEffect(() => {
    if (reduce) return undefined
    const holdMax = Math.max(1, Math.round((holdSeconds * 1000) / 24))
    const answer = data.prompts[idx]?.answer ?? ''
    const id = setInterval(() => {
      const n = charsRef.current
      if (n < answer.length) {
        holdTicks.current = 0
        charsRef.current = Math.min(answer.length, n + charsPerTick)
        setChars(charsRef.current)
      } else if (autoAdvance) {
        holdTicks.current += 1
        if (holdTicks.current > holdMax) {
          holdTicks.current = 0
          charsRef.current = 0
          setChars(0)
          setIdx((i) => (i + 1) % data.prompts.length)
        }
      }
    }, 24)
    return () => clearInterval(id)
  }, [reduce, data, idx, charsPerTick, holdSeconds, autoAdvance])

  // scroll the active pill to centre (clamped)
  useEffect(() => {
    const el = bar.current
    const pill = pills.current[idx]
    if (!el || !pill) return
    const left = pill.offsetLeft - (el.clientWidth - pill.offsetWidth) / 2
    const clamped = Math.min(Math.max(left, 0), Math.max(el.scrollWidth - el.clientWidth, 0))
    el.scrollTo({ left: clamped, behavior: reduce ? 'auto' : 'smooth' })
  }, [idx, reduce])

  const pick = useCallback((i) => {
    holdTicks.current = 0
    charsRef.current = 0
    setIdx(i)
    setChars(0)
  }, [])

  // body min-height = tallest ghost render
  const padX = compact ? 16 : 30
  const padY = compact ? 16 : 32
  useLayoutEffect(() => {
    // ghosts are invisible sizing boxes, so they are kept under reduced motion too (stable body height in both modes)
    const els = ghosts.current.filter(Boolean)
    if (!els.length) return undefined
    const measure = () => {
      let h = 0
      for (const g of els) h = Math.max(h, g.offsetHeight)
      setGhostH((prev) => (Math.abs(prev - h) > 0.5 ? h : prev))
    }
    measure()
    const ro = new ResizeObserver(measure)
    els.forEach((g) => ro.observe(g))
    return () => ro.disconnect()
  }, [compact, width])
  const minHeight = ghostH ? ghostH + padY * 2 : compact ? undefined : 308 + padY * 2

  const fs = compact ? 13 : 14
  const lh = compact ? '18px' : '20px'
  const textStyle = { fontSize: fs, lineHeight: lh, fontWeight: 500, letterSpacing: '-0.084px', color: '#fff' }

  const renderThread = (p, text, complete, key, animate) => (
    <>
      <div
        key={`ask-${key}`}
        style={{ display: 'flex', gap: compact ? 12 : 16, alignItems: 'center', justifyContent: 'flex-end', animation: animate ? 'pfconv-in .22s ease-out' : undefined }}
      >
        <div style={{ background: INK, border: `1px solid ${BORDER}`, borderRadius: '12px 4px 12px 12px', padding: '8px 12px', maxWidth: `calc(100% - ${compact ? 44 : 52}px)`, fontSize: fs, lineHeight: lh }}>
          <span style={textStyle}>{p.ask}</span>
        </div>
        <img src={AVATAR} alt="" width={compact ? 30 : 36} height={compact ? 30 : 36} style={{ width: compact ? 30 : 36, height: compact ? 30 : 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', gap: compact ? 12 : 16, alignItems: 'flex-start', width: '100%' }}>
          <span
            style={{ width: compact ? 28 : 32, height: compact ? 28 : 32, borderRadius: 6.4, background: data.accent, color: '#fff', fontSize: compact ? 17 : 19.4, fontWeight: 700, letterSpacing: '-0.213px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            {data.code}
          </span>
          <div style={{ flex: 1, minWidth: 0, background: PANEL, border: `1px solid ${BORDER}`, borderRadius: '4px 12px 12px 12px', padding: '8px 12px', minHeight: compact ? undefined : 76, fontSize: fs, lineHeight: lh }}>
            <span style={textStyle}>
              {text}
              {!complete && <span style={{ opacity: 0.7 }}>{'▌'}</span>}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: compact ? '100%' : 'calc(100% - 48px)', opacity: complete ? 1 : 0, transition: 'opacity .35s' }}>
          <div style={{ display: 'flex', flexDirection: compact ? 'column' : 'row', gap: compact ? 6 : 12 }}>
            {p.tiles.map((t, i) => (
              <div
                key={i}
                style={{ flex: compact ? undefined : 1, minWidth: 0, background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 12, padding: compact ? 12 : 16, display: 'flex', flexDirection: 'column', gap: compact ? 4 : 8, minHeight: compact ? undefined : 104 }}
              >
                <span style={{ fontSize: compact ? 20 : 24, lineHeight: compact ? '26px' : '32px', fontWeight: 500, letterSpacing: '-0.36px', color: '#fff', display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, maxWidth: '100%' }}>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{t.v}</span>
                  {t.star && <Star color={data.accent} size={compact ? 20 : 24} />}
                </span>
                <span style={{ fontSize: compact ? 11 : 12, lineHeight: compact ? '14px' : '16px', fontWeight: 400, color: '#fff', opacity: 0.5 }}>{t.l}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {p.chips.map((c, i) => (
              <div key={i} style={{ background: INK, border: `1px solid ${BORDER}`, borderRadius: 8, padding: compact ? '4px 8px 4px 6px' : '6px 10px 6px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ChipIcon name={c.icon} />
                <span style={{ fontSize: compact ? 11 : 12, lineHeight: '16px', fontWeight: 500, color: '#fff', whiteSpace: 'nowrap' }}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div
      ref={root}
      style={{ ...style, display: 'flex', flexDirection: 'column', padding: 2, borderRadius: 18, background: INK, boxShadow: WIN_SHADOW, overflow: 'hidden', fontFamily: FONT, fontFeatureSettings: FEATURES, WebkitFontSmoothing: 'antialiased' }}
    >
      <style>{KEYFRAMES}</style>
      <div style={{ height: compact ? 42 : 47, padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontSize: compact ? 15 : 16, lineHeight: '24px', fontWeight: 500, letterSpacing: '-0.176px', color: '#fff' }}>{data.title}</span>
        <span style={{ width: 20, height: 20, borderRadius: 4, background: data.accent, color: '#fff', fontSize: 12.1, fontWeight: 700, letterSpacing: '-0.133px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {data.code}
        </span>
      </div>
      <div style={{ background: PANEL, borderRadius: 16, boxShadow: BODY_SHADOW, padding: `${padY}px ${padX}px`, position: 'relative', minHeight }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 18 : 38 }}>{renderThread(prompt, typed, done, `${data.code}-${idx}`, !reduce)}</div>
        {data.prompts.map((p, i) => (
            <div
              key={`ghost-${data.code}-${i}`}
              aria-hidden="true"
              ref={(el) => {
                ghosts.current[i] = el
              }}
              style={{ position: 'absolute', top: padY, left: padX, right: padX, display: 'flex', flexDirection: 'column', gap: compact ? 18 : 38, visibility: 'hidden', pointerEvents: 'none' }}
            >
              {renderThread(p, p.answer, true, `g-${i}`, false)}
            </div>
        ))}
      </div>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div ref={bar} className="pfconv-bar" style={{ display: 'flex', gap: 8, alignItems: 'center', padding: compact ? '10px 12px' : '12px 16px', overflowX: 'auto' }}>
          {data.prompts.map((p, i) => {
            const active = i === idx
            return (
              <div
                key={i}
                ref={(el) => {
                  pills.current[i] = el
                }}
                onClick={() => pick(i)}
                style={{ padding: compact ? '6px 10px' : '8px 12px', borderRadius: 999, background: active ? '#fff' : 'rgba(255,255,255,0.12)', boxShadow: CHIP_SHADOW, color: active ? INK : '#fff', fontSize: compact ? 13 : 14, lineHeight: '20px', fontWeight: 500, letterSpacing: '-0.084px', whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0, transition: 'background .2s, color .2s' }}
              >
                {p.q}
              </div>
            )
          })}
          <div style={{ flex: '0 0 61px' }} />
        </div>
        <div ref={fadeL} style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 77, background: `linear-gradient(to right, ${INK}, rgba(26,24,20,0))`, pointerEvents: 'none', opacity: 0, transition: 'opacity .25s' }} />
        <div ref={fadeR} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 77, background: `linear-gradient(to left, ${INK}, rgba(26,24,20,0))`, pointerEvents: 'none', opacity: 1, transition: 'opacity .25s' }} />
      </div>
    </div>
  )
}
