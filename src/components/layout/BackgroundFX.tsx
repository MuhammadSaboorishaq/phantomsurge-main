import { useMemo } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { useReducedMotionPref } from '@/hooks/useReducedMotion'
import { StreakMark } from '@/components/brand/StreakMark'

/**
 * Reusable ambient background system. Effects are toggled from the theme
 * (admin-controlled): grid, glow, noise, particles, streaks. Kept to
 * transform/opacity-only CSS animation — no canvas — to stay cheap on the GPU.
 */
export function BackgroundFX({ variant = 'default' }: { variant?: 'default' | 'hero' | 'contact' }) {
  const { theme } = useTheme()
  const reduced = useReducedMotionPref()
  const fx = theme.backgroundEffects

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        size: 1 + (i % 3),
        delay: (i % 6) * 0.6,
      })),
    [],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {fx.grid && <div className="absolute inset-0 bg-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]" />}

      {fx.glow && variant === 'hero' && (
        <div
          className="absolute -top-1/4 right-[-10%] h-[600px] w-[600px] rounded-full opacity-[0.14] blur-[120px]"
          style={{ background: 'var(--c-accent)' }}
        />
      )}
      {fx.glow && variant === 'contact' && (
        <div
          className="absolute -top-1/3 right-[-15%] h-[420px] w-[420px] rounded-full opacity-[0.12] blur-[100px]"
          style={{ background: 'var(--c-accent)' }}
        />
      )}

      {fx.streaks && variant === 'hero' && (
        <StreakMark className="absolute -right-[10%] -top-[8%] w-[min(70vw,780px)] opacity-70" />
      )}
      {fx.streaks && variant === 'contact' && (
        <StreakMark className="absolute -right-[15%] -top-[25%] w-[55%] opacity-40" />
      )}

      {fx.noise && <div className="noise-overlay absolute inset-0" />}

      {fx.particles && !reduced && (
        <div className="absolute inset-0">
          {particles.map((p) => (
            <span
              key={p.id}
              className="animate-pulse-glow absolute rounded-full bg-accent/60"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
