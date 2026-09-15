import { Link } from 'react-router-dom'
import { useSite } from '@/context/SiteContext'
import { StreakMark } from './StreakMark'
import { cn } from '@/lib/utils'

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  const { settings } = useSite()
  const markSrc = settings.logo.mark
  const words = settings.brandName.trim().split(/\s+/)
  const sub = words.length > 1 ? words[words.length - 1] : 'STUDIOS'
  const main = words.length > 1 ? words.slice(0, -1).join(' ') : settings.brandName

  return (
    <Link to="/" className={cn('group flex items-center gap-3', className)} aria-label={`${settings.brandName} — home`}>
      {markSrc ? (
        <img src={markSrc} alt="" className="h-7 w-7 object-contain" />
      ) : (
        <StreakMark className="h-7 w-7 transition-transform duration-300 group-hover:scale-105" />
      )}
      {!compact && (
        <span className="font-display text-[17px] font-bold uppercase leading-none tracking-[0.05em] text-text">
          {main}
          <span className="mt-0.5 block font-mono text-[8px] font-normal tracking-[0.4em] text-muted">{sub}</span>
        </span>
      )}
    </Link>
  )
}
