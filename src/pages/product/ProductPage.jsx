import { useEffect, useRef } from 'react'
import CTA from '../../components/CTA'
import { createSpring } from '../../components/how/motion'
import ProductHero from './ProductHero'
import StepCards from './StepCards'
import UseCases from './UseCases'
import Sources from './Sources'
import SolutionsTabs from './SolutionsTabs'
import LoopCards from './LoopCards'
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

export default function ProductPage({ content }) {
  useDocumentMeta(content.title, content.description)
  const sheet = useRef(null)
  useSheetOffset(sheet)
  return (
    <div className={`pp pp--${content.key}`}>
      <ProductHero hero={content.hero} />
      <div className="pp-sheet">
        <section id="how-it-works" className="pp-how" ref={sheet}>
          <StepCards variant={content.key} steps={content.steps} />
          <UseCases usedBy={content.usedBy} items={content.useCases} />
          <Sources variant={content.key} sources={content.sources} />
          <SolutionsTabs tabs={content.solutions.tabs} />
          <LoopCards loop={content.loop} />
        </section>
      </div>
      <CTA variant={content.cta} />
    </div>
  )
}
