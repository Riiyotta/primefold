import { useEffect } from 'react'
import Eyebrow from '../../components/shared/Eyebrow'
import './cms.css'

export const CALENDLY = 'https://calendly.com/d/dv3b-wwt-mfy/talk-to-primefold' // same as nav / CTA "Book a call"
const OG_IMAGE = '/assets/kCEvWj6X9M889dINz1Dophu60Y8.png'

// <title>, meta description and og:image per CMS page (spec §0.1). Restores previous values on unmount.
export function useCmsMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title
    const set = (attr, key, value) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`)
      const created = !el
      if (created) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      const prev = el.getAttribute('content')
      el.setAttribute('content', value)
      return () => (created ? el.remove() : el.setAttribute('content', prev ?? ''))
    }
    document.title = title
    const undo = [set('name', 'description', description), set('property', 'og:image', OG_IMAGE)]
    return () => {
      document.title = prevTitle
      undo.forEach((fn) => fn())
    }
  }, [title, description])
}

export const isExternal = (href) => /^https?:\/\//.test(href || '')
export const extProps = (href) => (isExternal(href) ? { target: '_blank', rel: 'noopener' } : {})

// Inline markup used in data.js: ***bold italic***, **bold**, *italic*, [label](href)
const TOKEN = /\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)]*)\)/g
export function Inline({ text }) {
  const out = []
  let last = 0
  let m
  let k = 0
  TOKEN.lastIndex = 0
  while ((m = TOKEN.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1] != null) out.push(<em key={k++}><strong><Inline text={m[1]} /></strong></em>)
    else if (m[2] != null) out.push(<strong key={k++}><Inline text={m[2]} /></strong>)
    else if (m[3] != null) out.push(<em key={k++}><Inline text={m[3]} /></em>)
    else {
      const href = m[5] || undefined
      out.push(<a key={k++} href={href} {...extProps(href)}>{m[4]}</a>)
    }
    last = TOKEN.lastIndex
  }
  if (last < text.length) out.push(text.slice(last))
  return <>{out}</>
}

// Author row: 36px avatar + name/role. No author → Framer's empty-image placeholder (grey circle), no text (§1.3).
export function Author({ author }) {
  return (
    <div className="flex items-center gap-3">
      {author ? (
        <img src={author.avatar} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
      ) : (
        <span className="block h-9 w-9 shrink-0 rounded-full bg-[rgb(235,235,235)]" aria-hidden="true" />
      )}
      {author && (
        <div className="flex flex-col">
          <p className="cms-author-name m-0 font-medium text-ink">{author.name}</p>
          <p className="m-0 text-[12px] leading-4 text-[#666]">{author.role}</p>
        </div>
      )}
    </div>
  )
}

// §4.2 tag pill (optional 20px XI/RI badge)
export function Pill({ label, icon }) {
  return (
    <span
      className={`flex h-9 items-center gap-2 rounded-full bg-[rgb(245,245,241)] py-2 pr-3 text-[14px] font-medium leading-5 tracking-[-0.084px] text-ink ${icon ? 'pl-2' : 'pl-3'}`}
    >
      {icon && <img src={icon} alt="" width="20" height="20" className="h-5 w-5 shrink-0" />}
      <span className="whitespace-nowrap">{label}</span>
    </span>
  )
}

// §1.1 / §2.1 index hero (eyebrow, h1, lead) + slot below (newsletter form / Book a call)
export function IndexHero({ eyebrow, title, lead, children }) {
  return (
    <section className="flex w-full flex-col items-center overflow-clip px-5 pb-[88px] pt-[156px]">
      <div className="flex w-full max-w-[1280px] flex-col items-start gap-5">
        <div className="flex w-full max-w-[570px] flex-col gap-4">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="cms-index-h1 cms-headline cms-ss">{title}</h1>
          <p className="m-0 text-[16px] leading-6 tracking-[-0.16px] text-grey-550">{lead}</p>
        </div>
        {children}
      </div>
    </section>
  )
}
