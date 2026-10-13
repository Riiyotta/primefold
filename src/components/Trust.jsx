import { useEffect, useRef, useState } from 'react'
import Eyebrow from './shared/Eyebrow'

// CLONE_SPEC 7 — Trust
const ITEMS = [
  { title: 'Hosted in Germany & GDPR-compliant', text: 'Your data is stored on servers in Germany, built to GDPR requirements.' },
  { title: 'Answers you can trace, not guess', text: 'Every answer links back to the source it came from. See the evidence behind the answer, not just the result.' },
  { title: 'Your workspace', text: 'What the platform learns stays in your workspace.' },
]
const LOTTIE_SRC = '/assets/lottie/HY16h57JG9iHUXsmkr9vgGV0A.json'

export default function Trust() {
  const eyebrowRef = useRef(null)
  const lottieBox = useRef(null)
  const anim = useRef(null)
  const inViewRef = useRef(false)
  const [inView, setInView] = useState(false)

  // Trigger: Trust eyebrow fully in view (threshold 1). Re-triggers each time it re-enters.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      const v = e.intersectionRatio >= 1
      inViewRef.current = v
      setInView(v)
    }, { threshold: [0, 1] })
    io.observe(eyebrowRef.current)
    return () => io.disconnect()
  }, [])

  // Lottie panel: "Before Play" (paused at frame 0) -> "Play" (autoplay + loop)
  useEffect(() => {
    let cancelled = false
    let a = null
    // The JSON embeds its images as data: URIs. Loading it via `path` makes lottie-web prefix them with
    // the JSON's directory (broken <image> hrefs), so fetch it and pass it as animationData instead.
    // Use the same lottie_light build as intel/Lottie.jsx: two separate lottie-web builds each start their
    // own `__lottie_element_N` id counter, so their clipPath/mask ids collide and this panel got clipped.
    Promise.all([import('lottie-web/build/player/lottie_light'), fetch(LOTTIE_SRC).then((r) => r.json())]).then(([mod, animationData]) => {
      if (cancelled) return
      const lottie = mod.default || mod
      a = lottie.loadAnimation({
        container: lottieBox.current,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        animationData,
        rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
      })
      anim.current = a
      a.addEventListener('DOMLoaded', () => {
        if (inViewRef.current) a.play()
        else a.goToAndStop(0, true)
      })
    })
    return () => { cancelled = true; if (a) a.destroy(); anim.current = null }
  }, [])

  useEffect(() => {
    const a = anim.current
    if (!a || !a.isLoaded) return
    if (inView) a.play()
    else a.goToAndStop(0, true)
  }, [inView])

  return (
    <section className="flex justify-center overflow-clip bg-white">
      <div className="mx-auto flex w-full max-w-container flex-wrap items-center gap-x-14 gap-y-8 bg-white px-5 py-11 md:py-[88px]">
        <div className="flex w-full flex-col items-start justify-between md:w-auto md:min-w-0 md:flex-1 md:self-stretch">
          <div className="flex w-full flex-col items-start gap-4">
            <div ref={eyebrowRef}><Eyebrow>Trust</Eyebrow></div>
            <h2 className="t-h2 m-0">Trust, built into every layer.</h2>
            <p className="t-lead m-0 max-w-[420px]">Your data passes through three layers of protection before you receive a recommendation.</p>
          </div>
          {/* Spacer: flex 1, min-height 44 (Framer). Column stretches to the panel height on md+ */}
          <div className="min-h-[44px] w-px flex-1" />
          <div className="flex w-full max-w-[516px] items-stretch gap-8 md:max-w-none lg:max-w-[516px]">
            <div className="relative w-px shrink-0 overflow-hidden bg-track">
              <div
                className="absolute left-0 top-0 w-px bg-teal"
                style={inView ? { height: '100%', transition: 'height 10s linear' } : { height: 1, transition: 'none' }}
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-6">
              {ITEMS.map((it) => (
                <div key={it.title} className="flex flex-col items-start gap-[6px]">
                  <p className="m-0 text-[16px] font-medium leading-6 tracking-[-0.16px] text-ink-2">{it.title}</p>
                  <p className="m-0 text-[14px] leading-5 tracking-[-0.084px] text-grey-600">{it.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Panel: aspect 612/652 (Lottie canvas), 1px rgb(235,235,235) inner outline (Framer ::after) */}
        <div className="relative aspect-[612/652] w-full overflow-hidden rounded-2xl bg-page-alt md:w-auto md:min-w-0 md:flex-1">
          <div ref={lottieBox} className="absolute inset-0" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 rounded-2xl border border-solid border-[rgb(235,235,235)]" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
