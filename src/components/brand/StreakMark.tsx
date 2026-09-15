import { useId } from 'react'
import { cn } from '@/lib/utils'

/**
 * The Phantom Surge signature streak motif — a chrome-gradient angular
 * sweep used as the logo mark, section dividers, and hero/contact
 * background accents. Each instance gets its own gradient/filter ids so
 * multiple copies never collide in the DOM.
 */
export function StreakMark({ className, glow = true }: { className?: string; glow?: boolean }) {
  const uid = useId()
  const gradId = `streak-grad-${uid}`
  const filterId = `streak-glow-${uid}`

  return (
    <svg viewBox="0 0 100 100" fill="none" className={cn('block', className)} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="var(--c-chrome-2)" />
          <stop offset="70%" stopColor="var(--c-chrome-3)" />
          <stop offset="100%" stopColor="var(--c-chrome-1)" />
        </linearGradient>
        {glow && (
          <filter id={filterId} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>
      <path
        d="M78 14 C58 34 40 50 24 62 C34 56 46 48 56 40 C42 54 30 64 18 72 C32 66 48 56 62 44 C50 58 36 70 22 80 C40 70 62 52 78 14 Z"
        stroke={`url(#${gradId})`}
        strokeWidth="2.4"
        fill="none"
        strokeLinejoin="round"
        filter={glow ? `url(#${filterId})` : undefined}
      />
    </svg>
  )
}
