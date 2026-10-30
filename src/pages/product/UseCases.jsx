import { useEffect, useRef, useState } from 'react'

// specs/product-pages.md §2b — sticky "Used by" panel + scroll-highlighted list.
// 6 invisible 20x1 markers in a 1x900 column (space-between → 180px apart) starting 300px below the section top.
// Item n → opacity 1 when marker n crosses the trigger line, back to .4 when marker n+1 does; last stays on.
// Trigger line: the spec says "viewport middle", but the measured activation scrollYs (1620/1820/2020/2170/2370/2520
// with section top 1850 @900 tall) put it at 530–550px, i.e. ~0.6 × viewport height. Re-measured on the live page
// 2026-10-30: ~0.6 at >= 810px, but the viewport middle (0.5; item 2 switches between 460 and 441px of 900) on phones.
const TRIGGER = 0.6
const TRIGGER_PHONE = 0.5

export default function UseCases({ usedBy, items }) {
  const markers = useRef([])
  const [active, setActive] = useState(-1)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const line = window.innerHeight * (window.innerWidth < 810 ? TRIGGER_PHONE : TRIGGER)
      let idx = -1
      markers.current.forEach((m, i) => {
        if (m && m.getBoundingClientRect().top <= line) idx = i
      })
      setActive(idx)
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, [])

  return (
    <div className="pp-uses">
      <div className="pp-uses__markers" aria-hidden="true">
        {items.map((_, i) => (
          <i
            key={i}
            ref={(el) => {
              markers.current[i] = el
            }}
          />
        ))}
      </div>
      <div className="pp-uses__panel">
        <p className="pp-uses__by">
          {['Used by:', ...usedBy].map((l, i) => (i ? [<br key={i} />, l] : l))}
        </p>
        <div className="pp-uses__list">
          {items.map((t, i) => (
            <div key={t} className="pp-uses__item" style={{ opacity: i === active ? 1 : 0.4 }}>
              <h2 className="pp-uses__h font-headline">{t}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
