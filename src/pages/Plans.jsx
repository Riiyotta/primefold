import { useState } from 'react'
import CTA from '../components/CTA'
import usePageMeta from './shared-info/usePageMeta'
import PlansHero from './plans/PlansHero'
import ComparisonTable from './plans/ComparisonTable'
import PlansTrust from './plans/PlansTrust'
import PlansFaq from './plans/PlansFaq'

// specs/plans-security-contact-404.md §1
export default function Plans() {
  usePageMeta(
    'Plans & Pricing — Primefold',
    'Start free with 30 days of full access. Business and Enterprise plans for teams that run live research continuously. No card required.',
  )
  const [product, setProduct] = useState('XI')
  const [annual, setAnnual] = useState(false)
  return (
    <>
      <main className="bg-white">
        <PlansHero product={product} setProduct={setProduct} annual={annual} setAnnual={setAnnual} />
        {product === 'XI' && <ComparisonTable annual={annual} />}
        <PlansTrust />
        <PlansFaq />
      </main>
      <CTA />
    </>
  )
}
