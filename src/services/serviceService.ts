import type { Service } from '@/types'
import { api } from '@/lib/api'

export const serviceService = {
  async list(): Promise<Service[]> {
    return api.get('/services')
  },
  async listEnabled(): Promise<Service[]> {
    return api.get('/services/enabled')
  },
  async get(id: string): Promise<Service | undefined> {
    return api.get<Service>(`/services/${id}`).catch(() => undefined)
  },
  async create(input: Partial<Service>): Promise<Service> {
    return api.post('/services', input)
  },
  async update(id: string, patch: Partial<Service>): Promise<Service | undefined> {
    return api.patch<Service>(`/services/${id}`, patch).catch(() => undefined)
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/services/${id}`)
  },
  async reorder(orderedIds: string[]): Promise<void> {
    await api.post('/services/reorder', { orderedIds })
  },
}
