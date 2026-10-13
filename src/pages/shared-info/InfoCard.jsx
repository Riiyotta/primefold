import MaskIcon from './MaskIcon'

// Spec 0.6 "Info card" (Variant 1) — Plans "In every plan" + Security "Three things". No hover state.
export default function InfoCard({ icon, title, children }) {
  return (
    <div
      className="flex flex-col rounded-[12px] bg-[rgb(250,250,249)] p-6"
      style={{ boxShadow: '0 0 0 1px rgba(0,0,0,.08), 0 1px 2px 0 rgba(36,36,36,.04)' }}
    >
      <div className="flex flex-col gap-4">
        <MaskIcon src={icon} size={24} />
        <h3 className="m-0 text-[16px] font-medium leading-6 tracking-[-0.16px] text-ink-2">{title}</h3>
      </div>
      <p className="m-0 mt-[10px] text-[14px] leading-5 tracking-[-0.084px] text-grey-600">{children}</p>
    </div>
  )
}
