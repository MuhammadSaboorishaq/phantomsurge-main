import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Globe } from 'lucide-react'
import { GithubIcon } from '@/components/icons/SocialIcons'
import { portfolioService } from '@/services/portfolioService'
import { useAsync } from '@/hooks/useAsync'
import { SEO } from '@/components/layout/SEO'
import { Reveal } from '@/components/motion/Reveal'
import { PortfolioGallery } from '@/components/portfolio/PortfolioGallery'
import { PortfolioCard } from '@/components/portfolio/PortfolioCard'
import { Badge } from '@/components/ui/Badge'
import { SITE_ROUTES } from '@/lib/constants'
import NotFound from './NotFound'

function toEmbedUrl(item: { youtubeUrl?: string; vimeoUrl?: string }): string | null {
  if (item.youtubeUrl) {
    const id = item.youtubeUrl.match(/(?:v=|youtu\.be\/)([\w-]+)/)?.[1]
    return id ? `https://www.youtube.com/embed/${id}` : null
  }
  if (item.vimeoUrl) {
    const id = item.vimeoUrl.match(/vimeo\.com\/(\d+)/)?.[1]
    return id ? `https://player.vimeo.com/video/${id}` : null
  }
  return null
}

export default function WorkDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { data: item } = useAsync(
    () => slug ? portfolioService.getBySlug(slug) : Promise.resolve(undefined),
    undefined,
    [slug],
  )
  const { data: related } = useAsync(
    async () => {
      if (!item) return []
      const all = await portfolioService.listPublished()
      return all.filter((p) => p.id !== item.id && p.category === item.category).slice(0, 3)
    },
    [],
    [item],
  )

  if (!item || !item.published) return <NotFound />

  const embedUrl = toEmbedUrl(item)

  return (
    <>
      <SEO title={item.title} description={item.shortDescription} image={item.heroImage} />

      <section className="relative overflow-hidden pt-28 md:pt-32">
        <div className="wrap mb-8">
          <Link
            to={SITE_ROUTES.work}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft size={14} /> All work
          </Link>
        </div>

        <Reveal className="wrap">
          <span className="eyebrow">{item.category}</span>
          <h1 className="font-display chrome-text mt-4 text-[clamp(38px,6.4vw,80px)] leading-[0.98]">{item.title}</h1>
        </Reveal>

        <Reveal delay={0.1} className="wrap mt-10 aspect-[16/9] overflow-hidden rounded-[var(--r-card)] border border-line">
          {item.videoUrl ? (
            <video src={item.videoUrl} controls className="h-full w-full object-cover" poster={item.heroImage} />
          ) : embedUrl ? (
            <iframe src={embedUrl} title={item.title} allowFullScreen className="h-full w-full" />
          ) : (
            <img src={item.heroImage} alt={item.title} className="h-full w-full object-cover" />
          )}
        </Reveal>
      </section>

      <section className="py-16 md:py-24">
        <div className="wrap grid grid-cols-1 gap-16 lg:grid-cols-[1fr_320px]">
          <div>
            <Reveal>
              <h2 className="font-display mb-4 text-2xl uppercase tracking-wide text-text">Overview</h2>
              <p className="whitespace-pre-line text-[15.5px] leading-relaxed text-muted">{item.longDescription}</p>
            </Reveal>

            {item.challenge && (
              <Reveal delay={0.05} className="mt-12">
                <h2 className="font-display mb-4 text-2xl uppercase tracking-wide text-text">Challenge</h2>
                <p className="text-[15.5px] leading-relaxed text-muted">{item.challenge}</p>
              </Reveal>
            )}

            {item.solution && (
              <Reveal delay={0.1} className="mt-12">
                <h2 className="font-display mb-4 text-2xl uppercase tracking-wide text-text">Solution</h2>
                <p className="text-[15.5px] leading-relaxed text-muted">{item.solution}</p>
              </Reveal>
            )}

            {item.gallery.length > 0 && (
              <Reveal delay={0.1} className="mt-14">
                <h2 className="font-display mb-6 text-2xl uppercase tracking-wide text-text">Gallery</h2>
                <PortfolioGallery items={item.gallery} />
              </Reveal>
            )}

            {item.results && (
              <Reveal delay={0.1} className="mt-14 rounded-[var(--r-card)] border border-accent/20 bg-accent/5 p-8">
                <h2 className="font-display mb-3 text-xl uppercase tracking-wide text-accent">Results</h2>
                <p className="text-[15.5px] leading-relaxed text-text">{item.results}</p>
              </Reveal>
            )}
          </div>

          <Reveal delay={0.15} className="space-y-8">
            <dl className="space-y-5 border border-line p-6 font-mono text-[13px]">
              {item.client && (
                <div>
                  <dt className="text-[10.5px] uppercase tracking-[0.1em] text-faint">Client</dt>
                  <dd className="mt-1 text-text">{item.client}</dd>
                </div>
              )}
              <div>
                <dt className="text-[10.5px] uppercase tracking-[0.1em] text-faint">Year</dt>
                <dd className="mt-1 text-text">{item.year}</dd>
              </div>
              <div>
                <dt className="text-[10.5px] uppercase tracking-[0.1em] text-faint">Category</dt>
                <dd className="mt-1 text-text">{item.category}</dd>
              </div>
              {item.services.length > 0 && (
                <div>
                  <dt className="text-[10.5px] uppercase tracking-[0.1em] text-faint">Services</dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {item.services.map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </dd>
                </div>
              )}
              {item.technologies.length > 0 && (
                <div>
                  <dt className="text-[10.5px] uppercase tracking-[0.1em] text-faint">Technologies</dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {item.technologies.map((t) => (
                      <Badge key={t} variant="accent">{t}</Badge>
                    ))}
                  </dd>
                </div>
              )}
            </dl>

            <div className="space-y-3">
              {item.websiteUrl && (
                <a
                  href={item.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between border border-line-strong px-4 py-3 font-mono text-xs uppercase tracking-wide text-text transition-colors hover:border-accent hover:text-accent"
                >
                  Visit website <Globe size={14} />
                </a>
              )}
              {item.githubUrl && (
                <a
                  href={item.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between border border-line-strong px-4 py-3 font-mono text-xs uppercase tracking-wide text-text transition-colors hover:border-accent hover:text-accent"
                >
                  View source <GithubIcon width={14} height={14} />
                </a>
              )}
              <Link
                to={SITE_ROUTES.contact}
                className="flex items-center justify-between bg-accent px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wide text-[#04110f]"
              >
                Start a similar project <ArrowUpRight size={14} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-bg-alt py-20 md:py-28">
          <div className="wrap">
            <h2 className="font-display chrome-text mb-10 text-2xl uppercase tracking-wide md:text-3xl">
              More {item.category}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <PortfolioCard key={p.id} item={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
