import type { BlogPost } from '@/types'
import { api } from '@/lib/api'

export const blogService = {
  async list(): Promise<BlogPost[]> {
    return api.get('/blog')
  },
  async listPublished(): Promise<BlogPost[]> {
    return api.get('/blog/published')
  },
  async listFeatured(): Promise<BlogPost[]> {
    return api.get('/blog/featured')
  },
  async get(id: string): Promise<BlogPost | undefined> {
    return api.get<BlogPost>(`/blog/${id}`).catch(() => undefined)
  },
  async getBySlug(slug: string): Promise<BlogPost | undefined> {
    return api.get<BlogPost>(`/blog/slug/${slug}`).catch(() => undefined)
  },
  async categories(): Promise<string[]> {
    return api.get('/blog/categories')
  },
  async create(input: Partial<BlogPost>): Promise<BlogPost> {
    return api.post('/blog', input)
  },
  async update(id: string, patch: Partial<BlogPost>): Promise<BlogPost | undefined> {
    return api.patch<BlogPost>(`/blog/${id}`, patch).catch(() => undefined)
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/blog/${id}`)
  },
}
