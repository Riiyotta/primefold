import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Intelligence from '../components/Intelligence'
import Testimonials from '../components/Testimonials'
import Solutions from '../components/Solutions'
import Trust from '../components/Trust'
import Outcomes from '../components/Outcomes'
import CTA from '../components/CTA'

export default function Home() {
  return (
    <>
      <Hero />
      {/* Content sheet scrolls over the parallax hero (CLONE_SPEC 0.6 Stacking) */}
      <div className="relative z-[4] rounded-t-2xl bg-page-alt pt-4">
        <HowItWorks />
        <Intelligence />
        <Testimonials />
        <Solutions />
        <Trust />
        <Outcomes />
      </div>
      <CTA />
    </>
  )
}
