import Eyebrow from '../../components/shared/Eyebrow'
import Button from '../../components/shared/Button'
import CometRing, { cometCss } from './CometRing'

const CALENDLY = 'https://calendly.com/d/dv3b-wwt-mfy/talk-to-primefold'
const LINE = 'pointer-events-none absolute inset-0 rounded-[1000px] border border-solid border-[rgba(255,255,255,.12)]'
const PILL_SHADOW = '0 4.37px 2.21px rgba(0,0,0,.06), 0 10.51px 5.32px rgba(0,0,0,.08), 0 19.78px 10px rgba(0,0,0,.12), 0 35.29px 15px rgba(0,0,0,.15)'

// Layer box sizes as % of the 432x598 [Animation] box (§2.1), so everything scales with it.
const pct = (w, h) => ({ width: `${(w / 432) * 100}%`, height: `${(h / 598) * 100}%` })
const centered = 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'

function Animation() {
  return (
    <div className="relative aspect-[432/598] w-full max-w-[432px]">
      <style>{cometCss}</style>
      {/* 1. Comet ring 3 (teal) */}
      <div className={centered} style={pct(432, 598)}><CometRing w={432} h={598} color="rgb(63,209,188)" head={23.1} /></div>
      {/* 2. plain ring */}
      <div className={centered} style={pct(384, 551)}><span className={LINE} /></div>
      {/* 3. Comet ring 2 (orange) */}
      <div className={centered} style={pct(337, 503)}><CometRing w={336} h={502} color="rgb(249,157,114)" head={43.3} /></div>
      {/* 4. plain ring */}
      <div className={centered} style={pct(289, 456)}><span className={LINE} /></div>
      {/* 5. Comet ring 1 (white) */}
      <div className={centered} style={pct(242, 408)}><CometRing w={240} h={405} color="rgb(255,255,255)" head={30.5} /></div>
      {/* 6. Center pill (live: 333x176 row rotated 90°; built upright) */}
      <div
        className={`${centered} box-border flex flex-col gap-4 rounded-full bg-[rgba(23,21,18,.8)] p-4`}
        style={{ ...pct(176, 333), boxShadow: PILL_SHADOW }}
      >
        <img src="/assets/pages/security/7ERMi7fk0ghkwyi7viAZS06g6w.svg" alt="GDPR badge for the EU-Central-1 hosting region" className="min-h-0 w-full flex-1 object-contain" />
        <img src="/assets/pages/security/ibbCaDYtLP74SJYvXs8caLQZw.svg" alt="Fingerprint mark symbolising data security" className="min-h-0 w-full flex-1 object-contain" />
        <span className="pointer-events-none absolute inset-0 rounded-full border border-solid border-[rgba(255,255,255,.12)]" />
      </div>
    </div>
  )
}

export default function SecurityHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-clip bg-ink px-5">
      {/* BG Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[45.13%] top-[130px] h-[477px] w-[780px] -translate-x-1/2 -translate-y-1/2 opacity-20 md:left-[41.96%] md:top-[86px] md:h-[1034px] md:w-[1689px] lg:top-[84px]"
        style={{ background: 'radial-gradient(35% 35% at 48.8% 46.9%, rgba(171,160,136,.5) 0%, rgba(171,160,136,0) 100%)' }}
      />
      <div className="relative flex w-full max-w-[1280px] flex-col items-center justify-center gap-10 py-20 md:flex-row">
        <div className="flex w-full flex-col gap-5 md:w-auto md:min-w-0 md:flex-[1_0_0px]">
          <Eyebrow color="rgba(255,255,255,.56)">Security</Eyebrow>
          <h1 className="font-headline m-0 text-[42px] font-normal leading-[50.4px] tracking-[.84px] text-white md:text-[48px] md:leading-[57.6px] md:tracking-[.96px] lg:text-[56px] lg:leading-[67.2px] lg:tracking-[1.12px]">
            Security is the foundation.<br />Not a feature.
          </h1>
          <p className="m-0 text-[16px] leading-6 tracking-[-0.16px] text-a1-text-2">
            Your data stays yours. Every answer links back to the source it came from. Hosted in Germany, with separated data storage and source-level traceability built in from the start.
          </p>
          <div className="flex">
            <Button variant="white" href={CALENDLY} target="_blank" rel="noopener">Book a call</Button>
          </div>
        </div>
        <div className="box-border flex aspect-[640/886] w-full items-center justify-center px-5 md:w-auto md:min-w-0 md:flex-[1_0_0px]">
          <Animation />
        </div>
      </div>
    </section>
  )
}
