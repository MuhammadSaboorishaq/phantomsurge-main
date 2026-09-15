import { useSite } from '@/context/SiteContext'
import { CountUp } from '@/components/motion/CountUp'
import { StreakMark } from '@/components/brand/StreakMark'

export function Stats() {
  const { settings } = useSite()
  const stats = settings.stats

  if (stats.length === 0) return null

  return (
    <div>
      <div className="wrap flex justify-center py-8">
        <StreakMark className="h-9 w-32 opacity-70" glow={false} />
      </div>
      <div className="grid grid-cols-1 border-y border-line sm:grid-cols-3">
        {stats.map((stat, i) => (
          <div key={stat.id} className={`px-8 py-12 text-center ${i > 0 ? 'sm:border-l sm:border-line' : ''}`}>
            <CountUp value={stat.value} className="font-display chrome-text text-[clamp(36px,4.4vw,56px)]" />
            <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              {stat.label}
              {stat.isDemo && <span className="ml-1.5 text-faint">(demo)</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
