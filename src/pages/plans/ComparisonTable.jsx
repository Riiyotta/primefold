import Button from '../../components/shared/Button'
import ProductBadge from './ProductBadge'
import { Tick, Cross, Pill } from './Tick'
import { PLANS, GROUPS } from './data'

// §1.3 — XI state only. Sticky header (top 72, z 3) + sticky category rows (top 246, z 1).
// At <1200 the plan header cells are not rendered (live-site behaviour, measured): values stay unlabelled.
const COLS = 'grid grid-cols-[120px_repeat(3,minmax(0,1fr))] md:grid-cols-[264px_repeat(3,minmax(0,1fr))] lg:grid-cols-[438px_repeat(3,minmax(0,1fr))]'
const DIVIDER = "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-[rgb(234,234,234)] after:content-['']"
const TEXT = 'text-[12px] font-medium leading-4 tracking-[-0.12px] md:text-[14px] md:leading-5 md:tracking-[-0.084px] lg:text-[16px] lg:leading-6 lg:tracking-[-0.16px]'
const BUSINESS_GRADIENT = {
  backgroundImage: 'linear-gradient(90deg, rgb(32,131,116) 0%, rgb(0,183,155) 42.64%, rgb(33,170,149) 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
}

function Value({ v }) {
  if (v === true) return <Tick />
  if (v === false) return <Cross />
  return <span className={`text-center text-panel-3 ${TEXT}`}>{v}</span>
}

function PlanHead({ plan, annual }) {
  const b = plan.button
  return (
    <div className="hidden flex-col gap-6 px-6 py-4 lg:flex">
      <div className="flex flex-col gap-[10px]">
        <div className="flex items-center justify-between gap-2">
          <span className="font-headline text-[20px] leading-7 tracking-[.2px] text-black" style={plan.gradient ? BUSINESS_GRADIENT : undefined}>
            {plan.name}
          </span>
          {plan.tag && <Pill bg={plan.tagBg}>{plan.tag}</Pill>}
        </div>
        <span className="text-[14px] leading-5 tracking-[-0.084px] text-[rgb(102,102,102)]">{annual ? plan.table.annual : plan.table.monthly}</span>
      </div>
      <Button variant={b.variant} href={b.href} className="w-full" {...(b.external ? { target: '_blank', rel: 'noopener' } : {})}>
        {b.label}
      </Button>
    </div>
  )
}

export default function ComparisonTable({ annual }) {
  return (
    <section className="mx-auto box-border w-full max-w-container bg-white px-5 py-11 md:py-[88px]">
      <div className="flex w-full flex-col gap-6">
        <div className={`sticky top-[72px] z-[3] h-[174px] bg-white ${COLS} ${DIVIDER}`}>
          <div className="col-span-4 flex flex-col justify-end gap-4 py-6 lg:col-span-1">
            <span className="text-[14px] leading-5 tracking-[-0.14px] text-grey-550">Product Details</span>
            <span
              className="flex h-10 w-[210px] items-center gap-3 rounded-[8px] bg-white px-3 py-[10px] text-[14px] font-medium leading-5 tracking-[-0.084px] text-ink"
              style={{ boxShadow: '0 0 0 1px rgba(0,0,0,.08)' }}
            >
              <ProductBadge product="XI" />
              Experience Intelligence
            </span>
          </div>
          {PLANS.map((p) => <PlanHead key={p.name} plan={p} annual={annual} />)}
        </div>

        {GROUPS.map((g) => (
          <div key={g.title} className="flex flex-col">
            <div className={`sticky top-[246px] z-[1] flex h-[72px] items-center bg-white ${DIVIDER}`}>
              <h3 className="font-headline m-0 text-[20px] font-normal leading-7 text-ink">{g.title}</h3>
            </div>
            {g.rows.map(([label, ...vals]) => (
              <div key={label} className={`relative h-[72px] ${COLS} ${DIVIDER}`}>
                <div className={`flex items-center text-grey-550 ${TEXT}`}>{label}</div>
                {vals.map((v, i) => (
                  <div key={i} className="flex items-center justify-center">
                    <Value v={v} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
