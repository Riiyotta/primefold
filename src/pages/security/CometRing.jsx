// §2.1 comet ring: static 1px track + 13 dash copies (pathLength 100, dasharray 1.7286/98.2714).
// The head's dashoffset decreases at 25 units/s (one lap = 4s linear, infinite). Implemented as one shared
// keyframe (100 → 0) per copy, phase-shifted with a negative animation-delay so copy i sits at head + i·1.42857.
const OPACITIES = [1, 0.888, 0.781, 0.68, 0.584, 0.493, 0.408, 0.33, 0.258, 0.193, 0.135, 0.085, 0.044]
const STEP = 1.42857
const DASH = '1.7285714285714286 98.27142857142857'
const LAP = 4 // s

export const cometCss = `
@keyframes pf-comet { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
.pf-comet { animation: pf-comet ${LAP}s linear infinite; }
`

// Rounded-rect path exactly as the live snapshots (hero-comet-ring-{0,1,2}.svg)
const pathFor = (w, h) => {
  const r = w / 2 - 0.5
  const c = w / 2
  return `M ${c} 0.5 H ${c} A ${r} ${r} 0 0 1 ${w - 0.5} ${c} V ${h - c} A ${r} ${r} 0 0 1 ${c} ${h - 0.5} H ${c} A ${r} ${r} 0 0 1 0.5 ${h - c} V ${c} A ${r} ${r} 0 0 1 ${c} 0.5 Z`
}

export default function CometRing({ w, h, color, head }) {
  const d = pathFor(w, h)
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="block h-full w-full overflow-visible" aria-hidden="true">
      <path d={d} stroke="rgba(255,255,255,.12)" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" fill="none" />
      {OPACITIES.map((op, i) => {
        const offset = head + i * STEP
        const delay = -((((100 - offset) % 100) + 100) % 100) / 25
        return (
          <path
            key={i}
            className="pf-comet"
            d={d}
            pathLength="100"
            stroke={color}
            strokeWidth="1"
            strokeLinejoin="round"
            strokeLinecap={i === 0 ? 'round' : 'butt'}
            strokeDasharray={DASH}
            fill="none"
            opacity={op}
            style={{ animationDelay: `${delay}s` }}
          />
        )
      })}
    </svg>
  )
}
