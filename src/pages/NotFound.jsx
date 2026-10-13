import CTA from '../components/CTA'
import Eyebrow from '../components/shared/Eyebrow'
import Button from '../components/shared/Button'
import usePageMeta from './shared-info/usePageMeta'
import { CONTACT_META } from './Contact'

// specs/plans-security-contact-404.md §4. Title/description copied from /contact (live-site quirk).
// Phone padding is 44px 20px (live-site value; content sits under the 80px nav).
export default function NotFound() {
  usePageMeta(...CONTACT_META)
  return (
    <>
      <main className="bg-white">
        <section className="mx-auto box-border flex w-full max-w-container items-center justify-center bg-white px-5 py-11 md:min-h-screen md:py-[168px]">
          <div className="flex w-full max-w-[600px] flex-col items-center gap-4 text-center">
            <Eyebrow className="justify-center">OOOPPS!</Eyebrow>
            <h1 className="font-headline m-0 text-[42px] font-normal leading-[50.4px] tracking-[.84px] text-ink-2 md:text-[48px] md:leading-[57.6px] md:tracking-[.96px] lg:text-[56px] lg:leading-[67.2px] lg:tracking-[1.12px]">
              404!
            </h1>
            <h2 className="t-h2 m-0 text-center">Nothing to see here.</h2>
            <p className="t-lead m-0 text-center">The page you’re looking for may have moved, changed, or no longer exists.</p>
            <Button variant="black" href="/">Back to homepage</Button>
          </div>
        </section>
      </main>
      <CTA />
    </>
  )
}
