import CTA from '../components/CTA'
import Button from '../components/shared/Button'
import { caseStudies, CASES_INDEX_META } from './cms/data'
import { CALENDLY, IndexHero, useCmsMeta } from './cms/shared'

// §2.2 case card — title, then "Read story" + arrow (gap 16 → 20 on hover)
function CaseCard({ cs }) {
  return (
    <a href={`/case-studies/${cs.slug}`} className="cms-card flex flex-col gap-5 no-underline">
      <div className="cms-ring16 aspect-video w-full">
        <img src={cs.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="cms-card-title cms-headline cms-ss m-0 text-[20px] leading-7">{cs.title}</h2>
        <div className="cms-read flex items-center">
          <span className="text-[16px] font-medium leading-6 tracking-[-0.16px] text-ink">Read story</span>
          <span className="cms-arrow" aria-hidden="true" />
        </div>
      </div>
    </a>
  )
}

export default function CaseStudies() {
  useCmsMeta(CASES_INDEX_META.title, CASES_INDEX_META.description)
  return (
    <main className="bg-white">
      <IndexHero
        eyebrow="Case Studies"
        title="Proof, not promises"
        lead="How teams across DACH went from question to decision, and what changed once they did."
      >
        <Button variant="black" href={CALENDLY} target="_blank" rel="noopener">Book a call</Button>
      </IndexHero>
      <section className="w-full px-5 pb-[100px]">
        <div className="cms-grid">
          {caseStudies.map((cs) => <CaseCard key={cs.slug} cs={cs} />)}
        </div>
      </section>
      <CTA />
    </main>
  )
}
