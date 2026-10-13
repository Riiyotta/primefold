import { Suspense, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Route same-origin <a href> clicks through the router so the global Navbar/Footer
// can keep plain anchors. External domains, new-tab links and modified clicks fall through.
function useLinkInterceptor() {
  const navigate = useNavigate()
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest('a[href]')
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname && url.hash) return // in-page anchor → Lenis handles it
      e.preventDefault()
      navigate(url.pathname + url.search + url.hash)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [navigate])
}

function useScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo(0, 0)
  }, [pathname])
}

// Navbar starting state per route (specs/*.md §Navbar). 'white' = solid bar from load, no scroll change.
const WHITE_NAV = new Set(['/plans', '/contact', '/404', '/careers', '/imprint', '/data-privacy', '/terms-of-service'])
const OVERLAY_NAV = new Set(['/', '/company', '/security', '/experience-intelligence', '/realestate-intelligence'])
const navVariant = (pathname) => {
  const p = pathname.replace(/\/+$/, '') || '/'
  if (WHITE_NAV.has(p)) return 'white'
  if (OVERLAY_NAV.has(p)) return 'overlay'
  return 'white' // blog, case studies (indexes + detail pages) and NotFound all use the white bar
}

export default function Layout() {
  useLinkInterceptor()
  useScrollReset()
  const { pathname } = useLocation()
  return (
    <>
      <Navbar key={pathname} variant={navVariant(pathname)} />
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <Outlet />
      </Suspense>
      <Footer />
    </>
  )
}
