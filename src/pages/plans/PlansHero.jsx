import Eyebrow from '../../components/shared/Eyebrow'
import Button from '../../components/shared/Button'
import ProductBadge from './ProductBadge'
import { Track, Segment, SegLabel } from './Segmented'
import { Tick, Pill } from './Tick'
import { PLANS, CALENDLY, XI_APP } from './data'
const divider = '/assets/pages/plans/card-divider.svg'

const RING = { boxShadow: '0 0 0 1px rgba(0,0,0,.08)' }
const ext = (b) => (b.external ? { target: '_blank', rel: 'noopener' } : {})

function PlanCard({ plan }) {
  return (
    <div className="flex flex-col gap-6 rounded-[16px] p-8" style={{ ...RING, backgroundColor: plan.bg }}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-headline m-0 text-[20px] font-normal leading-7 text-ink">{plan.name}</h2>
            {plan.tag && <Pill bg={plan.tagBg}>{plan.tag}</Pill>}
          </div>
          <p className="m-0 min-h-10 text-[14px] leading-5 tracking-[-0.084px] text-grey-600">{plan.desc}</p>
        </div>
        <div className="flex items-end gap-2">
          <span className="font-headline whitespace-nowrap text-[32px] font-normal leading-10 tracking-[.64px] text-ink md:text-[44px] md:leading-[48px] md:tracking-[.88px] lg:text-[48px] lg:leading-[56px] lg:tracking-[.96px]">
            {plan.price}
          </span>
          {plan.suffix && <span className="pt-[6px] text-[16px] leading-6 tracking-[-0.16px] text-grey-600">{plan.suffix}</span>}
        </div>
        <Button variant={plan.button.variant} href={plan.button.href} className="w-full" {...ext(plan.button)}>
          {plan.button.label}
        </Button>
      </div>
      <img src={divider} alt="" aria-hidden="true" className="block h-[3px] w-full" />
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {plan.features.map(([label, quarter]) => (
          <li key={label} className="flex items-start gap-3">
            <Tick />
            <span className="min-w-0 flex-1 text-[14px] font-medium leading-5 tracking-[-0.084px] text-ink">{label}</span>
            {quarter && <Pill className="-my-[2px]">{quarter}</Pill>}
          </li>
        ))}
      </ul>
    </div>
  )
}

function RICard() {
  return (
    <div className="box-border flex min-h-[480px] w-full max-w-[1280px] flex-col items-center justify-center gap-8 rounded-[16px] bg-page-alt px-8 py-24" style={RING}>
      <div className="flex w-full max-w-[720px] flex-col items-center gap-4 text-center">
        <p className="m-0 text-[14px] font-medium leading-5 tracking-[-0.084px] text-grey-500">PRIMEFOLD RI</p>
        <h2 className="font-headline m-0 text-[42px] font-normal leading-[50.4px] tracking-[.84px] text-ink-2 md:text-[48px] md:leading-[57.6px] md:tracking-[.96px] lg:text-[56px] lg:leading-[67.2px] lg:tracking-[1.12px]">
          Explore Primefold RI
        </h2>
        <p className="m-0 text-[16px] leading-6 tracking-[-0.16px] text-grey-600">Interested in piloting Primefold RI? Let’s talk about your use case.</p>
      </div>
      <Button variant="black" href={CALENDLY} target="_blank" rel="noopener" className="w-[260px]">Let’s talk</Button>
    </div>
  )
}

export default function PlansHero({ product, setProduct, annual, setAnnual }) {
  const xi = product === 'XI'
  return (
    <section className="flex flex-col items-center gap-5 overflow-clip px-5 pb-10 pt-[156px] md:pb-[88px]">
      <div className="flex w-full max-w-[1280px] flex-col gap-5">
        <div className="flex max-w-[600px] flex-col gap-4">
          <Eyebrow>Plans</Eyebrow>
          <h1 className="font-headline m-0 text-[42px] font-normal leading-[50.4px] tracking-[.84px] text-black md:text-[48px] md:leading-[57.6px] md:tracking-[.96px] lg:text-[56px] lg:leading-[67.2px] lg:tracking-[1.12px]">
            Start free.<br />Stay for the answers.
          </h1>
          <p className="m-0 max-w-[501px] text-[16px] leading-6 tracking-[-0.16px] text-[rgb(84,82,78)]">
            {xi ? (
              <>Experience Intelligence starts with 30 days of full access.<br />No credit card. No feature gates. Just the full product.</>
            ) : (
              'Talk to us to see how RI turns your asset data into traceable insights and recommendations.'
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button variant="black" href={XI_APP}>Start free trial</Button>
          <Button variant="glass-dark" href={CALENDLY} target="_blank" rel="noopener">Book a call</Button>
        </div>
      </div>

      <div className="flex w-full max-w-[1280px] flex-col items-start gap-5 pt-6 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-0 md:pb-9 md:pt-0">
        <Track label="Product">
          {[
            ['XI', 'Experience Intelligence'],
            ['RI', 'Real Estate Intelligence'],
          ].map(([p, name]) => (
            <Segment key={p} active={product === p} onClick={() => setProduct(p)}>
              <ProductBadge product={p} />
              <SegLabel active={product === p}>
                <span className="md:hidden">{p}</span>
                <span className="hidden md:inline">{name}</span>
              </SegLabel>
            </Segment>
          ))}
        </Track>
        <Track
          label="Billing"
          className="overflow-hidden"
          // RI state ("Yearly" variant): fades out and collapses to 0 height (390 RI capture: toggle→card = 20+20px)
          style={{ height: xi ? 44 : 0, padding: xi ? 2 : 0, opacity: xi ? 1 : 0, visibility: xi ? 'visible' : 'hidden', transition: 'opacity .2s, visibility .2s' }}
        >
          <Segment active={!annual} onClick={() => setAnnual(false)}>
            <SegLabel active={!annual}>Monthly</SegLabel>
          </Segment>
          <Segment active={annual} onClick={() => setAnnual(true)}>
            <SegLabel active={annual} className="text-teal">Save annually</SegLabel>
            <span className="text-teal">-17%</span>
          </Segment>
        </Track>
      </div>

      {xi ? (
        <div className="grid w-full max-w-[1280px] grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((p) => <PlanCard key={p.name} plan={p} />)}
        </div>
      ) : (
        <RICard />
      )}
    </section>
  )
}
