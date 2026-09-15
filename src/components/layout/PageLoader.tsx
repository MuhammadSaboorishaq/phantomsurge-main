import { StreakMark } from '@/components/brand/StreakMark'

export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <StreakMark className="h-10 w-10 animate-pulse-glow opacity-70" />
    </div>
  )
}
