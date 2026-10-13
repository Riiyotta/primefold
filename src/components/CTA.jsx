import Button from './shared/Button'

// CLONE_SPEC 9 — CTA ("Main" wrapper, outside Content)
const CALENDLY = 'https://calendly.com/d/dv3b-wwt-mfy/talk-to-primefold'

// WebGL wave shader replaced by its fallback PNG (spec 9 / 14.2) with a slow drift.
// Drift amplitude/period are not in the spec (shader uniforms only) — chosen values. The brightness/contrast
// filter maps the PNG's luminance percentiles onto the live shader's (sampled over 3 frames @1440).
const driftCss = `
@keyframes pf-cta-drift { from { transform: scale(1.3) translate(-6%, -3%); } to { transform: scale(1.3) translate(6%, 3%); } }
.pf-cta-wave { filter: brightness(.74) contrast(1.2); animation: pf-cta-drift 12s ease-in-out infinite alternate; will-change: transform; }
@media (prefers-reduced-motion: reduce) { .pf-cta-wave { animation: none; transform: scale(1.3); } }
`

// Desktop-only variants (specs/company-careers-legal.md A4, specs/plans-security-contact-404.md 0.4).
// Framer swaps in the standard "Main" CTA below 1200px, so tablet/phone always render MAIN.
const MAIN = {
  pad: 'lg:py-[82px]',
  title: <>Ask your data.<br />Get the answer.</>,
  body: <>Bring a real business question.<br />Get the answer you need to move forward.</>,
  button: { label: 'Book a call', href: CALENDLY, target: '_blank', rel: 'noopener' },
}
const VARIANTS = {
  main: MAIN,
  roles: {
    pad: 'lg:py-[110px]',
    title: 'Ready to make an impact?',
    body: 'See where your work could make a difference.',
    button: { label: 'See open roles', href: '/careers#roles' },
  },
  // /experience-intelligence: same copy, plus a glass "Start free trial" pill at ≥1200 (specs/product-pages.md §3)
  xi: {
    ...MAIN,
    extra: { variant: 'glass', label: 'Start free trial', href: 'https://xi.primefold.ai/auth/sign-in?next=/home' },
  },
  security: {
    pad: 'lg:py-[120px]',
    title: 'Questions about security?',
    body: 'Data processing agreement and security documentation available on request. Security issue? Contact us below.',
    button: { label: 'Contact us', href: '/contact' },
  },
}

function Content({ v, className }) {
  const { label, ...link } = v.button
  return (
    <div className={`relative w-[97%] flex-col items-center justify-center gap-5 ${className}`}>
      <div className="flex w-full max-w-[620px] flex-col items-center justify-center gap-3">
        <h2 className="t-h2 m-0 w-full text-center !text-white">{v.title}</h2>
        <p className="m-0 w-full max-w-[372px] text-center text-[14px] leading-5 tracking-[-0.084px] text-white">{v.body}</p>
      </div>
      <div className="flex gap-4">
        <Button variant="white" {...link}>{label}</Button>
        {v.extra && (
          <Button variant={v.extra.variant} href={v.extra.href}>{v.extra.label}</Button>
        )}
      </div>
    </div>
  )
}

export default function CTA({ variant = 'main' }) {
  const v = VARIANTS[variant] || MAIN
  const split = v !== MAIN
  return (
    <div className="relative flex flex-col items-center justify-center bg-white px-5 py-6">
      <style>{driftCss}</style>
      <div
        className={`relative flex w-full max-w-[1280px] flex-col items-start justify-center overflow-clip rounded-[24px] bg-ink px-5 py-[82px] ${v.pad}`}
        style={{ boxShadow: '0 0 0 1px rgba(0,0,0,.08), 0 1px 2px 0 rgba(36,36,36,.04)' }}
      >
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <img src="/assets/5V8gmDlH6VshGL3t6Yw2BakE8M.png" alt="" className="pf-cta-wave h-full w-full object-cover" />
        </div>
        {split ? (
          <>
            <Content v={MAIN} className="flex lg:hidden" />
            <Content v={v} className="hidden lg:flex" />
          </>
        ) : (
          <Content v={MAIN} className="flex" />
        )}
      </div>
    </div>
  )
}
