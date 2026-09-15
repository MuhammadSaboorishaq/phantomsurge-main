import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AnimationIntensity, BackgroundEffects, CardStyle, HeroStyle, RadiusStyle, ThemeSettings } from '@/types'
import { themeService } from '@/services/themeService'
import { DEFAULT_THEME_SETTINGS, THEME_PRESETS } from '@/data/seed'

interface ThemeContextValue {
  theme: ThemeSettings
  presets: typeof THEME_PRESETS
  setColors: (colors: Partial<ThemeSettings['colors']>) => void
  setFonts: (fonts: Partial<ThemeSettings['fonts']>) => void
  setRadius: (radius: RadiusStyle) => void
  setAnimationIntensity: (intensity: AnimationIntensity) => void
  setBackgroundEffects: (effects: Partial<BackgroundEffects>) => void
  setHeroStyle: (style: HeroStyle) => void
  setCardStyle: (style: CardStyle) => void
  applyPreset: (presetId: string) => void
  resetTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const RADIUS_MAP: Record<RadiusStyle, { card: string; control: string }> = {
  sharp: { card: '2px', control: '2px' },
  subtle: { card: '8px', control: '6px' },
  rounded: { card: '20px', control: '12px' },
}

const MOTION_MAP: Record<AnimationIntensity, { fast: string; normal: string; cinematic: string; scale: string }> = {
  minimal: { fast: '0.1s', normal: '0.15s', cinematic: '0.2s', scale: '0.4' },
  normal: { fast: '0.2s', normal: '0.4s', cinematic: '0.8s', scale: '1' },
  cinematic: { fast: '0.3s', normal: '0.6s', cinematic: '1.1s', scale: '1.4' },
}

function hexToRgba(hex: string, alpha: number): string {
  if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex
  const clean = hex.replace('#', '')
  const bigint = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function applyThemeToDocument(theme: ThemeSettings) {
  const root = document.documentElement.style
  const { colors, fonts, radius, animationIntensity } = theme

  root.setProperty('--c-bg', colors.background)
  root.setProperty('--c-bg-alt', colors.backgroundAlt)
  root.setProperty('--c-surface', colors.surface)
  root.setProperty('--c-surface-2', colors.surface)
  root.setProperty('--c-line', colors.border)
  root.setProperty('--c-line-strong', colors.border.startsWith('rgba') ? colors.border.replace(/[\d.]+\)$/, '0.2)') : colors.border)
  root.setProperty('--c-primary', colors.primary)
  root.setProperty('--c-secondary', colors.secondary)
  root.setProperty('--c-accent', colors.accent)
  root.setProperty('--c-accent-dim', hexToRgba(colors.accent, 0.35))
  root.setProperty('--c-accent-glow', hexToRgba(colors.accent, 0.45))
  root.setProperty('--c-text', colors.text)
  root.setProperty('--c-muted', colors.mutedText)
  root.setProperty('--c-faint', hexToRgba(colors.mutedText, 0.7))
  root.setProperty('--c-chrome-1', '#f2f4f6')
  root.setProperty('--c-chrome-2', '#c3cad0')
  root.setProperty('--c-chrome-3', '#7a828a')

  root.setProperty('--f-display', `'${fonts.heading}', sans-serif`)
  root.setProperty('--f-body', `'${fonts.body}', sans-serif`)
  root.setProperty('--f-mono', `'${fonts.mono}', monospace`)

  const r = RADIUS_MAP[radius]
  root.setProperty('--r-card', r.card)
  root.setProperty('--r-control', r.control)

  const m = MOTION_MAP[animationIntensity]
  root.setProperty('--m-fast', m.fast)
  root.setProperty('--m-normal', m.normal)
  root.setProperty('--m-cinematic', m.cinematic)
  root.setProperty('--m-scale', m.scale)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME_SETTINGS)

  useEffect(() => {
    themeService.get().then((data) => {
      if (data && Object.keys(data).length > 0) {
        setTheme((prev) => ({ ...prev, ...data }))
      }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    applyThemeToDocument(theme)
  }, [theme])

  const persist = useCallback((patch: Partial<ThemeSettings>) => {
    setTheme((prev) => {
      const next = { ...prev, ...patch }
      themeService.update(patch).catch(() => {})
      return next
    })
  }, [])

  const setColors = useCallback(
    (colors: Partial<ThemeSettings['colors']>) => {
      setTheme((prev) => {
        const merged = { ...prev.colors, ...colors }
        persist({ colors: merged })
        return prev
      })
    },
    [persist],
  )
  const setFonts = useCallback(
    (fonts: Partial<ThemeSettings['fonts']>) => {
      setTheme((prev) => {
        persist({ fonts: { ...prev.fonts, ...fonts } })
        return prev
      })
    },
    [persist],
  )
  const setRadius = useCallback((radius: RadiusStyle) => persist({ radius }), [persist])
  const setAnimationIntensity = useCallback(
    (animationIntensity: AnimationIntensity) => persist({ animationIntensity }),
    [persist],
  )
  const setBackgroundEffects = useCallback(
    (effects: Partial<BackgroundEffects>) => {
      setTheme((prev) => {
        persist({ backgroundEffects: { ...prev.backgroundEffects, ...effects } })
        return prev
      })
    },
    [persist],
  )
  const setHeroStyle = useCallback((heroStyle: HeroStyle) => persist({ heroStyle }), [persist])
  const setCardStyle = useCallback((cardStyle: CardStyle) => persist({ cardStyle }), [persist])

  const applyPreset = useCallback((presetId: string) => {
    themeService.applyPreset(presetId).then((result) => setTheme(result)).catch(() => {})
  }, [])

  const resetTheme = useCallback(() => {
    themeService.reset().then((result) => setTheme(result)).catch(() => {})
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      presets: THEME_PRESETS,
      setColors,
      setFonts,
      setRadius,
      setAnimationIntensity,
      setBackgroundEffects,
      setHeroStyle,
      setCardStyle,
      applyPreset,
      resetTheme,
    }),
    [theme, setColors, setFonts, setRadius, setAnimationIntensity, setBackgroundEffects, setHeroStyle, setCardStyle, applyPreset, resetTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
