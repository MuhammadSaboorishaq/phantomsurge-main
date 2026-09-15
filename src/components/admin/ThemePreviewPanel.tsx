import { useTheme } from '@/context/ThemeContext'
import { StreakMark } from '@/components/brand/StreakMark'
import { BackgroundFX } from '@/components/layout/BackgroundFX'

/**
 * Live preview block — reads the same CSS variables the public site uses,
 * so it updates instantly as the admin edits theme controls. No iframe or
 * reload required.
 */
export function ThemePreviewPanel() {
  const { theme } = useTheme()
  const cardClass =
    theme.cardStyle === 'glass'
      ? 'backdrop-blur-xl bg-surface/40 border-line-strong'
      : theme.cardStyle === 'minimal'
        ? 'border-transparent bg-transparent'
        : theme.cardStyle === 'bordered'
          ? 'border-2 border-line-strong bg-transparent'
          : 'border-line bg-surface'

  return (
    <div className="sticky top-24 overflow-hidden rounded-[var(--r-card)] border border-line-strong bg-bg">
      <div className="border-b border-line-strong px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-wide text-faint">
        Live Preview
      </div>
      <div className="relative overflow-hidden p-8">
        <BackgroundFX variant="hero" />
        <div className="relative z-[2]">
          <span className="eyebrow">Games &amp; AI Studio</span>
          <h2 className="font-display chrome-text mt-3 text-3xl leading-[1.02]">
            We build the
            <br />
            next surge in <span className="accent-text" style={{ WebkitTextFillColor: 'var(--c-accent)' }}>games &amp; AI</span>
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-[var(--r-control)] bg-accent px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-[#04110f]">
              Start a project
            </button>
            <button className="rounded-[var(--r-control)] border border-line-strong px-5 py-2.5 font-mono text-[11px] uppercase tracking-wide text-text">
              View work
            </button>
          </div>

          <div className={`mt-7 rounded-[var(--r-card)] border p-5 ${cardClass}`}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-faint">01</span>
              <StreakMark className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-base font-semibold text-text">Game Development</h3>
            <p className="mt-1 text-xs text-muted">Full-cycle builds across Unreal and Unity.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
