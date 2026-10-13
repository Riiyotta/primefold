import Eyebrow from '../../components/shared/Eyebrow'

// Page-local mask copies (public/assets originals are malformed XML — trailing junk after </svg>)
const evidence = '/assets/pages/company/mask-commit-evidence.svg'
const conversational = '/assets/pages/company/mask-commit-conversational.svg'
const privacy = '/assets/pages/company/mask-commit-privacy.svg'
const closeToWork = '/assets/pages/company/mask-commit-close-to-work.svg'

// spec A2
const ITEMS = [
  { icon: evidence, title: 'Evidence first', body: 'Every answer points back to the material it came from.' },
  { icon: conversational, title: 'Conversational by design', body: 'Start with the question, not a dashboard. Keep asking until the answer is clear.' },
  { icon: privacy, title: 'Privacy by architecture', body: 'Privacy and data separation are built in from the start, not added later.' },
  { icon: closeToWork, title: 'Close to your work', body: 'Built around how you work, in the language you use.' },
]

export default function Commitments() {
  return (
    <section className="flex w-full flex-col items-center gap-8 bg-white pb-[88px] md:gap-14">
      <div className="w-full max-w-[1320px] px-5 pt-20 md:pt-[88px]">
        <div className="flex max-w-[565px] flex-col gap-4">
          <Eyebrow>How we work</Eyebrow>
          <h2 className="t-h2 m-0">Four commitments.</h2>
        </div>
      </div>
      <div className="grid w-full max-w-[1320px] grid-cols-1 gap-6 px-5 md:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((it) => (
          <div
            key={it.title}
            className="flex flex-col gap-[10px] rounded-xl bg-[rgb(250,250,249)] p-6"
            style={{ boxShadow: '0 0 0 1px rgba(0,0,0,.08), 0 1px 2px 0 rgba(36,36,36,.04)' }}
          >
            <div className="flex flex-col gap-4">
              <span
                className="block h-6 w-6 bg-ink"
                style={{ WebkitMask: `url(${it.icon}) center/contain no-repeat`, mask: `url(${it.icon}) center/contain no-repeat` }}
                aria-hidden="true"
              />
              <h3 className="m-0 text-[16px] font-medium leading-6 tracking-[-0.16px] text-ink-2">{it.title}</h3>
            </div>
            <p className="m-0 text-[14px] font-normal leading-5 tracking-[-0.084px] text-grey-600">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
