// Mask icon: the live site inlines these as data-URI mask-images; colour comes from background-color.
export default function MaskIcon({ src, size = 24, color = 'rgb(26,24,20)', className = '', style }) {
  const mask = `url("${src}") center/contain no-repeat`
  return (
    <span
      aria-hidden="true"
      className={`block shrink-0 ${className}`}
      style={{ width: size, height: size, backgroundColor: color, WebkitMask: mask, mask, ...style }}
    />
  )
}
