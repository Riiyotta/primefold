import SectionTitle from '../shared-info/SectionTitle'
import InfoCard from '../shared-info/InfoCard'
const iconGermany = '/assets/pages/security/icon-hosted-germany.svg'
const iconSeparation = '/assets/pages/security/icon-data-separation.svg'
const iconNeverTrain = '/assets/pages/security/icon-never-train-ai.svg'

// §2.2 — card 1 copy keeps the live-site typo (missing leading "Y").
const CARDS = [
  [iconGermany, 'Hosted in Germany', 'our data is stored on servers in Germany, built to GDPR requirements.'],
  [iconSeparation, 'Data separation', 'Names, IPs and content are stored separately, and access is limited to what each function needs.'],
  [iconNeverTrain, 'Never used to train AI models', 'We do not use your data to train AI models.'],
]

export default function FourFacts() {
  return (
    <section className="flex flex-col gap-8 bg-white pb-[88px] md:gap-14">
      <SectionTitle eyebrow="Where your data lives" title={<>Three things<br />you should know.</>} />
      <div className="mx-auto box-border grid w-full max-w-container grid-cols-1 gap-6 px-5 md:grid-cols-2 lg:grid-cols-3">
        {CARDS.map(([icon, title, desc]) => (
          <InfoCard key={title} icon={icon} title={title}>{desc}</InfoCard>
        ))}
      </div>
    </section>
  )
}
