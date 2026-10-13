import { useParams } from 'react-router-dom'
import CTA from '../components/CTA'
import Button from '../components/shared/Button'
import NotFound from './NotFound'
import { caseStudies, CASE_DESCRIPTION } from './cms/data'
import { Pill, extProps, useCmsMeta } from './cms/shared'
import RichText from './cms/RichText'

const Divider = () => <div className="h-px w-full shrink-0 bg-[rgb(235,235,235)]" />

// §4.4 stat cards
function Stats({ stats }) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((s) => (
        <div
          key={s.value}
          className="flex flex-col gap-4 overflow-clip rounded-[24px] bg-[rgb(246,246,246)] p-8"
          style={{ boxShadow: '0 0 0 1.6px rgba(0,0,0,.08)' }}
        >
          <h2 className="cms-title-48 cms-headline cms-ss" style={{ color: s.valueColor }}>{s.value}</h2>
          <p className="cms-stat-label">{s.label}</p>
        </div>
      ))}
    </div>
  )
}

// §4.5 About block: image card + information card
function About({ cs }) {
  const { client, info } = cs
  const rows = info.filter((r) => r.label !== 'Products in use')
  const products = info.find((r) => r.label === 'Products in use')
  return (
    <div className="flex w-full flex-col gap-8">
      <h3 className="cms-headline cms-ss cms-h3-size m-0 text-ink">{client.aboutHeading}</h3>
      <div className="flex flex-col gap-6 md:flex-row">
        <div
          className="relative flex h-[432px] w-full shrink-0 flex-col justify-between overflow-clip rounded-2xl p-8 md:w-[calc((100%-88px)/2)]"
          style={{ boxShadow: '0 0 0 1px rgba(0,0,0,.08), 0 1px 2px rgba(36,36,36,.04)' }}
        >
          <img src={client.aboutImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(26,24,20,.24) 0%, rgb(26,24,20) 100%)' }} />
          <img src={client.logo} alt={client.name} className="relative h-10 w-auto self-start object-cover" />
          <div className="relative flex max-w-[454px] flex-col items-start gap-8">
            <h3 className="cms-about-desc cms-headline cms-ss">{client.description}</h3>
            <Button variant="arrow" href={client.website || undefined} {...extProps(client.website)}>Visit Website</Button>
          </div>
        </div>
        <div className="cms-info flex h-[432px] w-full min-w-0 flex-col gap-6 rounded-[24px] border border-solid border-[rgb(235,235,235)] bg-white p-8 md:flex-1">
          {rows.map((r) => (
            <div key={r.label} className="contents">
              <div className="flex justify-between gap-4 text-[18px] font-medium leading-6 tracking-[-0.18px]">
                <span className="text-grey-550">{r.label}</span>
                <span className="text-right text-ink">{r.values.join(', ')}</span>
              </div>
              <Divider />
            </div>
          ))}
          {products && (
            <div className="flex flex-col gap-4">
              <span className="text-[18px] font-medium leading-6 tracking-[-0.18px] text-black">{products.label}</span>
              <div className="flex flex-wrap gap-4">
                {products.values.map((v, i) => <Pill key={v} label={v} icon={products.icons?.[i]} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// §4 case-study template
function Study({ cs }) {
  useCmsMeta(cs.docTitle, CASE_DESCRIPTION)
  const [crumbRoot, crumbLeaf] = cs.breadcrumb
  return (
    <main className="bg-white">
      <section className="mx-auto flex max-w-container flex-col items-start gap-[60px] px-5 pt-[156px]">
        <header className="flex w-full flex-col gap-6">
          <nav className="flex items-center gap-1 text-[14px] font-medium leading-5 tracking-[-0.084px]" aria-label="Breadcrumb">
            <a href="/case-studies" className="cms-crumb">{crumbRoot}</a>
            <span className="text-[#666]">/</span>
            <span className="text-[#666]">{crumbLeaf}</span>
          </nav>
          <h1 className="cms-title-48 cms-headline cms-ss text-ink">{cs.title}</h1>
          <p className="m-0 max-w-[800px] text-[18px] font-medium leading-6 tracking-[-0.18px] text-ink">{cs.subtitle}</p>
          <Divider />
          <div className="flex flex-wrap gap-3">
            {cs.pills.map((p) => <Pill key={p.label} label={p.label} icon={p.icon} />)}
          </div>
        </header>
        <div className="cms-ring16 w-full">
          <img src={cs.banner} alt="" width={cs.bannerWidth} height={cs.bannerHeight} className="h-auto w-full object-cover" />
        </div>
        <Stats stats={cs.stats} />
        <div className="flex w-full flex-col gap-10">
          <RichText blocks={cs.blocks} />
          <About cs={cs} />
        </div>
      </section>
      <CTA />
    </main>
  )
}

export default function CaseStudy() {
  const { slug } = useParams()
  const cs = caseStudies.find((c) => c.slug === slug)
  return cs ? <Study key={cs.slug} cs={cs} /> : <NotFound />
}
