import Button from '../../components/shared/Button'
import Rays from './Rays'
import LiveConversation from './LiveConversation'
import { CALENDLY } from './content'

// specs/product-pages.md §1 Hero (hero.product-live-chat) — dark, rays shader + live chat. No parallax, no appear animations.
export default function ProductHero({ hero }) {
  return (
    <section className="pp-hero" style={{ '--gap': `${hero.gap}px`, '--left': `${hero.left}px`, '--chat': `${hero.chat}px` }}>
      <Rays colorMode={hero.rays} />
      <div className="pp-hero__row">
        <div className="pp-hero__left">
          <div className="flex items-center gap-4">
            <img src={hero.badge} alt="" width="20" height="20" className="h-5 w-5" />
            <span className="text-[16px] font-medium leading-6 tracking-[-0.16px] text-white">{hero.label}</span>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="pp-h1 font-headline">{hero.h1}</h1>
            <p className="m-0 text-[16px] leading-6 tracking-[-0.16px]" style={{ color: 'rgb(203,199,192)' }}>
              {hero.p}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="white" href={CALENDLY} target="_blank" rel="noopener">
              Book a call
            </Button>
            <Button variant="glass" href={hero.second.href}>
              {hero.second.label}
            </Button>
          </div>
        </div>
        <div className="pp-hero__chat">
          <LiveConversation data={hero.chatData} charsPerTick={3} holdSeconds={3.8} autoAdvance />
        </div>
      </div>
    </section>
  )
}
