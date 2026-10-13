import SectionTitle from '../shared-info/SectionTitle'
import InfoCard from '../shared-info/InfoCard'
const iconAnswers = '/assets/pages/plans/icon-answers-rely.svg'
const iconNever = '/assets/pages/plans/icon-never-trained.svg'
const iconEu = '/assets/pages/plans/icon-eu-hosted.svg'
const iconPrivacy = '/assets/pages/plans/icon-privacy-by-design.svg'

const CARDS = [
  [iconAnswers, 'Answers you can rely on', 'Every recommendation traces back to a real response, clause or line item.'],
  [iconNever, 'Never used for training', 'We never train our models on your data. Not by default, and never through a clause in your terms.'],
  [iconEu, 'EU-hosted', 'Your data is hosted safely within the EU.'],
  [iconPrivacy, 'Privacy by design', 'Identifiers are separated from content and replaced with keys – pseudonymisation under GDPR Art. 4(5).'],
]

// §1.4 Trust: "In every plan"
export default function PlansTrust() {
  return (
    <section className="flex flex-col gap-8 bg-white pb-[88px] md:gap-14">
      <SectionTitle
        eyebrow="In every plan"
        title="Trust is not an upgrade."
        side="Security is built into every plan. Your plan determines access and limits, not the security standards we apply to your data."
      />
      <div className="mx-auto box-border grid w-full max-w-container grid-cols-1 gap-6 px-5 md:grid-cols-2 lg:grid-cols-4">
        {CARDS.map(([icon, title, desc]) => (
          <InfoCard key={title} icon={icon} title={title}>{desc}</InfoCard>
        ))}
      </div>
    </section>
  )
}
