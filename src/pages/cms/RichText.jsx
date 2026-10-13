import Button from '../../components/shared/Button'
import { Inline, extProps } from './shared'

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// §4.5 numbered-card badge schemes, in order
const BADGES = [
  { bg: 'rgba(32,131,116,.24)', fg: 'rgb(63,209,188)' },
  { bg: 'rgba(202,123,87,.24)', fg: 'rgb(249,157,114)' },
  { bg: 'rgba(255,255,255,.24)', fg: '#fff' },
]

function Heading({ tag: Tag, text, id }) {
  return (
    <Tag id={id}>
      <a href={`#${id}`} className="cms-anchor">{text}</a>
    </Tag>
  )
}

function QuoteCard({ b }) {
  return (
    <div className="cms-quote-card">
      <h3 className="cms-headline cms-ss cms-h3-size m-0 text-ink" style={{ fontWeight: 300, letterSpacing: 0 }}>
        <Inline text={b.quote} />
      </h3>
      <div className="flex flex-col">
        <p className="m-0 text-[18px] font-medium leading-6 tracking-[-0.18px] text-ink">{b.author}</p>
        <p className="m-0 text-[16px] leading-6 tracking-[-0.16px] text-[rgb(40,38,34)] opacity-80">{b.role}</p>
      </div>
    </div>
  )
}

function NumberedCards({ b }) {
  return (
    <div className="cms-numbered">
      {b.cards.map((c, i) => {
        const s = BADGES[i % BADGES.length]
        return (
          <div
            key={c.n}
            className="flex flex-col items-start gap-6 rounded-[24px] bg-panel-1 p-8"
            style={{ boxShadow: '0 0 0 1.6px rgba(0,0,0,.08)' }}
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-[18px] font-medium leading-6 tracking-[-0.18px]"
              style={{ background: s.bg, color: s.fg }}
            >
              {c.n}
            </span>
            <p className="m-0 text-[24px] font-medium leading-8 tracking-[-0.02em] text-white">{c.title}</p>
            <p className="m-0 text-[14px] font-medium leading-5 tracking-[-0.084px] text-a1-text-2">
              <Inline text={c.body} />
            </p>
          </div>
        )
      })}
    </div>
  )
}

// Ordered block list → Framer rich text (spec §3.4 / §4.5)
export default function RichText({ blocks }) {
  const used = {}
  const uniqueId = (text) => {
    const base = slugify(text) || 'section'
    used[base] = (used[base] || 0) + 1
    return used[base] > 1 ? `${base}-${used[base]}` : base
  }
  return (
    <div className="cms-rt">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'p':
            return <p key={i}><Inline text={b.text} /></p>
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6':
            return <Heading key={i} tag={b.type} text={b.text} id={uniqueId(b.text)} />
          case 'spacer': {
            const Tag = b.tag
            return <Tag key={i} aria-hidden="true"><br /></Tag>
          }
          case 'ul':
          case 'ol': {
            const Tag = b.type
            return (
              <Tag key={i}>
                {b.items.map((t, j) => <li key={j}><Inline text={t} /></li>)}
              </Tag>
            )
          }
          case 'quote':
            return <blockquote key={i}><Inline text={b.text} /></blockquote>
          case 'img':
            return <img key={i} src={b.src} alt={b.alt} width={b.width} height={b.height} loading="lazy" />
          case 'video':
            return (
              <div key={i} className="cms-video cms-ring24" role="img" aria-label="Video (YouTube embed placeholder)">
                <span className="cms-play" aria-hidden="true" />
              </div>
            )
          case 'button':
            return (
              <div key={i} className="cms-btn-block">
                {b.variant === 'primary' ? (
                  <a href={b.href || undefined} className="cms-btn-primary" {...extProps(b.href)}>{b.label}</a>
                ) : (
                  <Button variant="black" href={b.href || undefined} className="w-full" {...extProps(b.href)}>{b.label}</Button>
                )}
              </div>
            )
          case 'quoteCard':
            return <QuoteCard key={i} b={b} />
          case 'numberedCards':
            return <NumberedCards key={i} b={b} />
          default:
            return null
        }
      })}
    </div>
  )
}
