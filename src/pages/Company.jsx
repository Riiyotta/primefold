import CTA from '../components/CTA'
import CompanyHero from './company/CompanyHero'
import Commitments from './company/Commitments'
import Team from './company/Team'
import usePageMeta from './company/usePageMeta'

// specs/company-careers-legal.md §A
export default function Company() {
  usePageMeta(
    'Company — Primefold',
    'One engine, every industry it runs. We build AI-native intelligence from Berlin — evidence first, privacy by architecture, close to the work.',
  )
  return (
    <main className="flex w-full flex-col items-center overflow-clip bg-white">
      <CompanyHero />
      <div className="flex w-full max-w-[1320px] flex-col gap-[10px] bg-white">
        <Commitments />
        <Team />
      </div>
      <div className="w-full">
        <CTA variant="roles" />
      </div>
    </main>
  )
}
