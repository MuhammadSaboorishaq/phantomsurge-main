import type { TeamMember } from '@/types'
import { api } from '@/lib/api'

export const teamService = {
  async list(): Promise<TeamMember[]> {
    return api.get('/team')
  },
  async listPublished(): Promise<TeamMember[]> {
    return api.get('/team/published')
  },
  async listFeatured(): Promise<TeamMember[]> {
    return api.get('/team/featured')
  },
  async get(id: string): Promise<TeamMember | undefined> {
    return api.get<TeamMember>(`/team/${id}`).catch(() => undefined)
  },
  async create(input: Partial<TeamMember>): Promise<TeamMember> {
    return api.post('/team', input)
  },
  async update(id: string, patch: Partial<TeamMember>): Promise<TeamMember | undefined> {
    return api.patch<TeamMember>(`/team/${id}`, patch).catch(() => undefined)
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/team/${id}`)
  },
  async reorder(orderedIds: string[]): Promise<void> {
    await api.post('/team/reorder', { orderedIds })
  },
}
