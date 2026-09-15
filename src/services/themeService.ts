import type { ThemeSettings } from '@/types'
import { THEME_PRESETS } from '@/data/seed'
import { api } from '@/lib/api'

export const themeService = {
  async get(): Promise<ThemeSettings> {
    return api.get('/settings/theme')
  },
  async update(patch: Partial<ThemeSettings>): Promise<ThemeSettings> {
    return api.patch('/settings/theme', patch)
  },
  async applyPreset(presetId: string): Promise<ThemeSettings> {
    const preset = THEME_PRESETS.find((p) => p.id === presetId)
    if (!preset) return themeService.get()
    return api.patch('/settings/theme', { presetId, colors: preset.colors })
  },
  async reset(): Promise<ThemeSettings> {
    await api.post('/settings/theme/reset')
    return api.get('/settings/theme')
  },
  presets: THEME_PRESETS,
}
