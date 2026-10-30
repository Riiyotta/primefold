import Eyebrow from '../../components/shared/Eyebrow'

// specs/product-pages.md §2e The loop (features.loop-cards) — 4 small cards, no hover or appear motion.
export default function LoopCards({ loop }) {
  return (
    <div className="pp-loop">
      <div className="pp-loop__title">
        <div className="pp-loop__stack">
          <Eyebrow>The loop</Eyebrow>
          <h2 className="t-h2 m-0">{loop.h2}</h2>
        </div>
        <p className="pp-loop__p">{loop.p}</p>
      </div>
      <div className="pp-loop__grid">
        {loop.cards.map((c) => (
          <div key={c.h3} className="pp-loop__card">
            <div className="flex flex-col gap-4">
              <img src={c.icon} alt="" width="24" height="24" className="h-6 w-6" />
              <h3 className="m-0 text-[16px] font-medium leading-6 tracking-[-0.16px] text-ink-2">{c.h3}</h3>
            </div>
            <p className="t-lead m-0">{c.p}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
