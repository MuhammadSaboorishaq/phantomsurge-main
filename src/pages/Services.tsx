import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { serviceService } from '@/services/serviceService'
import { useAsync } from '@/hooks/useAsync'
import { useSite } from '@/context/SiteContext'
import { useLoadMore } from '@/hooks/useLoadMore'
import { SEO } from '@/components/layout/SEO'
import { Reveal } from '@/components/motion/Reveal'
import { TextReveal } from '@/components/motion/TextReveal'
import { LoadMoreButton } from '@/components/ui/LoadMoreButton'
import { SITE_ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { getServiceIcon } from '@/lib/iconRegistry'

export default function ServicesPage() {
  const { settings } = useSite()
  const { data: allServices } = useAsync(() => serviceService.listEnabled(), [])
  const { visible: services, hasMore, remaining, loadMore } = useLoadMore(allServices, settings.displayLimits.services)
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <>
      <SEO title="Services" description="Full-cycle game development, applied AI, art, tools and immersive experiences." />

      <section className="pb-16 pt-36 md:pt-44">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow">What we do</span>
          </Reveal>
          <h1 className="font-display chrome-text mt-4 max-w-2xl text-[clamp(38px,6vw,68px)]">
            <TextReveal text="Every discipline, one pipeline" />
          </h1>
          <Reveal delay={0.1} className="mt-4 max-w-lg text-muted">
            From first prototype to live-ops, every service is built to plug into the next — so nothing gets lost in
            translation between teams.
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line pb-24">
        <div className="wrap">
          {services.map((service, i) => {
            const Icon = getServiceIcon(service.icon)
            const open = openId === service.id
            return (
              <Reveal key={service.id} delay={i * 0.03}>
                <div className="border-b border-line">
                  <button
                    onClick={() => setOpenId(open ? null : service.id)}
                    className="flex w-full items-center gap-6 py-8 text-left"
                  >
                    <span className="font-mono text-sm text-faint">{service.number}</span>
                    <Icon size={22} className={cn('shrink-0 transition-colors', open ? 'text-accent' : 'text-muted')} />
                    <h2
                      className={cn(
                        'font-display flex-1 text-2xl uppercase tracking-wide transition-colors md:text-3xl',
                        open ? 'text-accent' : 'text-text',
                      )}
                    >
                      {service.title}
                    </h2>
                    <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-2xl text-muted">
                      +
                    </motion.span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 gap-8 pb-10 pl-0 md:grid-cols-[1fr_auto] md:pl-[76px]">
                      <p className="max-w-2xl text-[15.5px] leading-relaxed text-muted">{service.longDescription}</p>
                      <Link
                        to={SITE_ROUTES.contact}
                        className="inline-flex h-fit items-center gap-2 self-start rounded-[var(--r-control)] border border-line-strong px-5 py-3 font-mono text-[11.5px] uppercase tracking-wide text-text transition-colors hover:border-accent hover:text-accent"
                      >
                        Discuss a project →
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </Reveal>
            )
          })}

          {hasMore && <LoadMoreButton onClick={loadMore} remaining={remaining} className="mt-4" />}
        </div>
      </section>
    </>
  )
}
