import { useEffect, useState } from 'react'

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

// Section eyebrow: braille spinner (80ms/frame) + label (CLONE_SPEC 0.6)
export default function Eyebrow({ children, className = '', color }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % FRAMES.length), 80)
    return () => clearInterval(id)
  }, [])
  return (
    <div className={`flex items-center gap-1 t-eyebrow ${className}`} style={color ? { color } : undefined}>
      <span className="inline-flex h-5 w-[15px] items-center justify-center overflow-hidden" style={{ font: '16px/20.8px monospace' }} aria-hidden="true">
        {FRAMES[i]}
      </span>
      <span>{children}</span>
    </div>
  )
}
