import { Cpu, Gamepad2, Sparkles, Target } from 'lucide-react'
import { useSite } from '@/context/SiteContext'
import { SEO } from '@/components/layout/SEO'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { TextReveal } from '@/components/motion/TextReveal'
import { Technologies } from '@/components/sections/Technologies'
import { Team } from '@/components/sections/Team'
import { Stats } from '@/components/sections/Stats'
import { ContactCTA } from '@/components/sections/ContactCTA'

const VALUES = [
  {
    icon: Target,
    title: 'Built to ship',
    description: 'Every engagement is scoped around a shippable milestone — not an open-ended exploration.',
  },
  {
    icon: Gamepad2,
    title: 'Player-first',
    description: 'Technology serves the experience. If a system does not improve what the player feels, it does not ship.',
  },
  {
    icon: Cpu,
    title: 'Pipeline-minded',
    description: "Tools and art direction are built together, so scale never comes at the cost of craft.",
  },
  {
    icon: Sparkles,
    title: 'Applied, not academic',
    description: 'AI work is judged by what it does in production — latency, cost, and player-facing quality.',
  },
]

export default function About() {
  const { settings } = useSite()

  return (
    <>
      <SEO title="About" description={settings.description} />

      <section className="pb-16 pt-36 md:pt-44">
        <div className="wrap max-w-3xl">
          <Reveal>
            <span className="eyebrow">About the studio</span>
          </Reveal>
          <h1 className="font-display chrome-text mt-4 text-[clamp(38px,6vw,68px)] leading-[1.02]">
            <TextReveal text="Technical mastery, artistic vision." />
          </h1>
          <Reveal delay={0.15} className="mt-6 text-[16px] leading-relaxed text-muted">
            {settings.brandName} pairs full-cycle game development with applied AI and immersive world-building.
            We embed with teams who ship, or run the whole pipeline end to end — from first prototype through
            live-ops — across Unreal Engine, Unity, and the tools we build to connect them.
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line py-20 md:py-28">
        <div className="wrap">
          <Stagger className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
            {VALUES.map((value) => (
              <StaggerItem key={value.title} className="bg-bg p-8">
                <value.icon size={20} className="mb-5 text-accent" />
                <h3 className="mb-2 text-[17px] font-semibold text-text">{value.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{value.description}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <div className="border-t border-line">
        <Stats />
      </div>

      <div className="border-t border-line">
        <Team />
      </div>
      <Technologies />
      <ContactCTA />
    </>
  )
}
