import { useRef } from 'react'
import Eyebrow from '../../components/shared/Eyebrow'
import { XiAsk, XiUnderstand, XiAct } from './XiIllustrations'
import { RiAsk, RiUnderstand, RiAct, SCHEDULES, RI_STILLS, useLoopStates } from './RiIllustrations'

// specs/product-pages.md §2a "Ask. Understand. Act."
// The live H2 has a run of spaces before "in" (rendered with white-space: pre-wrap): it forces the
// 2-line break @1440 and leaves a visible gap after "strategy" @390. 15 spaces ≈ the 123px gap measured @390.
const H2_SPACES = ' '.repeat(15)
const RI_REDUCED = { ask: 'hold', understand: 'done', act: 'trace' }

function Text({ c }) {
  return (
    <div className="pp-card__text">
      <div className="text-[14px] font-medium leading-5 tracking-[-0.084px]" style={{ color: 'rgb(97,97,97)' }}>
        {c.label}
      </div>
      <h3 className="pp-card__h3 font-headline">{c.h3}</h3>
      <p className="m-0 text-[14px] leading-5 tracking-[-0.084px] text-grey-550">
        {Array.isArray(c.p) ? c.p.map((line, i) => (i ? [<br key={i} />, line] : line)) : c.p}
      </p>
    </div>
  )
}

function XiCards({ cards }) {
  const ills = [<XiAsk key="a" />, <XiUnderstand key="u" />, <XiAct key="x" />]
  return cards.map((c, i) => (
    <div key={c.label} className="pp-card">
      <div className="pp-card__ill">{ills[i]}</div>
      <Text c={c} />
    </div>
  ))
}

function RiCards({ cards }) {
  const ref = useRef(null)
  const s = useLoopStates(ref, SCHEDULES, RI_REDUCED)
  const ills = [<RiAsk key="a" state={s.ask} />, <RiUnderstand key="u" state={s.understand} />, <RiAct key="x" state={s.act} />]
  return (
    <>
      {cards.map((c, i) => (
        <div key={c.label} className="pp-card" ref={i === 0 ? ref : undefined}>
          <div className="pp-card__ill pp-card__ill--ri">
            <div className="ri-panel">
              <img className="ri-panel__still" src={RI_STILLS[i]} alt="" />
              {ills[i]}
            </div>
          </div>
          <Text c={c} />
        </div>
      ))}
    </>
  )
}

export default function StepCards({ variant, steps }) {
  return (
    <div className="pp-steps">
      <div className="pp-steps__title">
        <div className="pp-steps__stack">
          <Eyebrow>Ask. Understand. Act.</Eyebrow>
          <h2 className="t-h2 m-0 whitespace-pre-wrap">{`From question to strategy${H2_SPACES}${steps.h2end}`}</h2>
        </div>
      </div>
      <div className="pp-steps__grid">{variant === 'ri' ? <RiCards cards={steps.cards} /> : <XiCards cards={steps.cards} />}</div>
    </div>
  )
}
