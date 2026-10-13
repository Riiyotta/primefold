import Eyebrow from '../../components/shared/Eyebrow'
import Button from '../../components/shared/Button'
// Mask SVGs: page-local copies — the public/assets originals have trailing junk after </svg> (malformed XML, won't render as masks)
const maskDataSits = '/assets/pages/company/mask-stat-data-sits.svg'
const maskCredibility = '/assets/pages/company/mask-stat-credibility.svg'


const A = '/assets/pages/company/'
const CALENDLY = 'https://calendly.com/d/dv3b-wwt-mfy/talk-to-primefold'

const mask = (url, color) => ({
  width: 20,
  height: 20,
  backgroundColor: color,
  WebkitMask: `url(${url}) center/contain no-repeat`,
  mask: `url(${url}) center/contain no-repeat`,
})

// spec A1 — stat card icon tiles
const STATS = [
  {
    label: 'Founded in Berlin',
    value: '2024',
    icon: (
      <img src={`${A}xHFcroRcWC2fxNduO7fVX1WKWvQ.svg`} alt="" width={32} height={32}
        className="h-8 w-8 shrink-0 rounded-lg" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,.08)' }} />
    ),
  },
  {
    label: 'Where your data sits',
    value: 'EU',
    icon: (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ background: 'rgba(156,156,156,.12)', boxShadow: '0 0 0 1px rgba(0,0,0,.08)' }}>
        <span style={mask(maskDataSits, '#fff')} />
      </span>
    ),
  },
  {
    label: 'Products live today',
    value: '2',
    icon: (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ background: 'rgba(32,131,116,.12)', boxShadow: '0 0 0 1px rgba(32,131,116,.16)' }}>
        <img src={`${A}icon-stat-products-live.svg`} alt="" width={20} height={20} className="h-5 w-5" />
      </span>
    ),
  },
  {
    label: 'Credibility: Answers traced to source',
    value: '100%',
    icon: (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ background: 'rgba(157,96,68,.12)', boxShadow: '0 0 0 1px rgba(58,30,17,.16)' }}>
        <span style={mask(maskCredibility, 'rgb(202,123,87)')} />
      </span>
    ),
  },
]

const CARD_SHADOW = '0 0 0 1px rgba(255,255,255,.18), 0 0 0 2px rgba(0,0,0,.24), 0 2px 2px 0 rgba(0,0,0,.12)'

export default function CompanyHero() {
  return (
    <section className="relative flex w-full flex-col items-center gap-14 overflow-clip px-5 pb-[88px] pt-[156px]">
      <img
        src={`${A}cThFoE5iLieFxYjJ383g6O72ETg.webp`}
        alt="City skyline with high-rise offices at dusk"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div id="nav-trigger" className="pointer-events-none absolute left-0 top-[100px] h-px w-px" aria-hidden="true" />

      <div className="relative flex w-full max-w-[1280px] flex-col items-start gap-5">
        <div className="flex w-full max-w-[600px] flex-col gap-4">
          <Eyebrow color="rgba(255,255,255,.72)">Company</Eyebrow>
          <h1 className="font-headline m-0 text-[42px] font-normal leading-[50.4px] tracking-[0.02em] text-white md:text-[48px] md:leading-[57.6px] lg:text-[56px] lg:leading-[67.2px]">
            From the right question to the right decision.
          </h1>
          <div className="opacity-[.56]">
            <p className="m-0 text-[16px] font-normal leading-6 tracking-[-0.16px] text-white">
              Primefold reads, connects and analyzes information scattered across documents, data and conversations. Ask a question, <strong className="font-bold">understand what it means</strong>, and decide what to do next.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="white" href={CALENDLY} target="_blank" rel="noopener">Book a call</Button>
          <Button variant="glass" href="/careers#roles">See open roles</Button>
        </div>
      </div>

      <div className="relative grid w-full max-w-[1280px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="overflow-clip rounded-2xl px-[41px] py-10"
            style={{ background: 'rgba(120,120,120,.24)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)', boxShadow: CARD_SHADOW }}
          >
            <div className="flex flex-col gap-10">
              <div className="flex items-center justify-center gap-3">
                <p className="m-0 flex-1 text-[14px] font-medium leading-5 tracking-[-0.084px] text-white/[.56]">{s.label}</p>
                {s.icon}
              </div>
              <h2 className="t-h2 m-0 !text-white">{s.value}</h2>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
