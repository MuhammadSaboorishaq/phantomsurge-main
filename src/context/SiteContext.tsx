import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { SectionKey, SiteSettings } from '@/types'
import { siteService } from '@/services/siteService'
import { DEFAULT_SITE_SETTINGS } from '@/data/seed'

interface SiteContextValue {
  settings: SiteSettings
  isLoading: boolean
  updateSettings: (patch: Partial<SiteSettings>) => void
  isSectionEnabled: (key: SectionKey) => boolean
  orderedSections: SiteSettings['sections']
  resetSettings: () => void
}

const SiteContext = createContext<SiteContextValue | null>(null)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    siteService.get().then((data) => {
      if (data && Object.keys(data).length > 0) {
        setSettings((prev) => ({ ...prev, ...data }))
      }
      setIsLoading(false)
    }).catch(() => setIsLoading(false))
  }, [])

  const updateSettings = useCallback((patch: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
    siteService.update(patch).catch(() => {})
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SITE_SETTINGS)
    siteService.reset().catch(() => {})
  }, [])

  const isSectionEnabled = useCallback(
    (key: SectionKey) => settings.sections.find((s) => s.key === key)?.enabled ?? true,
    [settings.sections],
  )

  const orderedSections = useMemo(
    () => [...settings.sections].sort((a, b) => a.order - b.order),
    [settings.sections],
  )

  const value = useMemo<SiteContextValue>(
    () => ({ settings, isLoading, updateSettings, isSectionEnabled, orderedSections, resetSettings }),
    [settings, isLoading, updateSettings, isSectionEnabled, orderedSections, resetSettings],
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used within SiteProvider')
  return ctx
}
