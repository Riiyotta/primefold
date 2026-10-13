import { useEffect, useMemo, useState } from 'react'
import { useBreakpoint, prefersReducedMotion } from './motion'
import './a1.css'

const I = (f) => `/assets/svg/${f}`

const SOURCES = [
  { label: 'Surveys', icon: I('svg-icon-cbf5321e.svg') },
  { label: 'Reviews', icon: I('svg-icon-a3b0df29.svg') },
  { label: 'Email', icon: I('svg-icon-c34a19d3.svg') },
  { label: 'Tickets', icon: I('svg-icon-85f9694b.svg') },
  { label: 'Contracts', icon: I('svg-icon-dbad77b2.svg') },
  { label: 'Spreadsheets', icon: I('svg-icon-12c754b4.svg') },
]
// Read order inferred from Appendix A (04 Understand sample) + reference frames:
// 1 first, 2 & 5 next, then 4, 6, 3 (Email) last. Seconds after "Understand" starts.
const READ_DELAY = [0.1, 0.5, 2.0, 1.0, 0.4, 1.5]
const DRAW = 0.7 // branch draw duration (s)
const QUESTION = 'Why are customers cancelling, and what do we fix first?'

// Timeline from source (ms each state holds before advancing)
const PHASES = [
  ['rest', 1000],
  ['ask', 2600],
  ['sent', 400],
  ['understand', 3800],
  ['act', 7200],
  ['press', 250],
  ['trace', 5500],
  ['fade', 600],
  ['reset', 150],
]

// Branch geometry relative to the card (desktop = Appendix A; tablet = measured from reference/frames-810)
const GEO = {
  desktop: { x0: 228, y0: 100, pitch: 64, corner: [296, 284, 272, 272, 284, 296], x1: 393, y1: [200, 224, 248, 272, 296, 320] },
  tablet: { x0: 184, y0: 115, pitch: 54, corner: [214, 206, 198, 198, 206, 214], x1: 232, y1: [214, 228, 242, 256, 270, 284] },
}

function branchPath(g, i) {
  const y0 = g.y0 + g.pitch * i
  const y1 = g.y1[i]
  const xc = g.corner[i]
  const dy = y1 - y0
  const s = Math.sign(dy) || 1
  const r = Math.min(10, Math.abs(dy) / 2, (xc - g.x0) / 2)
  return `M ${g.x0} ${y0} H ${xc - r} Q ${xc} ${y0} ${xc} ${y0 + s * r} V ${y1 - s * r} Q ${xc} ${y1} ${xc + r} ${y1} H ${g.x1}`
}

const Words = ({ text, start }) =>
  text.split(' ').map((w, i) => (
    <span key={i} style={{ '--wd': `${start + i * 0.05}s` }}>
      {w}{' '}
    </span>
  ))

export default function A1Loop() {
  const bp = useBreakpoint()
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setPhase(6) // static "Trace" frame — full story visible
      return
    }
    let idx = 0
    let t
    const tick = () => {
      let hold = PHASES[idx][1]
      if (PHASES[idx][0] === 'act' && window.matchMedia('(max-width: 809.98px)').matches) hold = 7300
      t = setTimeout(() => {
        idx = (idx + 1) % PHASES.length
        setPhase(idx)
        tick()
      }, hold)
    }
    setPhase(0)
    tick()
    return () => clearTimeout(t)
  }, [])

  const flags = [
    phase === 0 && 'f-rest',
    phase >= 1 && phase <= 6 && 'f-ask',
    phase >= 2 && phase <= 6 && 'f-sent',
    phase >= 3 && phase <= 6 && 'f-und',
    phase >= 4 && phase <= 6 && 'f-act',
    phase === 5 && 'f-press',
    phase === 6 && 'f-trace',
    phase === 7 && 'f-fade',
    phase === 8 && 'f-reset',
  ]
    .filter(Boolean)
    .join(' ')

  const g = GEO[bp]
  const paths = useMemo(() => (g ? SOURCES.map((_, i) => branchPath(g, i)) : []), [g])

  return (
    <div className={`a1 a1--${bp} ${flags}`} data-phase={PHASES[phase][0]} aria-hidden="true">
      {/* Stage */}
      <img className="a1-stage" src="/assets/6SGxSZ97zxsJhQI7QRmEcVF3QE.jpg" alt="" />
      <div className="a1-veil" />

      {/* Sources */}
      <div className="a1-sources">
        {SOURCES.map((s, i) => (
          <div key={s.label} className={`a1-src a1-src--${i}`} style={{ '--d': `${READ_DELAY[i] + DRAW}s` }}>
            <span className="a1-src__icon">
              <img src={s.icon} alt="" />
            </span>
            <span className="a1-src__label">{s.label}</span>
            <span className="a1-src__read">
              <img src={I('svg-read-c782774b.svg')} alt="" />
            </span>
            {bp === 'phone' && (
              <span className="a1-drop" style={{ '--d': `${READ_DELAY[i]}s` }}>
                <i className="a1-drop__base" />
                <i className="a1-drop__line" />
                <i className="a1-dot" />
                {i === 4 && <i className="a1-dot a1-dot--back" />}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Branches (desktop / tablet) */}
      {g && (
        <>
          <svg className="a1-branches" width={g.x1 + 1} height="520" viewBox={`0 0 ${g.x1 + 1} 520`} fill="none">
            {paths.map((d, i) => (
              <path key={`b${i}`} d={d} className="a1-branch__base" />
            ))}
            {paths.map((d, i) => (
              <path key={`l${i}`} d={d} className="a1-branch__line" style={{ '--d': `${READ_DELAY[i]}s` }} />
            ))}
          </svg>
          {paths.map((d, i) => (
            <i key={`d${i}`} className="a1-dot a1-dot--path" style={{ offsetPath: `path('${d}')`, '--d': `${READ_DELAY[i]}s` }} />
          ))}
          <i className="a1-dot a1-dot--path a1-dot--back" style={{ offsetPath: `path('${paths[4]}')` }} />
        </>
      )}

      {/* Primefold window */}
      <div className="a1-win">
        <div className="a1-sweep">
          <i />
        </div>
        <div className="a1-win__body">
          <img className="a1-win__logo" src={I('logo-white.svg')} alt="Primefold" />
          <div className="a1-q">
            <div className="a1-q__bubble">{QUESTION}</div>
          </div>
          <div className="a1-work">
            <div className="a1-status">
              <span className="is-working">Working…</span>
              <span className="is-done">Worked for 4s</span>
            </div>
            <div className="a1-steps">
              <div className="a1-step a1-step--1">
                <img src={I('svg-step-row1-84b4a926.svg')} alt="" />
                <span>Reading 6 sources</span>
                <img className="a1-step__chev" src={I('svg-step-row1-f041a0c0.svg')} alt="" />
              </div>
              <div className="a1-step a1-step--2">
                <img src={I('svg-step-row2-ac265ccf.svg')} alt="" />
                <span>Analyzed 212 responses</span>
                <img className="a1-step__chev" src={I('svg-step-row1-f041a0c0.svg')} alt="" />
              </div>
              <div className="a1-step a1-step--finding">Onboarding is the top complaint, and support replies run late.</div>
              <div className="a1-step a1-step--3">
                <img src={I('svg-icon-dbad77b2.svg')} alt="" />
                <span>Checked service agreement</span>
                <img className="a1-step__chev" src={I('svg-step-row1-f041a0c0.svg')} alt="" />
              </div>
              <div className="a1-step a1-step--4">
                <img src={I('svg-step-row4-1163a9a4.svg')} alt="" />
                <span>Creating 1 chart</span>
                <img className="a1-step__chev" src={I('svg-step-row1-f041a0c0.svg')} alt="" />
              </div>
            </div>
          </div>
          <div className="a1-composer">
            <div className="a1-composer__input">
              <div className="a1-ph">Ask about your data, or describe what you want to achieve…</div>
              <div className="a1-typed">
                {QUESTION.split(' ').map((w, i) => (
                  <span key={i} style={{ '--wd': `${i * 0.05}s` }}>
                    {w}
                  </span>
                )).reduce((acc, el, i) => (i ? [...acc, ' ', el] : [el]), [])}
              </div>
            </div>
            <div className="a1-composer__actions">
              <span className="a1-attach">
                <img src={I('svg-attach-77118d4b.svg')} alt="" />
              </span>
              <span className="a1-send">
                <img src={I('svg-send-caf8f50f.svg')} alt="" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Out connector */}
      <div className="a1-out">
        <i className="a1-out__line" />
        <i className="a1-dot a1-dot--out" />
      </div>

      {/* Answer */}
      <div className="a1-ans">
        <div className="a1-sweep a1-sweep--ans">
          <i />
        </div>
        <div className="a1-ans__body">
          <div className="a1-ans__head a1-words">
            <Words text="Slow onboarding drives 41% of cancellations." start={3.0} />
          </div>
          <div className="a1-result">
            <div className="a1-result__title">Why customers cancel</div>
            {[
              ['Slow onboarding', '41%', 0.823],
              ['Unanswered tickets', '22%', 0.438],
              ['Pricing', '14%', 0.277],
            ].map(([l, v, w], i) => (
              <div key={l} className="a1-bar">
                <span className="a1-bar__label">{l}</span>
                <span className="a1-bar__value">{v}</span>
                <span className="a1-bar__track">
                  <i style={{ '--w': w, '--d': `${3.6 + i * 0.1}s` }} />
                </span>
              </div>
            ))}
            <div className="a1-cmp">
              <span className="a1-cmp__label">First reply time</span>
              <span className="a1-cmp__value">
                <h6>3.2 days</h6>
                <span>vs. 24 h in agreement</span>
              </span>
            </div>
            <div className="a1-clause">
              <div className="a1-clause__file">Service agreement.pdf · p.4</div>
              <div className="a1-clause__hl">§4.2 Response times: first reply to a customer ticket within 24 hours of receipt.</div>
            </div>
          </div>
          <div className="a1-chips">
            <span className="a1-chip">
              <span className="a1-chip__icon">
                <img src={I('svg-icon-cbf5321e.svg')} alt="" />
              </span>
              Survey Q3
            </span>
            <span className="a1-chip a1-chip--clause">
              <span className="a1-chip__icon">
                <img src={I('svg-icon-dbad77b2.svg')} alt="" />
              </span>
              Service agreement §4.2
            </span>
            <span className="a1-chip">
              <span className="a1-chip__icon">
                <img src={I('svg-icon-12c754b4.svg')} alt="" />
              </span>
              Ticket log
            </span>
          </div>
          <div className="a1-next">
            <img src={I('svg-next-step-292db26a.svg')} alt="" />
            Draft onboarding fix plan
          </div>
          <div className="a1-think">
            <div className="a1-bloom">
              <div className="a1-orb">
                <img className="a1-orb__silk" src="/assets/KjnavIi882AxaQJ0giG8NHlLX58.png" alt="" />
                <i className="a1-orb__rim" />
                <i className="a1-orb__gloss" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
