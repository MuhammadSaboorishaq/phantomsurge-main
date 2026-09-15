import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { blogService } from '@/services/blogService'
import { useAsync } from '@/hooks/useAsync'
import { SEO } from '@/components/layout/SEO'
import { Reveal } from '@/components/motion/Reveal'
import { Badge } from '@/components/ui/Badge'
import { SITE_ROUTES } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import NotFound from './NotFound'

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post } = useAsync(
    () => slug ? blogService.getBySlug(slug) : Promise.resolve(undefined),
    undefined,
    [slug],
  )
  const { data: more } = useAsync(
    async () => {
      if (!post) return []
      const all = await blogService.listPublished()
      return all.filter((p) => p.id !== post.id).slice(0, 2)
    },
    [],
    [post],
  )

  if (!post || !post.published) return <NotFound />

  const paragraphs = post.content.split(/\n\s*\n/).filter(Boolean)

  return (
    <>
      <SEO title={post.title} description={post.excerpt} image={post.coverImage} />

      <article className="pb-20 pt-32 md:pt-40">
        <div className="wrap max-w-3xl">
          <Link to={SITE_ROUTES.blog} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-muted transition-colors hover:text-accent">
            <ArrowLeft size={14} /> All posts
          </Link>

          <Reveal className="mt-8">
            <div className="flex flex-wrap items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.1em] text-faint">
              <span className="text-accent">{post.category}</span>
              <span>·</span>
              <span>{formatDate(post.publishedDate)}</span>
              <span>·</span>
              <span>{post.readingTime} min read</span>
              <span>·</span>
              <span>By {post.author}</span>
            </div>
            <h1 className="font-display chrome-text mt-5 text-[clamp(32px,5.4vw,58px)] leading-[1.03]">{post.title}</h1>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="wrap mt-10 max-w-5xl">
          <div className="aspect-[16/8] overflow-hidden rounded-[var(--r-card)] border border-line">
            <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
          </div>
        </Reveal>

        <div className="wrap mt-12 max-w-3xl">
          <Reveal className="prose-content space-y-6 text-[16px] leading-[1.8] text-muted">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>

          {post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-line pt-8">
              {post.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </article>

      {more.length > 0 && (
        <section className="border-t border-line bg-bg-alt py-20">
          <div className="wrap max-w-3xl">
            <h2 className="font-display mb-8 text-xl uppercase tracking-wide text-text">Continue reading</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {more.map((p) => (
                <Link key={p.id} to={SITE_ROUTES.blogDetail(p.slug)} className="group block">
                  <div className="aspect-[16/10] overflow-hidden rounded-[var(--r-card)] border border-line">
                    <img src={p.coverImage} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <h3 className="mt-3 text-[15px] font-semibold text-text transition-colors group-hover:text-accent">{p.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
