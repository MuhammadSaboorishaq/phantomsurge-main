import { useSite } from '@/context/SiteContext'
import { StreakMark } from '@/components/brand/StreakMark'

export function MaintenanceScreen() {
  const { settings } = useSite()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <StreakMark className="mb-8 h-16 w-16 opacity-80" />
      <span className="eyebrow justify-center">Scheduled maintenance</span>
      <h1 className="font-display chrome-text mt-5 text-4xl uppercase md:text-6xl">Systems offline</h1>
      <p className="mt-4 max-w-md text-sm text-muted">
        {settings.brandName} is currently undergoing scheduled maintenance. We&rsquo;ll be back online shortly.
      </p>
      <a href={`mailto:${settings.email}`} className="mt-8 font-mono text-xs uppercase tracking-widest text-accent">
        {settings.email}
      </a>
    </div>
  )
}
