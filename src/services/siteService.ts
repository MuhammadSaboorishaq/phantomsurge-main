import type { SiteSettings } from '@/types'
import { api } from '@/lib/api'

export const siteService = {
  async get(): Promise<SiteSettings> {
    return api.get('/settings/site')
  },
  async update(patch: Partial<SiteSettings>): Promise<SiteSettings> {
    return api.patch('/settings/site', patch)
  },
  async reset(): Promise<SiteSettings> {
    await api.post('/settings/site/reset')
    return api.get('/settings/site')
  },
}
