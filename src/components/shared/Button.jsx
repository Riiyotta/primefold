// Framer "Button" pill (CLONE_SPEC 0.6). variant: white | black | glass | glass-dark | arrow
export default function Button({ variant = 'white', href = '#', children, className = '', ...rest }) {
  return (
    <a href={href} className={`pf-btn pf-btn--${variant} ${className}`} {...rest}>
      <span>{children}</span>
      {variant === 'arrow' && <span className="pf-arrow" aria-hidden="true" />}
    </a>
  )
}
