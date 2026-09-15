import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { PortfolioItem } from '@/types'
import { useMouseParallax } from '@/hooks/useMousePosition'
import { useReducedMotionPref } from '@/hooks/useReducedMotion'
import { SITE_ROUTES } from '@/lib/constants'

export function PortfolioCard({ item, index = 0 }: { item: PortfolioItem; index?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotionPref()
  const pointer = useMouseParallax(ref, reduced)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={SITE_ROUTES.workDetail(item.slug)}
        data-cursor="image"
        className="group relative block aspect-[4/5] overflow-hidden rounded-[var(--r-card)] border border-line bg-surface transition-colors duration-300 hover:border-accent/40"
        style={{
          transform: reduced ? undefined : `perspective(900px) rotateX(${pointer.y * -3}deg) rotateY(${pointer.x * 3}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            src={item.thumbnail}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover"
            initial={{ scale: 1.06 }}
            whileHover={reduced ? undefined : { scale: 1.14 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
          <div className="absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100" style={{ background: 'radial-gradient(circle at 30% 20%, var(--c-accent-glow), transparent 55%)' }} />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-accent">{item.category}</span>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <h3 className="font-display translate-y-0 text-2xl uppercase text-white transition-transform duration-300 group-hover:-translate-y-1">
              {item.title}
            </h3>
            <ArrowUpRight
              size={20}
              className="shrink-0 -translate-y-1 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-[var(--r-card)] border border-accent opacity-0 transition-opacity duration-300 group-hover:opacity-30" />
      </Link>
    </motion.div>
  )
}
