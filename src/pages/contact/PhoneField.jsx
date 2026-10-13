import { useEffect, useMemo, useRef, useState } from 'react'
import { COUNTRIES, flag } from './countries'

// §3.1 Phone: custom country-code combobox + tel input. Default Germany +49.
const DEFAULT = COUNTRIES.find(([n]) => n === 'Germany')

export default function PhoneField({ fieldClass }) {
  const [country, setCountry] = useState(DEFAULT)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [number, setNumber] = useState('')
  const root = useRef(null)
  const search = useRef(null)

  useEffect(() => {
    if (!open) return
    search.current?.focus()
    const onDown = (e) => { if (!root.current?.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COUNTRIES
    return COUNTRIES.filter(([n, iso, dial]) => n.toLowerCase().includes(q) || dial.includes(q) || iso.toLowerCase() === q)
  }, [query])

  const pick = (c) => {
    setCountry(c)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={root} className="relative">
      <div className={`${fieldClass} box-border flex h-[46px] items-center !bg-white p-3`} style={{ boxShadow: '0 0 0 1px rgba(34,34,34,.12)' }}>
        <div
          role="combobox"
          tabIndex={0}
          aria-label="Country code"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls="pf-country-listbox"
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); setOpen(true) }
          }}
          className="flex shrink-0 cursor-pointer items-center outline-none"
        >
          <span className="text-[18px] leading-[1.2]">{flag(country[1])}</span>
          <span className="ml-2 text-[14px] leading-[1.2] tracking-[-0.14px] text-ink">{country[2]}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mx-2 block shrink-0 text-grey-550" aria-hidden="true">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <input
          type="tel"
          name="Phone Number"
          placeholder="1512 3456789"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="min-w-0 flex-1 border-0 bg-transparent p-0 pl-2 text-[14px] leading-[1.2] text-ink outline-none placeholder:text-[#616161]"
        />
        <input type="hidden" name="Full Phone Number" value={number ? `${country[2]} ${number}` : ''} />
      </div>

      {open && (
        <div
          className="absolute left-0 top-full z-[7] mt-2 box-border flex h-[200px] w-full flex-col overflow-hidden rounded-[10px] border border-solid border-nav-border bg-white"
          style={{ boxShadow: '0 4px 8px rgba(43,43,43,.35)' }}
        >
          <div className="p-2">
            <input
              ref={search}
              type="text"
              placeholder="Search countries..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="box-border block w-full rounded-[10px] border border-solid border-nav-border bg-nav-border px-3 py-2 text-[14px] leading-[1.2] tracking-[-0.01em] text-ink outline-none"
            />
          </div>
          <div id="pf-country-listbox" role="listbox" aria-label="Countries" className="min-h-0 flex-1 overflow-y-scroll px-2 pb-2" data-lenis-prevent>
            {list.map((c) => (
              <div
                key={c[1]}
                role="option"
                aria-selected={c[1] === country[1]}
                onClick={() => pick(c)}
                className="box-border flex h-[43px] cursor-pointer items-center gap-2 rounded-[8px] px-4 py-3 text-[14px] leading-[1.2] text-black"
              >
                <span>{flag(c[1])}</span>
                <span>{c[0]}</span>
                <span>{c[2]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
