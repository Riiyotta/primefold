// Spec 0.6 XI/RI product badge: 20x20, radius 4, Inter Bold 12.1/18.15 white.
const BG = { XI: 'rgb(32,131,116)', RI: 'rgb(233,116,0)' }

export default function ProductBadge({ product = 'XI' }) {
  return (
    <span
      className="flex size-5 shrink-0 items-center justify-center rounded-[4px] text-[12.1px] font-bold leading-[18.15px] tracking-[-0.121px] text-white"
      style={{ backgroundColor: BG[product] }}
      aria-hidden="true"
    >
      {product}
    </span>
  )
}
