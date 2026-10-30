import { Fragment, useEffect, useState } from 'react'

// In-view boolean that re-triggers every time (IntersectionObserver threshold).
export function useInView(ref, threshold = 0.5) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold])
  return inView
}

// Per-character appear: blur(3px), opacity .001, y 3 → none; spring bounce 0 / .4s, stagger .025s per char.
export function BlurChars({ text, play }) {
  let n = 0
  const words = text.split(' ')
  return words.map((word, wi) => (
    <Fragment key={wi}>
      <span className="pp-word">
        {word.split('').map((ch) => {
          const i = n++
          return (
            <span key={i} className={`pp-char${play ? ' is-in' : ''}`} style={{ transitionDelay: play ? `${i * 0.025}s` : '0s' }}>
              {ch}
            </span>
          )
        })}
      </span>
      {wi < words.length - 1 && (n++, ' ')}
    </Fragment>
  ))
}

// Primefold mark (400x400 path from the captured hero source).
export function PrimefoldMark({ size = 50, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" fill="none" aria-hidden="true" style={{ display: 'block' }}>
      <path d="M7.44873 262.522C22.0154 168.039 148.271 127.022 192.421 184.411C242.31 249.255 174.999 348.228 253.504 392.572C237.447 397.07 220.896 399.565 204.227 400C173.482 380.594 162.899 340.528 165.621 295.917C169.549 231.555 150.538 213.594 137.499 209.372C119.132 203.417 62.1543 204.472 22.0154 295.917C16.1451 285.256 11.2689 274.077 7.44873 262.522Z" fill={color} />
      <path d="M63.5 348.222C41.2167 328.134 100 231.256 116.967 263.822C132.561 293.778 96.8778 348.234 127.467 387.172C103.902 378.301 82.209 365.092 63.5111 348.228L63.5 348.222ZM30.1444 90.6946C77.3333 55.8891 169.867 54.6113 211.294 68.7724C302.661 100 312.278 187.5 318.222 249.256C322.489 293.517 343.1 309.978 363.094 315.489C351.248 332.106 336.948 346.829 320.683 359.156C219.961 327.184 303.122 215.628 214.433 134.406C161.261 85.7057 43.9055 107.128 0 168.039C4.47307 140.418 14.7467 114.058 30.1444 90.6946Z" fill={color} />
      <path d="M198.716 0.000334738C309.883 0.000334738 400.005 89.5559 400.005 200.039C400.013 217.165 397.811 234.221 393.455 250.784C353.133 240.628 381.255 200.039 340.25 118.767C299.239 37.5003 212.272 -11.4274 86.9941 33.617C120.098 11.6251 158.973 -0.0721384 198.716 0.000334738Z" fill={color} />
    </svg>
  )
}

// A1-loop Orb primitive (copied from src/components/how/A1Loop — Silk fallback PNG + Rim + Gloss), pulse 1→1.06 mirror 1.2s.
export function Orb({ size = 40, silk = '/assets/pages/realestate-intelligence/IOC8KC5jHMKOyyOmPw4p500iQ0.png', className = '', children }) {
  return (
    <div className={`pp-orb ${className}`} style={{ width: size, height: size }}>
      <img className="pp-orb__silk" src={silk} alt="" />
      <i className="pp-orb__rim" />
      <i className="pp-orb__gloss" style={{ width: size * 0.41, height: size * 0.2, top: size * 0.09 }} />
      {children}
    </div>
  )
}

// Small line icons used in RI tiles (glyphs not in spec — drawn to match frames).
export function DocGlyph({ kind = 'doc', size = 13 }) {
  const p = { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', stroke: 'rgb(203,199,192)', strokeWidth: 1.2, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (kind) {
    case 'table':
      return (
        <svg {...p}>
          <rect x="2" y="3" width="12" height="10" rx="1.5" />
          <path d="M2 6.5h12M2 9.8h12M6 6.5V13" />
        </svg>
      )
    case 'tools':
      return (
        <svg {...p}>
          <path d="M9.5 2.5l4 4-2 2-4-4zM7.5 4.5L2.5 9.5l2 2 5-5M3.5 12.5l-1 1" />
        </svg>
      )
    case 'chart':
      return (
        <svg {...p}>
          <path d="M2.5 13.5h11M3.5 11l3-3.5 2.5 2 4-5" />
        </svg>
      )
    case 'building':
      return (
        <svg {...p}>
          <path d="M2.5 13.5h11M4 13.5V4l5-1.5v11M9 6.5h3.5v7M6 6h1M6 8.5h1M6 11h1" />
        </svg>
      )
    case 'folder':
      return (
        <svg {...p}>
          <path d="M2 4.5c0-.6.4-1 1-1h3l1.5 1.5H13c.6 0 1 .4 1 1V12c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1z" />
          <circle cx="10" cy="9.5" r="1.5" />
        </svg>
      )
    case 'drive':
      return (
        <svg {...p}>
          <rect x="2.5" y="3" width="11" height="4.5" rx="1.2" />
          <rect x="2.5" y="8.5" width="11" height="4.5" rx="1.2" />
          <path d="M5 5.25h1M5 10.75h1" />
        </svg>
      )
    case 'inbox':
      return (
        <svg {...p}>
          <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" />
          <path d="M2.5 9.5h3l1 1.5h3l1-1.5h3" />
        </svg>
      )
    default:
      return (
        <svg {...p}>
          <path d="M4 2h5l3 3v8.5c0 .3-.2.5-.5.5h-7c-.3 0-.5-.2-.5-.5v-11c0-.3.2-.5.5-.5zM9 2v3h3M6 8.5h4M6 11h4" />
        </svg>
      )
  }
}

export function Check({ size = 14 }) {
  return (
    <span className="pp-check" style={{ width: size, height: size }}>
      <svg width={size * 0.64} height={size * 0.64} viewBox="0 0 10 10" fill="none">
        <path d="M2 5.2l2 2 4-4.4" stroke="rgb(11,11,12)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}
