import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { portfolioService } from '@/services/portfolioService'
import { useAsync } from '@/hooks/useAsync'
import { PortfolioCard } from '@/components/portfolio/PortfolioCard'
import { SectionHead } from './SectionHead'
import { Reveal } from '@/components/motion/Reveal'
import { SITE_ROUTES } from '@/lib/constants'

export function PortfolioFeatured() {
  const { data: allPublished } = useAsync(() => portfolioService.listPublished(), [])
  const items = allPublished.slice(0, 6)

  if (items.length === 0) return null

  return (
    <section id="work" className="bg-bg-alt py-24 md:py-32">
      <div className="wrap">
        <SectionHead
          eyebrow="Selected work"
          title="Recent projects"
          description="A sample of shipped titles, tools and visualizations across engines and genres."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <PortfolioCard key={item.id} item={item} index={i} />
          ))}
        </div>

        <Reveal className="mt-14 flex justify-center">
          <Link
            to={SITE_ROUTES.work}
            data-cursor="link"
            className="group inline-flex items-center gap-2 rounded-[var(--r-control)] border border-line-strong px-7 py-3.5 font-mono text-xs uppercase tracking-[0.08em] text-text transition-colors hover:border-accent hover:text-accent"
          >
            View All Work
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
