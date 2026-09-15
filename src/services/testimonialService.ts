import type { Testimonial } from '@/types'
import { api } from '@/lib/api'

export const testimonialService = {
  async list(): Promise<Testimonial[]> {
    return api.get('/testimonials')
  },
  async listPublished(): Promise<Testimonial[]> {
    return api.get('/testimonials/published')
  },
  async listFeatured(): Promise<Testimonial[]> {
    return api.get('/testimonials/featured')
  },
  async get(id: string): Promise<Testimonial | undefined> {
    return api.get<Testimonial>(`/testimonials/${id}`).catch(() => undefined)
  },
  async create(input: Partial<Testimonial>): Promise<Testimonial> {
    return api.post('/testimonials', input)
  },
  async update(id: string, patch: Partial<Testimonial>): Promise<Testimonial | undefined> {
    return api.patch<Testimonial>(`/testimonials/${id}`, patch).catch(() => undefined)
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/testimonials/${id}`)
  },
  async reorder(orderedIds: string[]): Promise<void> {
    await api.post('/testimonials/reorder', { orderedIds })
  },
}
