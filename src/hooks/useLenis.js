import { useEffect } from 'react'
import Lenis from 'lenis'

// Framer smooth-scroll settings (CLONE_SPEC 0.6)
export default function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ smoothWheel: true, duration: 1.4, anchors: true, autoRaf: true, allowNestedScroll: true, stopInertiaOnNavigate: true })
    window.__lenis = lenis
    return () => lenis.destroy()
  }, [])
}
