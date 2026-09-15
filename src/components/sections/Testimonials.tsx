import { Quote } from 'lucide-react'
import { testimonialService } from '@/services/testimonialService'
import { useAsync } from '@/hooks/useAsync'
import { useSite } from '@/context/SiteContext'
import { useLoadMore } from '@/hooks/useLoadMore'
import { SectionHead } from './SectionHead'
import { Reveal } from '@/components/motion/Reveal'
import { StarRating } from '@/components/ui/StarRating'
import { LoadMoreButton } from '@/components/ui/LoadMoreButton'

export function Testimonials() {
  const { settings } = useSite()
  const { data: allTestimonials } = useAsync(() => testimonialService.listFeatured(), [])
  const { visible: testimonials, hasMore, remaining, loadMore } = useLoadMore(allTestimonials, settings.displayLimits.testimonials)
  if (allTestimonials.length === 0) return null

  return (
    <section className="bg-bg-alt py-24 md:py-32">
      <div className="wrap">
        <SectionHead eyebrow="Client feedback" title="What partners say" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal
              key={t.id}
              delay={(i % 2) * 0.08}
              className="group relative overflow-hidden border border-line bg-bg p-8 transition-colors duration-300 hover:border-accent/30 hover:bg-surface md:p-10"
            >
              <Quote
                size={38}
                strokeWidth={1.25}
                className="absolute right-6 top-6 text-faint/30 transition-colors duration-300 group-hover:text-accent/20"
                aria-hidden="true"
              />

              <div className="flex items-center gap-4">
                {t.avatar ? (
                  <img
                    src={t.avatar}
                    alt={t.name}
                    loading="lazy"
                    className="h-16 w-16 shrink-0 rounded-full border-2 border-line-strong object-cover transition-colors duration-300 group-hover:border-accent/50"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-line-strong bg-surface-2 font-display text-2xl text-accent transition-colors duration-300 group-hover:border-accent/50">
                    {t.name[0]}
                  </div>
                )}
                <div>
                  <p className="font-display text-lg uppercase leading-tight tracking-wide text-text">{t.name}</p>
                  <p className="font-mono text-xs text-muted">{t.role}, {t.company}</p>
                  <StarRating value={t.rating} className="mt-1.5" />
                </div>
              </div>

              <p className="relative mt-6 max-w-lg text-[15.5px] leading-relaxed text-text">
                &ldquo;{t.quote}&rdquo;
              </p>
            </Reveal>
          ))}
        </div>

        {hasMore && <LoadMoreButton onClick={loadMore} remaining={remaining} className="mt-10" />}
      </div>
    </section>
  )
}
