import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { StreakMark } from '@/components/brand/StreakMark'
import { SEO } from '@/components/layout/SEO'
import { SITE_ROUTES } from '@/lib/constants'

export default function NotFound() {
  return (
    <>
      <SEO title="Signal Lost" noIndex />
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <StreakMark className="mx-auto mb-8 h-20 w-20 opacity-80" />
        </motion.div>
        <span className="eyebrow justify-center">Error 404</span>
        <h1 className="font-display chrome-text mt-5 text-[clamp(40px,8vw,110px)] leading-none">Signal Lost</h1>
        <p className="mx-auto mt-5 max-w-md text-[15px] text-muted">
          The requested sector could not be located. It may have been moved, decommissioned, or never existed in this
          timeline.
        </p>
        <Link
          to={SITE_ROUTES.home}
          className="mt-9 inline-flex items-center gap-2.5 rounded-[var(--r-control)] bg-accent px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[#04110f]"
        >
          Back to base
        </Link>
      </section>
    </>
  )
}
