import CTA from '../components/CTA'
import usePageMeta from './shared-info/usePageMeta'
import SecurityHero from './security/SecurityHero'
import FourFacts from './security/FourFacts'
import TrustCards from './security/TrustCards'

// specs/plans-security-contact-404.md §2
export default function Security() {
  usePageMeta(
    'Security — Primefold',
    "Security isn't a feature, it's the foundation. Hosted in Germany, built to GDPR requirements — and we do not use your data to train AI models.",
  )
  return (
    <>
      <main className="bg-white">
        <SecurityHero />
        <FourFacts />
        <TrustCards />
      </main>
      <CTA variant="security" />
    </>
  )
}
