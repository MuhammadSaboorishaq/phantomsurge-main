import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { useReducedMotionPref } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'
import { getEmbedUrl } from '@/lib/video'

interface VideoBackgroundProps {
  src: string
  className?: string
  overlayClassName?: string
  eager?: boolean
}

export function VideoBackground({ src, className, overlayClassName, eager = false }: VideoBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, margin: '200px 0px 200px 0px' })
  const reducedMotion = useReducedMotionPref()
  const shouldRender = !reducedMotion && (eager || inView)

  const embedUrl = getEmbedUrl(src)

  return (
    <div
      ref={containerRef}
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      {shouldRender && embedUrl && (
        <iframe
          src={embedUrl}
          allow="autoplay; encrypted-media"
          className="absolute left-1/2 top-1/2 border-0"
          style={{
            width: 'max(100%, 177.78vh)',
            height: 'max(100%, 56.25vw)',
            transform: 'translate(-50%, -50%)',
          }}
          tabIndex={-1}
        />
      )}
      {shouldRender && !embedUrl && src && (
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
