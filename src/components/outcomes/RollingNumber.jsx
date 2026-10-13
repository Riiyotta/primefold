import { useEffect, useRef } from 'react'

// Digit roll (CLONE_SPEC 8): each char is an 88px overflow-hidden column holding the same
// glyph 4x; on first in-view (+100ms) the stack moves 0 -> -264px over .5s
// ease [.25,.46,.45,.94], delayed .1s per char, glyphs blur 0 -> 2 -> 2 -> 0 at [0,.2,.8,1].
// Clicking restarts.
const ROW = 88
const COPIES = 4
const DURATION = 500
const START_DELAY = 100
const STAGGER = 100
const EASE = 'cubic-bezier(.25,.46,.45,.94)'

export default function RollingNumber({ value }) {
  const rootRef = useRef(null)
  const anims = useRef([])

  const run = () => {
    anims.current.forEach((a) => a.cancel())
    anims.current = []
    const cols = rootRef.current.querySelectorAll('[data-col]')
    cols.forEach((col) => {
      const i = Number(col.dataset.col)
      const delay = START_DELAY + i * STAGGER
      anims.current.push(col.animate(
        [{ transform: 'translateY(0px)' }, { transform: `translateY(${-ROW * (COPIES - 1)}px)` }],
        { duration: DURATION, delay, easing: EASE, fill: 'both' },
      ))
      col.querySelectorAll('span').forEach((g) => {
        anims.current.push(g.animate(
          [
            { filter: 'blur(0px)', offset: 0 },
            { filter: 'blur(2px)', offset: 0.2 },
            { filter: 'blur(2px)', offset: 0.8 },
            { filter: 'blur(0px)', offset: 1 },
          ],
          { duration: DURATION, delay, easing: 'ease-out', fill: 'both' },
        ))
      })
    })
  }

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { run(); io.disconnect() }
    })
    io.observe(rootRef.current)
    return () => { io.disconnect(); anims.current.forEach((a) => a.cancel()) }
  }, [])

  return (
    <div
      ref={rootRef}
      onClick={run}
      className="flex h-[88px] cursor-default items-center overflow-hidden"
    >
      <span className="sr-only">{value}</span>
      <div className="flex items-center gap-[0.05em] font-favorit text-[80px] font-[350] leading-[88px] tracking-[-0.03em] text-white [font-feature-settings:'ss11'_on]" aria-hidden="true">
        {Array.from(value).map((ch, k) => {
          if (ch === ' ') return <div key={k} className="h-[88px] w-[0.25em] shrink-0" />
          return (
            <div key={k} className="flex h-[88px] shrink-0 justify-center overflow-hidden">
              <div data-col={k} className="flex flex-col items-center">
                {Array.from({ length: COPIES }).map((_, j) => (
                  <span key={j} className="flex h-[88px] items-center justify-center">{ch}</span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
