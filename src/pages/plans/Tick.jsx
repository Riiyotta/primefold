import MaskIcon from '../shared-info/MaskIcon'
const tick = '/assets/pages/plans/icon-tick-16.svg'
const cross = '/assets/pages/plans/icon-cross-16.svg'

// 20x20 teal tick circle (§1.2)
export function Tick() {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-[100px] bg-[rgba(39,168,150,.24)] p-[2px]">
      <MaskIcon src={tick} size={16} color="rgb(39,168,150)" />
    </span>
  )
}

// 24x24 grey cross (§1.3)
export function Cross() {
  return <MaskIcon src={cross} size={24} color="rgb(162,158,152)" />
}

// Small ring pill (plan tag / quarter tag)
export function Pill({ bg = '#fff', className = '', children }) {
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-full px-2 py-1 text-[12px] font-medium leading-4 text-ink ${className}`}
      style={{ backgroundColor: bg, boxShadow: '0 0 0 1px rgba(0,0,0,.08)' }}
    >
      {children}
    </span>
  )
}
