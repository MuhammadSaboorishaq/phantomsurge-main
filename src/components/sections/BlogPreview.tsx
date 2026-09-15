import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { blogService } from '@/services/blogService'
import { useAsync } from '@/hooks/useAsync'
import { SectionHead } from './SectionHead'
import { Reveal } from '@/components/motion/Reveal'
import { SITE_ROUTES } from '@/lib/constants'
import { formatDate } from '@/lib/utils'

export function BlogPreview() {
  const { data: allPublished } = useAsync(() => blogService.listPublished(), [])
  const posts = allPublished.slice(0, 3)
  if (posts.length === 0) return null

  return (
    <section className="py-24 md:py-32">
      <div className="wrap">
        <SectionHead
          eyebrow="Studio notes"
          title="From the blog"
          description="Field notes on shipping games, applied AI and the pipelines behind both."
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.08}>
              <Link to={SITE_ROUTES.blogDetail(post.slug)} data-cursor="link" className="group block">
                <div className="aspect-[16/10] overflow-hidden rounded-[var(--r-card)] border border-line">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-5 flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.1em] text-faint">
                  <span className="text-accent">{post.category}</span>
                  <span>·</span>
                  <span>{formatDate(post.publishedDate)}</span>
                </div>
                <h3 className="mt-3 text-[19px] font-semibold leading-snug text-text transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 flex justify-center">
          <Link
            to={SITE_ROUTES.blog}
            data-cursor="link"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-muted transition-colors hover:text-accent"
          >
            Read the blog
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
