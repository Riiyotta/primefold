import Eyebrow from '../../components/shared/Eyebrow'

// Spec 0.6 "Section title row": max-width 1320, padding 88px 20px 0 (phone 80px 20px 0),
// row / justify-between / align flex-end (phone: column). Left block max 565 gap 16; optional lead under the H2
// (`lead`) or bottom-aligned on the right (`side`, max 428).
export default function SectionTitle({ eyebrow, title, lead, side }) {
  return (
    <div className="mx-auto box-border flex w-full max-w-container flex-col px-5 pt-20 md:flex-row md:items-end md:justify-between md:pt-[88px]">
      <div className="flex w-full max-w-[565px] flex-col gap-4 md:min-w-0 md:flex-1">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="t-h2 m-0">{title}</h2>
        {lead && <p className="t-lead m-0 max-w-[428px]">{lead}</p>}
      </div>
      {side && <p className="t-lead m-0 w-full max-w-[428px] md:min-w-0 md:flex-1">{side}</p>}
    </div>
  )
}
