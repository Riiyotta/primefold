import Eyebrow from '../../components/shared/Eyebrow'
import Button from '../../components/shared/Button'

const A = '/assets/pages/careers/'

// spec B1. Card prose is not recorded in the spec; transcribed from reference/pages/careers-1440-fullpage.png.
const CARDS = [
  {
    title: 'How you work',
    body: (
      <>
        <strong className="font-bold">You own the work, not a ticket queue.</strong> Most of what we build starts with a customer question, and you will hear it firsthand. Short paths from idea to production, with no layer between the people using the product and the people shaping it.
      </>
    ),
  },
  {
    title: 'How we hire',
    rotate: true,
    body: (
      <>
        <strong className="font-bold">A clear process, from first conversation to offer.</strong>
        <br />
        Four steps, two weeks, and one paid work sample. You meet the people you would work with, get a clear sense of the role, and know where you stand at every stage.
      </>
    ),
  },
]

// WebGL GradientWave shader → static fallback PNG per breakpoint (spec B1 / E)
function Shader({ rotate }) {
  return (
    <picture>
      <source media="(min-width: 1200px)" srcSet={`${A}DLxHDgiuFQf9DQC0sTFOvpSlftU.png`} />
      <source media="(min-width: 810px)" srcSet={`${A}fIGQ0rh0peFiNBGjC1QotXsuII.png`} />
      <img
        src={`${A}jcUFdKyfpvvIi4q0EUUYzRgd5no.png`}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={rotate ? { transform: 'rotate(180deg)' } : undefined}
      />
    </picture>
  )
}

export default function CareersHero() {
  return (
    <section className="relative flex w-full flex-col items-center gap-14 px-5 pb-[88px] pt-[156px]">
      <div id="nav-trigger" className="pointer-events-none absolute left-0 top-[100px] h-px w-px" aria-hidden="true" />
      <div className="flex w-full max-w-[1280px] flex-col items-start gap-5">
        <div className="flex w-full max-w-[650px] flex-col gap-4">
          <Eyebrow>Careers</Eyebrow>
          <h1 className="font-headline m-0 text-[42px] font-normal leading-[50.4px] tracking-[0.02em] text-black md:text-[48px] md:leading-[57.6px] lg:text-[56px] lg:leading-[67.2px]">
            Own the work. See the impact.
          </h1>
          <p className="m-0 text-[16px] font-normal leading-6 tracking-[-0.16px] text-grey-550">
            Take ideas from first conversation to execution, with the freedom to shape the work and see the result.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="black" href="#roles">See open roles</Button>
        </div>
      </div>

      <div className="grid w-full max-w-[1280px] grid-cols-1 gap-4 md:grid-cols-2">
        {CARDS.map((c) => (
          <div key={c.title} className="relative h-[435px] overflow-clip rounded-2xl bg-white" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,.08)' }}>
            <Shader rotate={c.rotate} />
            <div
              className="absolute bottom-0 left-0 right-0 h-[249px]"
              style={{ background: `linear-gradient(180deg, ${c.rotate ? 'rgba(255,255,255,0)' : 'rgba(0,0,0,0)'} 0%, rgba(0,0,0,.9) 69.425%, #000 100%)` }}
            />
            <div className="absolute bottom-0 left-0 flex w-full flex-col gap-3 p-8 md:p-10">
              <h2 className="font-headline m-0 text-[20px] font-normal leading-7 tracking-normal text-white">{c.title}</h2>
              <p className="m-0 text-[14px] font-normal leading-5 tracking-[-0.084px] text-[rgb(237,237,237)]">{c.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
