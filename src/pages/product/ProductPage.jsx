import { useEffect, useRef } from 'react'
import CTA from '../../components/CTA'
import Button from '../../components/shared/Button'
import Eyebrow from '../../components/shared/Eyebrow'
import { createSpring } from '../../components/how/motion'
import Rays from './Rays'
import LiveConversation from './LiveConversation'
import StepCards from './StepCards'
import UseCases from './UseCases'
import Sources from './Sources'
import SolutionsTabs from './SolutionsTabs'
import { CALENDLY } from './content'
import './product.css'

// specs/product-pages.md — one template for /experience-intelligence and /realestate-intelligence.

function useDocumentMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content')
    if (meta) meta.setAttribute('content', description)
    return () => {
      document.title = prevTitle
      if (meta && prevDesc != null) meta.setAttribute('content', prevDesc)
    }
  }, [title, description])
}

// §1 Hero — dark, rays shader + live chat. No parallax, no appear animations.
function Hero({ hero }) {
  return (
    <section className="pp-hero" style={{ '--gap': `${hero.gap}px`, '--left': `${hero.left}px`, '--chat': `${hero.chat}px` }}>
      <Rays colorMode={hero.rays} />
      <div className="pp-hero__row">
        <div className="pp-hero__left">
          <div className="flex items-center gap-4">
            <img src={hero.badge} alt="" width="20" height="20" className="h-5 w-5" />
            <span className="text-[16px] font-medium leading-6 tracking-[-0.16px] text-white">{hero.label}</span>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="pp-h1 font-headline">{hero.h1}</h1>
            <p className="m-0 text-[16px] leading-6 tracking-[-0.16px]" style={{ color: 'rgb(203,199,192)' }}>
              {hero.p}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="white" href={CALENDLY} target="_blank" rel="noopener">
              Book a call
            </Button>
            <Button variant="glass" href={hero.second.href}>
              {hero.second.label}
            </Button>
          </div>
        </div>
        <div className="pp-hero__chat">
          <LiveConversation data={hero.chatData} charsPerTick={3} holdSeconds={3.8} autoAdvance />
        </div>
      </div>
    </section>
  )
}

// §2 Content sheet: translate(80,80) → 0 over the first 500px of scroll (spring k500 c60), off on phone.
function useSheetOffset(ref) {
  useEffect(() => {
    const el = ref.current
    const mql = window.matchMedia('(min-width: 810px)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const spring = createSpring({
      stiffness: 500,
      damping: 60,
      initial: 80,
      onUpdate: (v) => {
        el.style.transform = v > 0.01 ? `translate3d(${v.toFixed(2)}px, ${v.toFixed(2)}px, 0)` : ''
      },
    })
    const target = () => (mql.matches && !reduce ? 80 * (1 - Math.min(1, Math.max(0, window.scrollY / 500))) : 0)
    spring.set(target(), true)
    const on = () => spring.set(target())
    window.addEventListener('scroll', on, { passive: true })
    mql.addEventListener('change', on)
    return () => {
      window.removeEventListener('scroll', on)
      mql.removeEventListener('change', on)
      spring.stop()
    }
  }, [ref])
}

// §2e The loop
function Loop({ loop }) {
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

export default function ProductPage({ content }) {
  useDocumentMeta(content.title, content.description)
  const sheet = useRef(null)
  useSheetOffset(sheet)
  return (
    <div className={`pp pp--${content.key}`}>
      <Hero hero={content.hero} />
      <div className="pp-sheet">
        <section id="how-it-works" className="pp-how" ref={sheet}>
          <StepCards variant={content.key} steps={content.steps} />
          <UseCases usedBy={content.usedBy} items={content.useCases} />
          <Sources variant={content.key} sources={content.sources} />
          <SolutionsTabs tabs={content.solutions.tabs} />
          <Loop loop={content.loop} />
        </section>
      </div>
      <CTA variant={content.cta} />
    </div>
  )
}
