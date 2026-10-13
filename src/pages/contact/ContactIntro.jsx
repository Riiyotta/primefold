import Eyebrow from '../../components/shared/Eyebrow'
import MaskIcon from '../shared-info/MaskIcon'
const iconMail = '/assets/pages/contact/icon-mail.svg'
const iconCalendar = '/assets/pages/contact/icon-calendar.svg'
const iconLinkedin = '/assets/pages/contact/icon-linkedin.svg'

const CALENDLY = 'https://calendly.com/d/dv3b-wwt-mfy/talk-to-primefold'
const LINKS = [
  { icon: iconMail, color: 'rgb(26,24,20)', title: 'support@primefold.ai', sub: 'General enquiries and support.', href: 'mailto:support@primefold.ai' },
  { icon: iconCalendar, color: 'rgb(26,24,20)', title: 'Book a 20-minute call', sub: 'Straight into the calendar.', href: CALENDLY, external: true },
  { icon: iconLinkedin, color: 'rgb(9,102,194)', title: 'LinkedIn', sub: 'Fastest if we have already met.', href: 'https://www.linkedin.com/company/primefold/', external: true },
]

// §3.1 left column
export default function ContactIntro() {
  return (
    <div className="flex w-full flex-col gap-5 md:w-auto md:min-w-0 md:flex-[1_0_0px]">
      <div className="flex flex-col gap-4">
        <Eyebrow>Contact</Eyebrow>
        <h1 className="font-headline m-0 text-[42px] font-normal leading-[50.4px] tracking-[.84px] text-ink-2 md:text-[48px] md:leading-[57.6px] md:tracking-[.96px] lg:text-[56px] lg:leading-[67.2px] lg:tracking-[1.12px]">
          Let's start with your question.
        </h1>
        <p className="t-lead m-0">Tell us what you're working on. A person will get back to you.</p>
      </div>
      <div className="flex w-[350px] max-w-full flex-col gap-2">
        {LINKS.map((l) => (
          <a
            key={l.title}
            href={l.href}
            {...(l.external ? { target: '_blank', rel: 'noopener' } : {})}
            className="box-border flex h-[74px] flex-col gap-[6px] overflow-clip rounded-[12px] bg-[rgba(255,255,255,.12)] p-4 no-underline transition-[background-color] duration-[250ms] ease-[cubic-bezier(.44,0,.56,1)] hover:bg-page-alt"
            style={{ boxShadow: '0 0 0 1px rgba(0,0,0,.08)' }}
          >
            <span className="flex items-center gap-2">
              <MaskIcon src={l.icon} size={20} color={l.color} />
              <span className="text-[14px] font-medium leading-5 tracking-[-0.14px] text-[#2C2C2C]">{l.title}</span>
            </span>
            <span className="pl-7 text-[12px] leading-4 text-grey-550">{l.sub}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
