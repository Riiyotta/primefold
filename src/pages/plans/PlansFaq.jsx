import { useState } from 'react'
import SectionTitle from '../shared-info/SectionTitle'
import { FAQ } from './data'

// §1.5 — items toggle independently; Framer tween 0.2s ease [0.44,0,0.56,1] on height, opacity and rotate.
const T = '.2s cubic-bezier(.44,0,.56,1)'
const BAR = 'absolute left-1/2 top-1/2 h-px w-[18px] rounded-[10px] bg-grey-550'

function Item({ q, a, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const toggle = () => setOpen((o) => !o)
  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle() }
      }}
      className="flex cursor-auto flex-col overflow-clip rounded-[12px] bg-white px-6 pt-[18px]"
      style={{ boxShadow: '0 0 0 1px rgba(0,0,0,.08)', paddingBottom: open ? 24 : 18, transition: `padding-bottom ${T}` }}
    >
      <div className="flex items-center gap-3 py-[6px]">
        <h3 className="font-headline m-0 min-w-0 flex-1 text-[20px] font-normal leading-7 text-ink-2">{q}</h3>
        <span className="relative size-6 shrink-0" aria-hidden="true">
          <span className={BAR} style={{ transform: 'translate(-50%,-50%)' }} />
          <span className={BAR} style={{ transform: `translate(-50%,-50%) rotate(${open ? 0 : 90}deg)`, transition: `transform ${T}` }} />
        </span>
      </div>
      <div
        className="grid"
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
          marginTop: open ? 6 : 0,
          opacity: open ? 1 : 0,
          transition: `grid-template-rows ${T}, margin-top ${T}, opacity ${T}`,
        }}
      >
        <div className="flex min-h-0 flex-col gap-5 overflow-hidden text-[14px] leading-5 tracking-[-0.084px] text-grey-550">
          {a.map((p, i) => <p key={i} className="m-0">{p}</p>)}
        </div>
      </div>
    </div>
  )
}

export default function PlansFaq() {
  return (
    <section className="flex flex-col gap-8 bg-page-alt pb-[88px] md:gap-14">
      <SectionTitle eyebrow="Questions" title="Before you pick a plan." lead="Something not answered here? Write to us. A real person replies." />
      <div className="mx-auto box-border flex w-full max-w-container flex-col gap-3 px-5">
        {FAQ.map((f, i) => <Item key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />)}
      </div>
    </section>
  )
}
