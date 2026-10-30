import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Eyebrow from '../../components/shared/Eyebrow'
import Button from '../../components/shared/Button'
import { CALENDLY } from './content'

// specs/product-pages.md §2d — "Built for every team." tabbed panel (Framer "XI/RI Solutions Tab").
// Tab pill: spring bounce .2 / .4s (approximated with an overshooting cubic-bezier). Panel swaps instantly.
// Dark card ticker: 3 marquee rows, 40.6 px/s, rows 1 + 3 move left, row 2 moves right.
const SPEED = 40.6
// Blank-pill widths per row (spec: row 1 [Q1, 82, 163, 301, 82]; row 2 [Q2, 156, 65, 301, 65]; row 3 [177, 301, 177, Q3]).
const ROWS = [
  { seq: ['q', 82, 163, 301, 82], q: 0, dir: 'left' },
  { seq: ['q', 156, 65, 301, 65], q: 1, dir: 'right' },
  { seq: [177, 301, 177, 'q'], q: 2, dir: 'left' },
]

function TickerRow({ row, quote }) {
  const track = useRef(null)
  const [dur, setDur] = useState(24)
  useLayoutEffect(() => {
    const el = track.current
    if (el) setDur(el.scrollWidth / 2 / SPEED)
  }, [quote])
  const copy = (k) =>
    row.seq.map((w, i) =>
      w === 'q' ? (
        <span key={`${k}${i}`} className="pp-tick__quote">
          {quote}
        </span>
      ) : (
        <span key={`${k}${i}`} className="pp-tick__blank" style={{ width: w }} />
      ),
    )
  return (
    <div className="pp-tick__row">
      <div ref={track} className={`pp-tick__track pp-tick__track--${row.dir}`} style={{ animationDuration: `${dur}s` }}>
        {copy('a')}
        {copy('b')}
      </div>
    </div>
  )
}

export default function SolutionsTabs({ tabs }) {
  const [active, setActive] = useState(0)
  const btns = useRef([])
  const [pill, setPill] = useState(null)
  useLayoutEffect(() => {
    const b = btns.current[active]
    if (b) setPill({ left: b.offsetLeft, width: b.offsetWidth })
  }, [active])
  useEffect(() => {
    const on = () => {
      const b = btns.current[active]
      if (b) setPill({ left: b.offsetLeft, width: b.offsetWidth })
    }
    document.fonts?.ready.then(on)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [active])
  const t = tabs[active]
  return (
    <div className="pp-sol">
      <div className="pp-sol__content">
        <div className="pp-sol__head">
          <div className="pp-sol__stack">
            <Eyebrow>Solutions</Eyebrow>
            <h2 className="t-h2 m-0">Built for every team.</h2>
          </div>
          <div className="pp-tabs" role="tablist">
            {pill && <span className="pp-tabs__pill" style={{ left: pill.left, width: pill.width }} aria-hidden="true" />}
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                ref={(el) => {
                  btns.current[i] = el
                }}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`pp-tab${i === active ? ' is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="pp-sol__panel" role="tabpanel">
          <div className="pp-sol__img">
            <img src={t.img} alt="" className="pp-sol__photo" />
            <div className="pp-sol__shade" />
            <div className="pp-sol__copy">
              <h3 className="pp-sol__h3 font-headline">{t.label}</h3>
              <p className="pp-sol__p">{t.p}</p>
              <div>
                <Button variant="glass" href={CALENDLY} target="_blank" rel="noopener">
                  Book a call
                </Button>
              </div>
            </div>
          </div>
          <div className="pp-sol__dark">
            <div className="pp-tick" aria-hidden="true">
              {ROWS.map((row, i) => (
                <TickerRow key={`${active}-${i}`} row={row} quote={t.quotes[row.q]} />
              ))}
            </div>
            <div className="pp-sol__back">
              <div className="pp-sol__backrow">
                <h5 className="pp-sol__h3 font-headline">What you get</h5>
                <p className="pp-sol__tag">{t.tagline}</p>
              </div>
              <p className="pp-sol__p">{t.back}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
