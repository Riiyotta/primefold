import { useEffect, useRef } from 'react'

// Lazy lottie-web (light/SVG) player. Plays once from frame 0 whenever `play` turns true.
export default function Lottie({ src, play, className = '', style }) {
  const box = useRef(null)
  const anim = useRef(null)
  const wantPlay = useRef(play)
  wantPlay.current = play

  useEffect(() => {
    let dead = false
    Promise.all([import('lottie-web/build/player/lottie_light'), fetch(src).then((r) => r.json())]).then(([mod, data]) => {
      if (dead || !box.current) return
      const lottie = mod.default || mod
      anim.current = lottie.loadAnimation({
        container: box.current,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: data,
        rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
      })
      if (wantPlay.current) anim.current.goToAndPlay(0, true)
    })
    return () => {
      dead = true
      anim.current?.destroy()
      anim.current = null
    }
  }, [src])

  useEffect(() => {
    const a = anim.current
    if (!a) return
    if (play) a.goToAndPlay(0, true)
    else a.goToAndStop(0, true)
  }, [play])

  return <div ref={box} className={className} style={style} aria-hidden="true" />
}
