import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { useReducedMotionPref } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

interface VideoBackgroundProps {
  src: string
  className?: string
  overlayClassName?: string
  /** Skip the lazy-mount viewport gate — use for above-the-fold placements like the hero. */
  eager?: boolean
}

/**
 * Full-bleed, muted, looping background video confined to the section it's
 * placed in, with no controls and no audio.
 * - Respects `prefers-reduced-motion`: the <video> is never mounted at all for
 *   those users (no autoplay, no extra network fetch) — the section falls
 *   back to its existing static gradient/streak treatment.
 * - Lazy-mounts on scroll-into-view unless `eager` (avoids paying for a
 *   below-the-fold video's bytes if the visitor never scrolls that far).
 * - Always paired with a dark scrim so foreground text stays legible —
 *   pass `overlayClassName` to tune it per section.
 */
export function VideoBackground({ src, className, overlayClassName, eager = false }: VideoBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, margin: '200px 0px 200px 0px' })
  const reducedMotion = useReducedMotionPref()
  const shouldRender = !reducedMotion && (eager || inView)

  return (
    <div
      ref={containerRef}
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      {shouldRender && (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload={eager ? 'auto' : 'metadata'}
          className="h-full w-full object-cover"
        />
      )}
      <div className={cn('absolute inset-0 bg-gradient-to-b from-bg/75 via-bg/55 to-bg', overlayClassName)} />
    </div>
  )
}
