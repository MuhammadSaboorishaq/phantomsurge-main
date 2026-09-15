import { useState } from 'react'
import { Link } from 'react-router-dom'
import { blogService } from '@/services/blogService'
import { useAsync } from '@/hooks/useAsync'
import { SEO } from '@/components/layout/SEO'
import { Reveal } from '@/components/motion/Reveal'
import { TextReveal } from '@/components/motion/TextReveal'
import { EmptyState } from '@/components/ui/EmptyState'
import { SITE_ROUTES } from '@/lib/constants'
import { formatDate, cn } from '@/lib/utils'

export default function Blog() {
  const { data: posts } = useAsync(() => blogService.listPublished(), [])
  const { data: categories } = useAsync(async () => ['All', ...(await blogService.categories())], ['All'])
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? posts : posts.filter((p) => p.category === active)
  const [featured, ...rest] = filtered

  return (
    <>
      <SEO title="Blog" description="Field notes on shipping games, applied AI and the pipelines behind both." />

      <section className="pb-12 pt-36 md:pt-44">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow">Studio notes</span>
          </Reveal>
          <h1 className="font-display chrome-text mt-4 text-[clamp(38px,6vw,68px)]">
            <TextReveal text="From the blog" />
          </h1>
        </div>
      </section>

      <section className="border-y border-line">
        <div className="wrap flex flex-wrap gap-2 py-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                'rounded-full border px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.06em] transition-colors',
                active === cat ? 'border-accent text-accent' : 'border-line text-muted hover:border-line-strong hover:text-text',
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="wrap">
          {filtered.length === 0 ? (
            <EmptyState title="No posts in this category yet." description="Check back soon for new studio notes." />
          ) : (
            <>
              {featured && (
                <Reveal>
                  <Link to={SITE_ROUTES.blogDetail(featured.slug)} data-cursor="link" className="group mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
                    <div className="aspect-[16/10] overflow-hidden rounded-[var(--r-card)] border border-line">
                      <img
                        src={featured.coverImage}
                        alt={featured.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.1em] text-faint">
                        <span className="text-accent">{featured.category}</span>
                        <span>·</span>
                        <span>{formatDate(featured.publishedDate)}</span>
                        <span>·</span>
                        <span>{featured.readingTime} min read</span>
                      </div>
                      <h2 className="font-display chrome-text mt-3 text-[clamp(26px,3.4vw,40px)] leading-tight">
                        {featured.title}
                      </h2>
                      <p className="mt-4 text-[15px] leading-relaxed text-muted">{featured.excerpt}</p>
                      <span className="mt-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-accent">
                        Read article →
                      </span>
                    </div>
                  </Link>
                </Reveal>
              )}

              {rest.length > 0 && (
                <div className="grid grid-cols-1 gap-10 border-t border-line pt-14 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post, i) => (
                    <Reveal key={post.id} delay={(i % 3) * 0.06}>
                      <Link to={SITE_ROUTES.blogDetail(post.slug)} data-cursor="link" className="group block">
                        <div className="aspect-[16/10] overflow-hidden rounded-[var(--r-card)] border border-line">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="mt-4 flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.1em] text-faint">
                          <span className="text-accent">{post.category}</span>
                          <span>·</span>
                          <span>{formatDate(post.publishedDate)}</span>
                        </div>
                        <h3 className="mt-2.5 text-[18px] font-semibold leading-snug text-text transition-colors group-hover:text-accent">
                          {post.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
