import { useEffect, useRef, useState } from 'react'
import Button from './shared/Button'
import Caret from './nav/Caret'
import './nav/nav.css'

const CALENDLY = 'https://calendly.com/d/dv3b-wwt-mfy/talk-to-primefold'

// Dropdown contents measured on the live site (hover each item @1440 / tap in the mobile menu).
const NAV = [
  {
    label: 'Products',
    menu: [
      { label: 'Experience Intelligence', href: '/experience-intelligence' },
      { label: 'Real Estate Intelligence', href: '/realestate-intelligence' },
      { label: 'More in 2027' },
    ],
  },
  { label: 'Plans', href: '/plans' },
  { label: 'Security', href: '/security' },
  {
    label: 'Resources',
    menu: [
      { label: 'Blog', href: '/blog' },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Help center XI', href: 'http://help.primefold.ai/xi' },
      { label: 'Help center RI', href: 'http://help.primefold.ai/ri' },
    ],
  },
  {
    label: 'Company',
    headClass: 'is-lg', // live site: this heading is 14/20 (-0.084px) while the others are 12/16
    menu: [
      { label: 'About Us', href: '/company' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]

function MenuLinks({ items, tabIndex, onPick }) {
  return (
    <div className="pf-nav__mlinks">
      {items.map((m) => (
        <a key={m.label} href={m.href} role="menuitem" tabIndex={tabIndex} onClick={onPick}>
          <span className="pf-nav__mrow">{m.label}</span>
        </a>
      ))}
    </div>
  )
}

function DesktopItem({ item, open, setOpen }) {
  if (!item.menu) {
    return (
      <div className="pf-nav__item">
        <a className="pf-nav__link" href={item.href}>
          <span className="pf-nav__label">{item.label}</span>
        </a>
      </div>
    )
  }
  const isOpen = open === item.label
  return (
    <div
      className={`pf-nav__item${isOpen ? ' is-open' : ''}`}
      onMouseEnter={() => setOpen(item.label)}
      onMouseLeave={() => setOpen(null)}
    >
      <button
        type="button"
        className="pf-nav__link"
        aria-expanded={isOpen}
        onClick={() => setOpen(isOpen ? null : item.label)}
      >
        <span className="pf-nav__label">{item.label}</span>
        <Caret className="pf-nav__caret" />
      </button>
      <div className="pf-nav__menu" role="menu">
        <div className={`pf-nav__menu-head ${item.headClass || ''}`}>{item.label}</div>
        <MenuLinks items={item.menu} />
      </div>
    </div>
  )
}

// variant: 'overlay' (transparent over a dark hero, switches to the blurred bar on scroll)
//        | 'white'   ("Desktop White" / "Mobile White Collapsed": solid from load, no scroll change)
export default function Navbar({ variant = 'overlay' }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [mOpen, setMOpen] = useState({}) // mobile accordions are independent on the live site
  const navRef = useRef(null)

  // Nav-Trigger: 1x1 marker at hero top:100px → switch once scrollY ≥ 100
  useEffect(() => {
    const on = () => setScrolled(window.scrollY >= 100)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  // close desktop dropdown on outside click
  useEffect(() => {
    if (!open) return
    const on = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(null)
    }
    document.addEventListener('pointerdown', on)
    return () => document.removeEventListener('pointerdown', on)
  }, [open])

  // lock page scroll while the mobile menu is open
  useEffect(() => {
    const lenis = window.__lenis
    if (expanded) lenis?.stop()
    else lenis?.start()
  }, [expanded])

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1200px)')
    const on = () => mql.matches && setExpanded(false)
    mql.addEventListener('change', on)
    return () => mql.removeEventListener('change', on)
  }, [])

  const white = variant === 'white'
  const dark = scrolled || white
  const cls = `pf-nav${white ? ' is-white' : scrolled ? ' is-scrolled' : ''}${expanded ? ' is-expanded' : ''}`

  return (
    <header className={cls} ref={navRef}>
      <div className="pf-nav__content">
        <div className="pf-nav__bg" />
        <div className="pf-nav__row">
          <a className="pf-nav__logo" href="/" aria-label="Primefold home">
            <img className="is-light" src="/assets/svg/logo-white.svg" alt="Primefold" width="124" height="24" />
            <img className="is-dark" src="/assets/svg/logo-dark.svg" alt="" aria-hidden="true" width="124" height="24" />
          </a>

          <div className="pf-nav__right">
            <nav className="pf-nav__links" aria-label="Main">
              {NAV.map((item) => (
                <DesktopItem key={item.label} item={item} open={open} setOpen={setOpen} />
              ))}
            </nav>
            <div className="pf-nav__btns">
              <Button variant={dark ? 'glass-dark' : 'glass'} href="https://xi.primefold.ai">
                Sign in
              </Button>
              <Button variant={dark ? 'black' : 'white'} href={CALENDLY} target="_blank" rel="noopener">
                Book a call
              </Button>
            </div>
          </div>

          <button
            type="button"
            className="pf-nav__burger"
            aria-label={expanded ? 'Close menu' : 'Open menu'}
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Mobile expanded menu — measured on the live site (tap hamburger @390 / @810) */}
        <div className="pf-nav__mobile" aria-hidden={!expanded}>
          <nav className="pf-nav__mlist" aria-label="Mobile">
            {NAV.map((item) =>
              item.menu ? (
                <div key={item.label} className={`pf-nav__macc${mOpen[item.label] ? ' is-open' : ''}`}>
                  <button
                    type="button"
                    className="pf-nav__mlink"
                    aria-expanded={!!mOpen[item.label]}
                    onClick={() => setMOpen((o) => ({ ...o, [item.label]: !o[item.label] }))}
                    tabIndex={expanded ? 0 : -1}
                  >
                    <span>{item.label}</span>
                    <Caret className="pf-nav__caret" />
                  </button>
                  <div className="pf-nav__msub">
                    <div className="pf-nav__msub-in">
                      <div className="pf-nav__msub-box">
                        <MenuLinks items={item.menu} tabIndex={expanded && mOpen[item.label] ? 0 : -1} onPick={() => setExpanded(false)} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <a key={item.label} className="pf-nav__mlink" href={item.href} tabIndex={expanded ? 0 : -1} onClick={() => setExpanded(false)}>
                  <span>{item.label}</span>
                </a>
              ),
            )}
          </nav>
          <div className="pf-nav__mbtns">
            <Button variant="black" href="https://xi.primefold.ai" tabIndex={expanded ? 0 : -1}>
              Sign in
            </Button>
            <Button variant="white" href={CALENDLY} target="_blank" rel="noopener" tabIndex={expanded ? 0 : -1}>
              Book a call
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
