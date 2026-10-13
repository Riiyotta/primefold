import Lottie from './Lottie'

const S = (f) => `/assets/svg/${f}`

// Card-3 icon grid, in on-screen order (reference/states/cards-rest.png); labels from reference/frames-810/f03.png
export const CI_ITEMS = [
  ['img-variant-1-c788cd5c.svg', 'Finance'],
  ['img-variant-1-09b6b041.svg', 'People / HR'],
  ['img-variant-1-0551ac38.svg', 'Operations'],
  ['img-variant-1-f01e1e29.svg', 'Sales'],
  ['img-variant-1-1834d763.svg', 'Legal'],
  ['img-variant-1-47e9d8d7.svg', 'Marketing'],
  ['img-variant-1-a7ac0b88.svg', 'Strategy'],
  ['img-variant-1-9983d044.svg', 'Procurement'],
  ['img-variant-1-5d1d07d2.svg', 'Supply Chain'],
  ['img-variant-1-9315ce30.svg', 'Risk'],
  ['img-variant-1-2d764ac9.svg', 'Information Technology'],
  ['img-variant-1-ce67e1c2.svg', 'Customer'],
]

export function XIVisual({ active, lottieSrc }) {
  return (
    <>
      <div className="ic-xi">
        <img className="ic-xi__photo" src="/assets/U0tJJ7Y3amMDQd4StUat5cOK8uk.png" alt="" loading="lazy" />
        <div className="ic-xi__text">
          <div className="ic-xi__q">How was your experience with us?</div>
          <div className="ic-xi__d">A quick two-minute survey your honest feedback helps us fix what's slow and keep what you love.</div>
          <img className="ic-xi__stars" src={S('svg-graphic-957e0bd1.svg')} alt="" />
        </div>
      </div>
      <Lottie className="ic-lottie" src={lottieSrc} play={active} />
    </>
  )
}

const PDF_ROWS = [
  ['svg-mappinsimple-10d570cc.svg', 'Villa Serena'],
  ['svg-building-eb430172.svg', 'Leased'],
  ['svg-steps-28954703.svg', 'Renews in 5 months'],
  ['svg-globe-c5648125.svg', 'Coral Gables · FL'],
  ['svg-moneywavy-72de58ea.svg', 'Break Option', 'Flag'],
]

export function RIVisual() {
  return (
    <div className="ic-ri">
      <div className="ic-ri__photo">
        <img src="/assets/0nTcgouZiu10WBq79OBdBOz9v8.webp" alt="" loading="lazy" />
      </div>
      <div className="ic-ri__pdfwrap">
        <div className="ic-ri__pdf">
          <div className="ic-ri__doc">
            <img src="/assets/yhaWJ4eSadpaWQiwRKmrlQa99sY.png" alt="" />
            <span>PDF</span>
          </div>
          {PDF_ROWS.map(([icon, label, end]) => (
            <div key={label} className="ic-ri__row">
              <img src={S(icon)} alt="" />
              <span>{label}</span>
              {end && <span className="ic-ri__end">{end}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CIVisual() {
  return (
    <div className="ic-ci">
      {CI_ITEMS.map(([f, label]) => (
        <span key={label} className="ic-ci__item">
          <img src={S(f)} alt="" />
          <span className="ic-ci__label">{label}</span>
        </span>
      ))}
    </div>
  )
}
