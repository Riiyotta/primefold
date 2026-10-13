import { useEffect, useState } from 'react'

// CLONE_SPEC 11 — Cookie consent (optional third-party component). NOT mounted in App.jsx.
// Choice is stored in localStorage; the footer "Cookie Settings" button re-opens it via the
// `pf:cookie-settings` window event.
const KEY = 'pf-cookie-consent'
const FONT = 'Inter, system-ui, sans-serif'
const btn = { borderRadius: 8, padding: '10px 20px', fontFamily: FONT, fontSize: 14, fontWeight: 600, lineHeight: 'normal', cursor: 'pointer' }
const ghost = { ...btn, background: 'transparent', border: '1px solid rgb(229,229,229)', color: 'rgb(17,17,17)' }

export default function CookieBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try { if (!localStorage.getItem(KEY)) setOpen(true) } catch { setOpen(true) }
    const reopen = () => setOpen(true)
    window.addEventListener('pf:cookie-settings', reopen)
    return () => window.removeEventListener('pf:cookie-settings', reopen)
  }, [])

  const choose = (value) => {
    try { localStorage.setItem(KEY, value) } catch { /* storage unavailable */ }
    setOpen(false)
  }

  if (!open) return null
  return (
    <div
      role="dialog"
      aria-label="We value your privacy"
      className="fixed bottom-4 right-4 w-[calc(100%-32px)] max-w-[520px] box-border"
      style={{ background: '#fff', border: '1px solid rgb(229,229,229)', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,.12)', padding: 24, zIndex: 999999, fontFamily: FONT }}
    >
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'rgb(17,17,17)', fontFamily: FONT }}>We value your privacy</h2>
      <p style={{ margin: '8px 0 16px', fontSize: 14, lineHeight: '21px', color: 'rgb(102,102,102)' }}>
        We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking Accept All, you consent to our use of cookies.{' '}
        <a href="/data-privacy" style={{ color: 'rgb(17,17,17)' }}>Read our Privacy Policy</a>
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        <button type="button" style={ghost} onClick={() => choose('custom')}>Customize</button>
        <button type="button" style={ghost} onClick={() => choose('rejected')}>Reject All</button>
        <button type="button" style={{ ...btn, background: 'rgb(17,17,17)', color: '#fff', border: 0 }} onClick={() => choose('accepted')}>Accept All</button>
      </div>
    </div>
  )
}
