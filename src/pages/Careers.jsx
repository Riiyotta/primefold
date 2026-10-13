import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import CTA from '../components/CTA'
import CareersHero from './careers/CareersHero'
import OpenRoles from './careers/OpenRoles'
import usePageMeta from './company/usePageMeta'

// specs/company-careers-legal.md §B
export default function Careers() {
  usePageMeta(
    'Careers — Primefold',
    "Come build what's next. Join a remote-first team of AI pioneers, builders and thinkers shaping the next generation of business intelligence.",
  )

  // Arriving from another page via /careers#roles: Layout resets scroll to 0 on route change, so jump to the anchor afterwards.
  const { hash } = useLocation()
  useEffect(() => {
    if (hash !== '#roles') return
    const id = requestAnimationFrame(() => {
      const el = document.getElementById('roles')
      if (!el) return
      if (window.__lenis) window.__lenis.scrollTo(el, { immediate: true, force: true })
      else el.scrollIntoView()
    })
    return () => cancelAnimationFrame(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="flex w-full flex-col items-center overflow-clip bg-white">
      <CareersHero />
      <OpenRoles />
      <div className="w-full">
        <CTA variant="roles" />
      </div>
    </main>
  )
}
