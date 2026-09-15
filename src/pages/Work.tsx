import { useState } from 'react'
import { motion } from 'framer-motion'
import { portfolioService } from '@/services/portfolioService'
import { useAsync } from '@/hooks/useAsync'
import { PortfolioCard } from '@/components/portfolio/PortfolioCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { SEO } from '@/components/layout/SEO'
import { Reveal } from '@/components/motion/Reveal'
import { TextReveal } from '@/components/motion/TextReveal'
import { cn } from '@/lib/utils'

export default function Work() {
  const { data: allItems } = useAsync(() => portfolioService.listPublished(), [])
  const { data: categories } = useAsync(async () => ['All', ...(await portfolioService.categories())], ['All'])
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? allItems : allItems.filter((i) => i.category === active)

  return (
    <>
      <SEO title="Work" description="A sample of shipped titles, tools and visualizations across engines and genres." />

      <section className="pb-16 pt-36 md:pt-44">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow">Portfolio</span>
          </Reveal>
          <h1 className="font-display chrome-text mt-4 text-[clamp(38px,6vw,72px)]">
            <TextReveal text="Selected work" />
          </h1>
          <Reveal delay={0.1} className="mt-4 max-w-lg text-muted">
            Full-cycle builds, prototypes, and visualizations shipped across engines, genres and disciplines.
          </Reveal>
        </div>
      </section>

      <section className="border-y border-line">
        <div className="wrap flex flex-wrap gap-2 py-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                'relative rounded-full border px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.06em] transition-colors',
                active === cat ? 'border-accent text-accent' : 'border-line text-muted hover:border-line-strong hover:text-text',
              )}
            >
              {active === cat && (
                <motion.span layoutId="work-filter-pill" className="absolute inset-0 rounded-full bg-accent/10" />
              )}
              <span className="relative">{cat}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="wrap">
          {filtered.length === 0 ? (
            <EmptyState title="No projects in this category yet." description="Try a different filter, or check back soon." />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item, i) => (
                <PortfolioCard key={item.id} item={item} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
