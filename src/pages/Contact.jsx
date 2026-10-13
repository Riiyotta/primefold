import CTA from '../components/CTA'
import usePageMeta from './shared-info/usePageMeta'
import ContactIntro from './contact/ContactIntro'
import ContactForm from './contact/ContactForm'

export const CONTACT_META = [
  'Contact — Primefold',
  'Tell us what you want to find out. Send us a message — a person replies. Or reach us at support@primefold.ai.',
]

// specs/plans-security-contact-404.md §3. Phone padding-top is 44px (live-site value; content sits under the 80px nav).
export default function Contact() {
  usePageMeta(...CONTACT_META)
  return (
    <>
      <main className="bg-white">
        <section className="mx-auto box-border flex w-full max-w-container flex-col gap-8 bg-white px-5 py-11 md:flex-row md:items-stretch md:gap-x-14 md:pb-[88px] md:pt-[168px]">
          <ContactIntro />
          <ContactForm />
        </section>
      </main>
      <CTA variant="roles" />
    </>
  )
}
