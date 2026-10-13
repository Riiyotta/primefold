import Eyebrow from './shared/Eyebrow'
import RollingNumber from './outcomes/RollingNumber'

// CLONE_SPEC 8 — Outcomes
const CARDS = [
  { wide: false, img: '/assets/vukJGGeDQ72ugU8BMCw9S7b0NI8.png', logo: '/assets/mlevCnZoqAApeTSZWClq74jYCg.png', logoAlt: 'DIRTS logo', lw: 94, lh: 40, num: '5x', text: 'More units sold with data-driven color selection.', name: 'Janek Strobel', role: 'Head of Operations, DIRTS' },
  { wide: true, img: '/assets/2YKiPQOWTotKpViisGGHGQbghrM.jpeg', logo: '/assets/vBdLAfXU5G3G8FMre5KLbUkCzWc.svg', logoAlt: 'Gainback logo', lw: 40, lh: 40, num: '150 customers', text: 'Seven touchpoints, one picture of the market . This clarity got us from zero to 150 customers.', name: 'Jakob Hebenstreit', role: 'Co-Founder, Gainback' },
  { wide: true, img: '/assets/OCJYK6agr32RKk3h6WGSSJgSB0g.jpg', logo: '/assets/0I7dW2NSk2zVnHLMvfACsc1BIr8.png', logoAlt: 'NAS Invest logo', lw: 93, lh: 40, num: '1 hour', text: 'To read a 300-page commercial lease, against 2-3 days it takes by hand.', name: 'Ammar Tahirovic', role: 'Intelligence Analyst, NAS Invest' },
  { wide: false, img: '/assets/NS0Wgwn5twaEyiw0qOiX49499Y.jpg', logo: '/assets/zBz0VomWfjQ5l9E8sVDczIDkkM.webp', logoAlt: 'Customer logo', lw: 111, lh: 22, num: '1 market', text: 'Identified one new target market, defined adapted content formats and acquired new sponsors.', name: 'Nicole Bilecki', role: 'Head of Women & Lifestyle' },
]

function Card({ c }) {
  // Desktop: 500 / 764 fixed; tablet: flex:1 (377 each @810); phone: full width (350)
  const width = c.wide ? 'lg:w-[764px]' : 'lg:w-[500px]'
  return (
    <div
      className={`relative flex h-[492px] w-full flex-col items-start justify-between overflow-clip rounded-2xl bg-white p-10 md:w-auto md:min-w-0 md:flex-1 lg:flex-none ${width}`}
      style={{ boxShadow: '0 0 0 1px rgba(0,0,0,.08), 0 1px 2px 0 rgba(36,36,36,.04)' }}
    >
      <img src={c.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(26,24,20,.24) 0%, rgb(26,24,20) 100%)' }} />
      <div className="relative flex w-full flex-col items-start justify-center gap-8">
        <img src={c.logo} alt={c.logoAlt} style={{ width: c.lw, height: c.lh }} className="object-cover" />
        <RollingNumber value={c.num} />
      </div>
      <div className="relative flex w-full max-w-[454px] flex-col items-center justify-center gap-8">
        <h3 className="m-0 w-full font-headline text-[26px] font-normal leading-[30px] text-white md:text-[28px] md:leading-8 lg:text-[32px] lg:leading-10">{c.text}</h3>
        <div className="flex w-full flex-col items-start justify-center gap-[2px]">
          <p className="m-0 text-[16px] font-medium leading-6 tracking-[-0.16px] text-white">{c.name}</p>
          <p className="m-0 text-[14px] leading-5 tracking-[-0.084px] text-white opacity-50">{c.role}</p>
        </div>
      </div>
    </div>
  )
}

export default function Outcomes() {
  return (
    <section className="flex justify-center overflow-clip bg-white">
      <div className="mx-auto flex w-full max-w-container flex-col items-center bg-white px-5 py-11 md:pb-[120px] md:pt-16">
        <div className="flex w-full flex-col items-start gap-8 md:gap-14">
          <div className="flex w-full max-w-[550px] flex-col items-start gap-4">
            <Eyebrow>Outcomes</Eyebrow>
            <h2 className="t-h2 m-0 w-full whitespace-pre-wrap">{'Real impact.                Real outcomes.'}</h2>
            <p className="t-lead m-0 max-w-[420px]">How teams turn intelligence into action.</p>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-4 overflow-clip">
            <div className="flex w-full flex-col gap-4 md:flex-row">
              <Card c={CARDS[0]} />
              <Card c={CARDS[1]} />
            </div>
            <div className="flex w-full flex-col gap-4 md:flex-row">
              <Card c={CARDS[2]} />
              <Card c={CARDS[3]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
