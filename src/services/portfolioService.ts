import type { PortfolioItem } from '@/types'
import { api } from '@/lib/api'

export const portfolioService = {
  async list(): Promise<PortfolioItem[]> {
    return api.get('/portfolio')
  },
  async listPublished(): Promise<PortfolioItem[]> {
    return api.get('/portfolio/published')
  },
  async listFeatured(): Promise<PortfolioItem[]> {
    return api.get('/portfolio/featured')
  },
  async get(id: string): Promise<PortfolioItem | undefined> {
    return api.get<PortfolioItem>(`/portfolio/${id}`).catch(() => undefined)
  },
  async getBySlug(slug: string): Promise<PortfolioItem | undefined> {
    return api.get<PortfolioItem>(`/portfolio/slug/${slug}`).catch(() => undefined)
  },
  async categories(): Promise<string[]> {
    return api.get('/portfolio/categories')
  },
  async create(input: Partial<PortfolioItem>): Promise<PortfolioItem> {
    return api.post('/portfolio', input)
  },
  async update(id: string, patch: Partial<PortfolioItem>): Promise<PortfolioItem | undefined> {
    return api.patch<PortfolioItem>(`/portfolio/${id}`, patch).catch(() => undefined)
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/portfolio/${id}`)
  },
  async duplicate(id: string): Promise<PortfolioItem | undefined> {
    return api.post<PortfolioItem>(`/portfolio/${id}/duplicate`).catch(() => undefined)
  },
  async reorder(orderedIds: string[]): Promise<void> {
    await api.post('/portfolio/reorder', { orderedIds })
  },
}
