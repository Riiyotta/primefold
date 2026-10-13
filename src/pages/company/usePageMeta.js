import { useEffect } from 'react'

// Per-page <title> + meta description (specs/company-careers-legal.md A/B/C tables).
export default function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title
    if (!description) return
    let tag = document.querySelector('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'description')
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', description)
  }, [title, description])
}
