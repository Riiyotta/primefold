import Eyebrow from '../../components/shared/Eyebrow'
import Button from '../../components/shared/Button'

// spec B2 — CMS rows rendered verbatim (title repeated in meta, h5 and p as on the original)
const ROLES = [
  { title: 'Key Account Manager', location: 'Berlin, Germany, Remote', href: 'https://work-at-saypien.jobs.personio.com/job/2801519' },
  { title: 'Design Engineer', location: 'Remote, Berlin', href: 'https://work-at-saypien.jobs.personio.com/job/2826769' },
  { title: 'Solutions Engineer', location: 'Berlin, Germany, Remote', href: 'https://work-at-saypien.jobs.personio.com/job/2443678' },
  { title: 'Open application', location: 'Remote', href: '/contact' },
]

export default function OpenRoles() {
  return (
    <section id="roles" className="flex w-full justify-center overflow-clip bg-page-alt">
      <div className="flex w-full max-w-[1320px] flex-col gap-8 px-5 py-11 md:py-[88px]">
        {/* Live quirk (spec B2): Framer fixes this wrapper at 128px, so on phone the lead's 2nd line runs under the first job card */}
        <div className="flex h-[128px] flex-col gap-4">
          <Eyebrow>Questions</Eyebrow>
          <h2 className="t-h2 m-0">Where we need people.</h2>
          <p className="t-lead m-0">Explore the roles where you can own the work and see the impact.</p>
        </div>
        <div className="flex w-full flex-col gap-5">
          {ROLES.map((r) => (
            <div key={r.title} className="overflow-clip rounded-xl bg-white p-6" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,.08)' }}>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-1 text-[12px] font-medium leading-4 tracking-normal">
                  <span className="text-teal">{r.title}</span>
                  <span className="text-grey-500">·</span>
                  <span className="text-grey-500">{r.title}</span>
                  <span className="text-grey-500">·</span>
                  <span className="text-grey-500">{r.location}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <h5 className="font-headline m-0 text-[20px] font-normal leading-7 tracking-normal text-ink-2">{r.title}</h5>
                    <p className="m-0 text-[14px] font-normal leading-5 tracking-[-0.084px] text-grey-550">{r.title}</p>
                  </div>
                  <Button variant="black" href={r.href}>Apply</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
