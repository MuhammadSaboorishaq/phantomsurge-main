import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSite } from '@/context/SiteContext'
import { useTheme } from '@/context/ThemeContext'
import { useMouseParallax } from '@/hooks/useMousePosition'
import { useReducedMotionPref } from '@/hooks/useReducedMotion'
import { BackgroundFX } from '@/components/layout/BackgroundFX'
import { VideoBackground } from '@/components/layout/VideoBackground'
import { SITE_ROUTES } from '@/lib/constants'

export function Hero() {
  const { settings } = useSite()
  const { theme } = useTheme()
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotionPref()
  const pointer = useMouseParallax(ref, reduced)
  const centered = theme.heroStyle === 'centered'

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pb-24 pt-40 md:pb-28 md:pt-52"
    >
      {settings.media.heroVideo.enabled && settings.media.heroVideo.url && (
        <VideoBackground
          src={settings.media.heroVideo.url}
          eager
          overlayClassName="bg-gradient-to-b from-bg/85 via-bg/65 to-bg"
        />
      )}
      <BackgroundFX variant="hero" hasVideo={settings.media.heroVideo.enabled && !!settings.media.heroVideo.url} />

      {!reduced && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'radial-gradient(600px circle at var(--mx) var(--my), var(--c-accent-glow), transparent 60%)',
            opacity: 0.12,
          }}
          animate={{
            '--mx': `${50 + pointer.x * 12}%`,
            '--my': `${30 + pointer.y * 12}%`,
          }}
          transition={{ type: 'spring', stiffness: 40, damping: 20 }}
        />
      )}

      <div className={`wrap relative z-[2] ${centered ? 'text-center' : ''}`}>
        <div className={centered ? 'mx-auto max-w-3xl' : 'max-w-2xl'}>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
            style={centered ? { justifyContent: 'center' } : undefined}
          >
            {settings.tagline}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display chrome-text mt-6 text-[clamp(42px,7.4vw,88px)] leading-[0.98]"
          >
            We build the
            <br />
            next surge in
            <br />
            <span className="accent-text" style={{ WebkitTextFillColor: 'var(--c-accent)' }}>
              games &amp; AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`mt-7 text-lg text-muted ${centered ? 'mx-auto max-w-xl' : 'max-w-lg'}`}
          >
            {settings.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className={`mt-10 flex flex-wrap items-center gap-7 ${centered ? 'justify-center' : ''}`}
          >
            <Link
              to={SITE_ROUTES.contact}
              data-cursor="link"
              className="group inline-flex items-center gap-2.5 rounded-[var(--r-control)] bg-accent px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[#04110f] transition-shadow hover:shadow-[0_10px_32px_-6px_var(--c-accent-glow)]"
            >
              Start Your Project
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform group-hover:translate-x-0.5">
                <path d="M2 6H10M10 6L6 2M10 6L6 10" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </Link>
            <Link
              to={SITE_ROUTES.work}
              data-cursor="link"
              className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-muted transition-colors hover:text-text"
            >
              View recent work
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {!reduced && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="absolute bottom-6 left-1/2 z-[2] -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-faint"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.25em]">Scroll</span>
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
