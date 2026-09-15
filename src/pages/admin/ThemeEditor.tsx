import { RotateCcw } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useToast } from '@/context/ToastContext'
import { ColorField } from '@/components/admin/ColorField'
import { ThemePreviewPanel } from '@/components/admin/ThemePreviewPanel'
import { Select } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { Button } from '@/components/ui/Button'
import { ensureGoogleFont, HEADING_FONTS, BODY_FONTS, MONO_FONTS } from '@/lib/fontLoader'
import { cn } from '@/lib/utils'
import type { AnimationIntensity, BackgroundEffects, CardStyle, HeroStyle, RadiusStyle } from '@/types'

const RADIUS_OPTIONS: { value: RadiusStyle; label: string }[] = [
  { value: 'sharp', label: 'Sharp' },
  { value: 'subtle', label: 'Subtle' },
  { value: 'rounded', label: 'Rounded' },
]
const ANIMATION_OPTIONS: { value: AnimationIntensity; label: string }[] = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'normal', label: 'Normal' },
  { value: 'cinematic', label: 'Cinematic' },
]
const HERO_OPTIONS: { value: HeroStyle; label: string }[] = [
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'centered', label: 'Centered' },
  { value: 'split', label: 'Split' },
]
const CARD_OPTIONS: { value: CardStyle; label: string }[] = [
  { value: 'technical', label: 'Technical' },
  { value: 'glass', label: 'Glass' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'bordered', label: 'Bordered' },
]
const BG_EFFECTS: { key: keyof BackgroundEffects; label: string }[] = [
  { key: 'grid', label: 'Grid' },
  { key: 'glow', label: 'Glow' },
  { key: 'noise', label: 'Noise' },
  { key: 'particles', label: 'Particles' },
  { key: 'streaks', label: 'Streaks' },
]

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'rounded-[var(--r-control)] border px-3.5 py-2 font-mono text-[11px] uppercase tracking-wide transition-colors',
            value === opt.value ? 'border-accent bg-accent/10 text-accent' : 'border-line text-muted hover:border-line-strong hover:text-text',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default function ThemeEditor() {
  const { theme, presets, setColors, setFonts, setRadius, setAnimationIntensity, setBackgroundEffects, setHeroStyle, setCardStyle, applyPreset, resetTheme } = useTheme()
  const { show } = useToast()

  function handleFontChange(kind: 'heading' | 'body' | 'mono', family: string) {
    ensureGoogleFont(family)
    setFonts({ [kind]: family })
  }

  return (
    <div className="grid grid-cols-1 gap-8 pb-16 xl:grid-cols-[1fr_380px]">
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl uppercase tracking-wide text-text">Theme</h1>
            <p className="mt-1 text-sm text-muted">Customize the visual identity of the site. Changes apply instantly.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={<RotateCcw size={13} />}
            onClick={() => {
              resetTheme()
              show('Theme reset to default.', 'info')
            }}
          >
            Reset to Default
          </Button>
        </div>

        <section className="rounded-[var(--r-card)] border border-line bg-surface/30 p-6">
          <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Presets</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  applyPreset(preset.id)
                  show(`Applied "${preset.name}" preset.`, 'success')
                }}
                className={cn(
                  'rounded-[var(--r-control)] border p-3 text-left transition-colors',
                  theme.presetId === preset.id ? 'border-accent' : 'border-line hover:border-line-strong',
                )}
              >
                <div className="mb-2.5 flex gap-1">
                  <span className="h-5 w-5 rounded-full border border-black/20" style={{ background: preset.colors.background }} />
                  <span className="h-5 w-5 rounded-full border border-black/20" style={{ background: preset.colors.accent }} />
                  <span className="h-5 w-5 rounded-full border border-black/20" style={{ background: preset.colors.surface }} />
                </div>
                <p className="text-xs font-medium text-text">{preset.name}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[var(--r-card)] border border-line bg-surface/30 p-6">
          <h2 className="mb-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Colors</h2>
          <div className="divide-y divide-line">
            <ColorField label="Primary" value={theme.colors.primary} onChange={(v) => setColors({ primary: v })} />
            <ColorField label="Secondary" value={theme.colors.secondary} onChange={(v) => setColors({ secondary: v })} />
            <ColorField label="Accent" value={theme.colors.accent} onChange={(v) => setColors({ accent: v })} />
            <ColorField label="Background" value={theme.colors.background} onChange={(v) => setColors({ background: v })} />
            <ColorField label="Background Alt" value={theme.colors.backgroundAlt} onChange={(v) => setColors({ backgroundAlt: v })} />
            <ColorField label="Surface" value={theme.colors.surface} onChange={(v) => setColors({ surface: v })} />
            <ColorField label="Text" value={theme.colors.text} onChange={(v) => setColors({ text: v })} />
            <ColorField label="Muted Text" value={theme.colors.mutedText} onChange={(v) => setColors({ mutedText: v })} />
          </div>
        </section>

        <section className="rounded-[var(--r-card)] border border-line bg-surface/30 p-6">
          <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Typography</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-wide text-muted">Heading Font</label>
              <Select value={theme.fonts.heading} onChange={(e) => handleFontChange('heading', e.target.value)}>
                {HEADING_FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
              </Select>
            </div>
            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-wide text-muted">Body Font</label>
              <Select value={theme.fonts.body} onChange={(e) => handleFontChange('body', e.target.value)}>
                {BODY_FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
              </Select>
            </div>
            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-wide text-muted">Mono Font</label>
              <Select value={theme.fonts.mono} onChange={(e) => handleFontChange('mono', e.target.value)}>
                {MONO_FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
              </Select>
            </div>
          </div>
        </section>

        <section className="rounded-[var(--r-card)] border border-line bg-surface/30 p-6">
          <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Border Radius</h2>
          <SegmentedControl options={RADIUS_OPTIONS} value={theme.radius} onChange={setRadius} />
        </section>

        <section className="rounded-[var(--r-card)] border border-line bg-surface/30 p-6">
          <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Animation Intensity</h2>
          <SegmentedControl options={ANIMATION_OPTIONS} value={theme.animationIntensity} onChange={setAnimationIntensity} />
        </section>

        <section className="rounded-[var(--r-card)] border border-line bg-surface/30 p-6">
          <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Background Effects</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {BG_EFFECTS.map((fx) => (
              <div key={fx.key} className="flex items-center justify-between rounded-[var(--r-control)] border border-line px-3.5 py-3">
                <span className="text-sm text-text">{fx.label}</span>
                <Switch checked={theme.backgroundEffects[fx.key]} onChange={(v) => setBackgroundEffects({ [fx.key]: v })} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[var(--r-card)] border border-line bg-surface/30 p-6">
          <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Hero Style</h2>
          <SegmentedControl options={HERO_OPTIONS} value={theme.heroStyle} onChange={setHeroStyle} />
        </section>

        <section className="rounded-[var(--r-card)] border border-line bg-surface/30 p-6">
          <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Card Style</h2>
          <SegmentedControl options={CARD_OPTIONS} value={theme.cardStyle} onChange={setCardStyle} />
        </section>
      </div>

      <div>
        <ThemePreviewPanel />
      </div>
    </div>
  )
}
