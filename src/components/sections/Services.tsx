import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { serviceService } from '@/services/serviceService'
import { useAsync } from '@/hooks/useAsync'
import { useSite } from '@/context/SiteContext'
import { useLoadMore } from '@/hooks/useLoadMore'
import { SectionHead } from './SectionHead'
import { Reveal } from '@/components/motion/Reveal'
import { LoadMoreButton } from '@/components/ui/LoadMoreButton'
import { SITE_ROUTES } from '@/lib/constants'
import { getServiceIcon } from '@/lib/iconRegistry'

export function Services() {
  const { settings } = useSite()
  const { data: allServices } = useAsync(() => serviceService.listEnabled(), [])
  const { visible: services, hasMore, remaining, loadMore } = useLoadMore(allServices, settings.displayLimits.services)
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section id="services" className="py-24 md:py-32">
      <div className="wrap">
        <SectionHead
          eyebrow="What we do"
          title="Every discipline, one pipeline"
          description="From first prototype to live-ops, every service is built to plug into the next — so nothing gets lost in translation between teams."
        />

        <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = getServiceIcon(service.icon)
            return (
              <Reveal key={service.id} delay={(i % 3) * 0.06} className="h-full">
                <Link
                  to={SITE_ROUTES.services}
                  data-cursor="link"
                  onMouseEnter={() => setHovered(service.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="group relative block h-full min-h-[280px] bg-bg p-8 transition-colors duration-300 hover:bg-surface md:p-10"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs tracking-[0.1em] text-faint">{service.number}</span>
                    <Icon
                      size={20}
                      className="text-faint transition-colors duration-300 group-hover:text-accent"
                    />
                  </div>

                  <motion.div
                    animate={{ width: hovered === service.id ? 46 : 30 }}
                    transition={{ duration: 0.3 }}
                    className="my-6 h-px bg-gradient-to-r from-accent to-transparent"
                  />

                  <h3 className="mb-3 text-[21px] font-semibold text-text">{service.title}</h3>
                  <p className="text-[14.5px] leading-relaxed text-muted">{service.shortDescription}</p>

                  <span className="mt-5 inline-flex translate-y-1 items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.06em] text-accent opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    Learn more →
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </div>

        {hasMore && <LoadMoreButton onClick={loadMore} remaining={remaining} className="mt-10" />}
      </div>
    </section>
  )
}
