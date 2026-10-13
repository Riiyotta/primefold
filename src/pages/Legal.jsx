import CTA from '../components/CTA'
import usePageMeta from './company/usePageMeta'
import CONTENT from './legal/content'
import './legal/legal.css'

const PRESET = { imprint: 'legal-prose--imprint', 'data-privacy': 'legal-prose--dp', 'terms-of-service': 'legal-prose--tos' }

function Block({ b }) {
  switch (b.t) {
    case 'spacer':
      return <div className="legal-spacer" aria-hidden="true" />
    case 'empty':
      return <p><br /></p>
    case 'ul':
    case 'ol': {
      const List = b.t
      return (
        <List>
          {b.items.map((html, i) => (
            <li key={i}><p dangerouslySetInnerHTML={{ __html: html }} /></li>
          ))}
        </List>
      )
    }
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h6': {
      const H = b.t
      // trailing <br>s in the original render as empty extra lines; the ZWSP keeps the last one from collapsing
      const tail = b.extraLines ? '<br>'.repeat(b.extraLines) + '&#8203;' : ''
      return <H dangerouslySetInnerHTML={{ __html: b.html + tail }} />
    }
    default:
      return <p dangerouslySetInnerHTML={{ __html: b.html }} />
  }
}

// specs/company-careers-legal.md §C — shared template for /imprint, /data-privacy, /terms-of-service
export default function Legal({ page = 'imprint' }) {
  const c = CONTENT[page] || CONTENT.imprint
  usePageMeta(c.docTitle, c.description)
  return (
    <main className="flex w-full flex-col items-center overflow-clip bg-white">
      <section id="scroll-hero" className="flex w-full max-w-[1600px] flex-col items-start justify-center gap-[120px] px-6 pb-[120px] pt-[152px] md:px-20">
        <div className="flex w-full flex-col items-center">
          <div className="w-full max-w-[768px]">
            <h1 className="legal-title">{c.title}</h1>
          </div>
          <div className={`legal-prose ${PRESET[page] || ''} w-full max-w-[768px]`} style={{ marginTop: c.bodyGap }}>
            {c.blocks.map((b, i) => <Block key={i} b={b} />)}
          </div>
        </div>
      </section>
      <div className="w-full">
        <CTA />
      </div>
    </main>
  )
}
