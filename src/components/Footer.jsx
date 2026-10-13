import { useEffect, useRef } from 'react'
import './footer/footer.css'

// CLONE_SPEC 10 — Footer (Desktop / Tablet / Phone)
const COLUMNS = [
  { head: 'Products', links: [['Experience Intelligence', '/experience-intelligence'], ['Real Estate Intelligence', '/realestate-intelligence']] },
  { head: 'Explore', links: [['How it works', '/'], ['Plans', '/plans'], ['Security', '/security']] },
  { head: 'Resources', links: [['Blog', '/blog'], ['Help Center XI', 'https://help.primefold.ai/xi'], ['Help Center RI', 'https://help.primefold.ai/ri']] },
  { head: 'Company', links: [['About', '/company'], ['Careers', '/careers'], ['Contact', '/contact']] },
]
const LEGAL = [['Imprint', '/imprint'], ['Data privacy', '/data-privacy'], ['Terms of service', '/terms-of-service']]
// Icon paths copied from public/assets/svg/social-*.svg (those files carry a trailing '"), no' extraction
// artefact that makes them invalid as CSS masks), rendered with currentColor instead of a mask.
const SOCIAL = [
  ['X', 'https://x.com/primefoldai', 'M 10.383 0 L 7.053 3.807 L 4.173 0 L 0 0 L 4.985 6.517 L 0.261 11.917 L 2.283 11.917 L 5.929 7.75 L 9.116 11.917 L 13.184 11.917 L 7.988 5.047 L 12.405 0 Z M 9.674 10.707 L 2.361 1.146 L 3.563 1.146 L 10.794 10.706 Z', 'translate(1.408 2.042)'],
  ['LinkedIn', 'https://www.linkedin.com/company/primefold/', 'M 10.667 0 C 11.02 0 11.359 0.14 11.609 0.391 C 11.86 0.641 12 0.98 12 1.333 L 12 10.667 C 12 11.02 11.86 11.359 11.609 11.609 C 11.359 11.86 11.02 12 10.667 12 L 1.333 12 C 0.98 12 0.641 11.86 0.391 11.609 C 0.14 11.359 0 11.02 0 10.667 L 0 1.333 C 0 0.98 0.14 0.641 0.391 0.391 C 0.641 0.14 0.98 0 1.333 0 Z M 10.333 10.333 L 10.333 6.8 C 10.333 6.224 10.104 5.671 9.697 5.263 C 9.289 4.856 8.736 4.627 8.16 4.627 C 7.593 4.627 6.933 4.973 6.613 5.493 L 6.613 4.753 L 4.753 4.753 L 4.753 10.333 L 6.613 10.333 L 6.613 7.047 C 6.613 6.533 7.027 6.113 7.54 6.113 C 7.788 6.113 8.025 6.212 8.2 6.387 C 8.375 6.562 8.473 6.799 8.473 7.047 L 8.473 10.333 Z M 2.587 3.707 C 2.884 3.707 3.169 3.589 3.379 3.379 C 3.589 3.169 3.707 2.884 3.707 2.587 C 3.707 1.967 3.207 1.46 2.587 1.46 C 2.288 1.46 2.001 1.579 1.79 1.79 C 1.579 2.001 1.46 2.288 1.46 2.587 C 1.46 3.207 1.967 3.707 2.587 3.707 Z M 3.513 10.333 L 3.513 4.753 L 1.667 4.753 L 1.667 10.333 Z', 'translate(2 2)'],
  ['Mail', '/contact', 'M 1.333 10.667 C 0.967 10.667 0.653 10.536 0.392 10.275 C 0.131 10.014 0 9.7 0 9.333 L 0 1.333 C 0 0.967 0.131 0.653 0.392 0.392 C 0.653 0.131 0.967 0 1.333 0 L 12 0 C 12.367 0 12.681 0.131 12.942 0.392 C 13.203 0.653 13.334 0.967 13.333 1.333 L 13.333 9.333 C 13.333 9.7 13.203 10.014 12.942 10.275 C 12.681 10.537 12.367 10.667 12 10.667 Z M 6.667 6 L 1.333 2.667 L 1.333 9.333 L 12 9.333 L 12 2.667 Z M 6.667 4.667 L 12 1.333 L 1.333 1.333 Z M 1.333 2.667 L 1.333 1.333 L 1.333 9.333 Z', 'translate(1.333 2.667)'],
]
const TRIGGER_H = 200 // "Footer Trigger" marker: last 200px of the page

// Cookie Settings re-opens the consent dialog (CookieBanner listens for this event)
const openCookieSettings = () => window.dispatchEvent(new CustomEvent('pf:cookie-settings'))

export default function Footer() {
  const markRef = useRef(null)

  // Ghost wordmark opacity: 0.2 -> 1 as the 200px Footer Trigger at the end of the page scrolls into view
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const doc = document.documentElement
      const bottom = window.scrollY + window.innerHeight
      const p = Math.min(1, Math.max(0, (bottom - (doc.scrollHeight - TRIGGER_H)) / TRIGGER_H))
      if (markRef.current) markRef.current.style.opacity = String(0.2 + 0.8 * p)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <footer className="relative flex w-full flex-col items-center overflow-clip">
      <div
        className="relative z-[1] flex w-full flex-col items-center rounded-b-[24px] bg-white px-5 pt-16"
        style={{ boxShadow: '0 0 0 1px rgb(226,226,226)' }}
      >
        <div className="flex w-full max-w-[1280px] flex-col items-start">
          {/* Columns */}
          <div className="flex w-full flex-col items-start gap-16 pb-4 md:flex-row md:flex-wrap md:pb-16">
            <div className="flex w-full flex-col items-start gap-5 md:w-[320px]">
              <a href="/" className="flex items-center" aria-label="Primefold home">
                <img src="/assets/svg/logo-dark.svg" alt="Primefold" width="116" height="22" className="h-[22px] w-[116px]" />
              </a>
              <p className="m-0 w-full text-[14px] leading-5 tracking-[-0.084px] text-grey-600">
                One intelligence. Built for every field.<br /><br />Stay in the loop. Update on what&apos;s new.
              </p>
              <form
                className="flex h-12 w-full items-center gap-2 rounded-full bg-white py-[6px] pl-4 pr-[6px] md:w-[320px]"
                style={{ boxShadow: 'inset 0 0 0 1px rgb(226,226,226)' }}
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="flex h-7 min-w-0 flex-1 items-center overflow-hidden rounded-[10px] p-1">
                  <input
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    aria-label="Email address"
                    className="ft-input h-5 w-full min-w-0 border-0 bg-transparent p-0 font-inter text-[14px] leading-5 text-[rgb(68,66,62)] outline-none"
                  />
                </div>
                <button type="submit" className="flex h-9 w-[100px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-ink px-4 py-2 text-[13px] font-medium leading-4 text-white">
                  Subscribe
                </button>
              </form>
            </div>
            <div className="flex w-full flex-col items-start gap-10 md:grid md:w-auto md:min-w-0 md:flex-1 md:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] md:gap-x-16 md:gap-y-10 lg:flex lg:flex-row lg:flex-wrap lg:justify-end">
              {COLUMNS.map((col) => (
                <div key={col.head} className="flex flex-col items-start gap-4">
                  <p className="m-0 text-[16px] font-medium leading-6 tracking-[-0.16px] text-ink">{col.head}</p>
                  <div className="flex flex-col items-start gap-3">
                    {col.links.map(([label, href]) => (
                      <p key={label} className="m-0 h-5 whitespace-nowrap text-[14px] leading-5 tracking-[-0.084px]">
                        <a href={href} className="ft-link">{label}</a>
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-divider" />

          {/* Legal & Social */}
          <div className="flex w-full flex-wrap items-center gap-y-6 py-5 md:justify-between md:gap-y-0">
            <p className="order-last m-0 text-[12px] leading-4 text-grey-600 md:order-none">© 2026 saypien GmbH · Berlin &amp; Frankfurt</p>
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                {LEGAL.map(([label, href]) => (
                  <p key={label} className="m-0 whitespace-nowrap text-[12px] leading-4"><a href={href} className="ft-link">{label}</a></p>
                ))}
                <button type="button" onClick={openCookieSettings} className="ft-link cursor-pointer whitespace-nowrap border-0 bg-transparent p-0 font-inter text-[12px] leading-4">
                  Cookie Settings
                </button>
              </div>
              <div className="flex items-center gap-4">
                {SOCIAL.map(([label, href, d, transform]) => (
                  <a key={label} href={href} aria-label={label} className="ft-social" {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})}>
                    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d={d} transform={transform} fill="currentColor" /></svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-divider" />

          {/* Bottom */}
          <div className="flex w-full items-center pb-6 pt-4">
            <div className="flex items-center gap-2 md:gap-3">
              <img src="/assets/svg/icon-flag-de-footer.svg" alt="" width="20" height="15" className="h-[15px] w-5" />
              <p className="m-0 text-[12px] leading-4 text-grey-600">Hosted in Germany · Built to GDPR requirements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ghost Wordmark: sticky under the Footer Content, revealed as the page bottoms out */}
      <div className="sticky bottom-0 flex h-16 w-full flex-col items-center overflow-clip px-5 pt-6 md:h-[140px] md:pt-8 lg:h-[200px]">
        <div ref={markRef} className="overflow-clip" style={{ width: 'min(100vw - 40px, 1280px)', opacity: 0.2 }}>
          <img src="/assets/L5IVS7Cn2X7mzYJB2j1MVEECRKk.svg" alt="" aria-hidden="true" className="block h-auto w-full" />
        </div>
      </div>
    </footer>
  )
}
