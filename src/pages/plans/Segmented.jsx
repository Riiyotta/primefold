// Toggle track + segments (§1.1). No sliding thumb: each segment cross-fades its bg/shadow in place
// (Framer tween 0.2s ease). Inactive labels sit at opacity .7 and go to 1 on hover.
const FADE = 'background-color .2s ease, box-shadow .2s ease'

export function Track({ className = '', style, children, label }) {
  return (
    <div role="radiogroup" aria-label={label} className={`flex h-11 rounded-full bg-[rgb(250,250,249)] p-[2px] ${className}`} style={style}>
      {children}
    </div>
  )
}

export function Segment({ active, onClick, children }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className="group flex h-10 shrink-0 cursor-pointer items-center gap-3 whitespace-nowrap rounded-full border-0 px-3 py-[10px] text-[14px] font-medium leading-5 tracking-[-0.084px] text-ink"
      style={{
        backgroundColor: active ? '#fff' : 'rgba(255,255,255,0)',
        boxShadow: active ? '0 0 0 1px rgba(0,0,0,.08)' : '0 0 0 1px rgba(0,0,0,0)',
        transition: FADE,
      }}
    >
      {children}
    </button>
  )
}

// Label that dims to .7 while its segment is inactive (hover → 1).
export function SegLabel({ active, className = '', children }) {
  return (
    <span className={`transition-opacity duration-200 ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'} ${className}`}>
      {children}
    </span>
  )
}
