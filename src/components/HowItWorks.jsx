import { useEffect, useRef, useState } from 'react'
import Eyebrow from './shared/Eyebrow'
import A1Loop from './how/A1Loop'
import { createSpring } from './how/motion'
import './how/how.css'

const LOGOS = [
  ['ZsKdZVlAf876Rrwiwazp9C1blE.svg', 'webedia logo'],
  ['nlOVPK5FHG0ndiVB0ULwmrzrhGE.svg', 'fischerAppelt logo'],
  ['gw627qb02zAYoAJDKu7MRKA78w.svg', 'SportScheck logo'],
  ['NpVlmnBuOYAIBUDlryGGeWScA.svg', 'SPORTFIVE logo'],
  ['v8lxFvYwzTMiWQaeYGjc7AmMPGc.svg', 'Maggiore Suites logo'],
  ['Ya6ALhQSDRAfUJyHiI9cmYGjdQ.svg', 'ECE logo'],
  ['pcuIABtcyl9aukVdDp5BTRem8.svg', 'NAS Real Investments logo'],
  ['agM8WPiTSSNhSUuc3kD4hKxOVIk.svg', 'Vickii logo'],
  ['GTNtezbGW5utWxjO3br6opPnEXg.svg', 't3n digital pioneers logo'],
  ['zY5XhJUc3an2aLvZT8wHzSzTQ.svg', 'SirPlus logo'],
]

function LogoTicker() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  // appear re-triggers every time (threshold .5)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.5 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <div className={`pf-ticker${inView ? ' is-in' : ''}`} ref={ref}>
      <div className="pf-ticker__track">
        {[0, 1].map((set) =>
          LOGOS.map(([f, alt], i) => (
            <div key={`${set}-${i}`} className="pf-ticker__logo" style={{ '--d': `${i * 0.08}s` }} aria-hidden={set === 1}>
              <img src={`/assets/${f}`} alt={set === 0 ? alt : ''} loading="lazy" />
            </div>
          )),
        )}
      </div>
    </div>
  )
}

export default function HowItWorks() {
  const ref = useRef(null)

  // Scroll-linked offset translate(80,80) @ scrollY 0 → (0,0) @ scrollY 500; desktop & tablet only.
  // Smoothed with spring stiffness 500 / damping 60.
  useEffect(() => {
    const el = ref.current
    const mql = window.matchMedia('(min-width: 810px)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const spring = createSpring({
      stiffness: 500,
      damping: 60,
      initial: 80,
      onUpdate: (v) => {
        el.style.transform = v > 0.01 ? `translate3d(${v.toFixed(2)}px, ${v.toFixed(2)}px, 0)` : ''
      },
    })
    const target = () => (mql.matches && !reduce ? 80 * (1 - Math.min(1, Math.max(0, window.scrollY / 500))) : 0)
    spring.set(target(), true)
    const on = () => spring.set(target())
    window.addEventListener('scroll', on, { passive: true })
    mql.addEventListener('change', on)
    return () => {
      window.removeEventListener('scroll', on)
      mql.removeEventListener('change', on)
      spring.stop()
    }
  }, [])

  return (
    <section className="pf-how-clip">
      <div className="pf-how" ref={ref}>
      <LogoTicker />
      <div className="pf-how__title">
        <div className="pf-how__stack" id="see-the-platform">
          <Eyebrow>Ask. Understand. Act.</Eyebrow>
          <h2 className="t-h2">How a question becomes a next move.</h2>
        </div>
      </div>
      <div className="pf-how__row">
        <A1Loop />
      </div>
      </div>
    </section>
  )
}
