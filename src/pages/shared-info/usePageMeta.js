import { useEffect } from 'react'

// Per-page <title> + meta description (specs/plans-security-contact-404.md). Restores the previous values on unmount.
export default function usePageMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title
    let meta = document.querySelector('meta[name="description"]')
    const created = !meta
    if (created) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    const prevDesc = meta.getAttribute('content')
    document.title = title
    meta.setAttribute('content', description)
    return () => {
      document.title = prevTitle
      if (created) meta.remove()
      else meta.setAttribute('content', prevDesc ?? '')
    }
  }, [title, description])
}
