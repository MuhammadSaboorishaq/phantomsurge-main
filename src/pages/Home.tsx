import type { JSX } from 'react'
import { useSite } from '@/context/SiteContext'
import type { SectionKey } from '@/types'
import { SEO } from '@/components/layout/SEO'
import { Hero } from '@/components/hero/Hero'
import { Marquee } from '@/components/sections/Marquee'
import { Services } from '@/components/sections/Services'
import { PortfolioFeatured } from '@/components/sections/PortfolioFeatured'
import { Stats } from '@/components/sections/Stats'
import { Technologies } from '@/components/sections/Technologies'
import { Team } from '@/components/sections/Team'
import { Testimonials } from '@/components/sections/Testimonials'
import { BlogPreview } from '@/components/sections/BlogPreview'
import { ContactCTA } from '@/components/sections/ContactCTA'

const SECTION_COMPONENTS: Partial<Record<SectionKey, () => JSX.Element | null>> = {
  hero: Hero,
  marquee: Marquee,
  services: Services,
  portfolio: PortfolioFeatured,
  stats: Stats,
  about: Technologies,
  team: Team,
  testimonials: Testimonials,
  blog: BlogPreview,
  contact: ContactCTA,
}

export default function Home() {
  const { orderedSections } = useSite()

  return (
    <>
      <SEO />
      {orderedSections.map((section) => {
        const Component = SECTION_COMPONENTS[section.key]
        if (!Component || !section.enabled) return null
        return <Component key={section.key} />
      })}
    </>
  )
}
