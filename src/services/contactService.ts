import type { ContactMessage } from '@/types'
import { api } from '@/lib/api'

export type ContactSubmission = Omit<ContactMessage, 'id' | 'status' | 'createdAt'>

export const contactService = {
  async list(): Promise<ContactMessage[]> {
    return api.get('/contacts')
  },
  async get(id: string): Promise<ContactMessage | undefined> {
    return api.get<ContactMessage>(`/contacts/${id}`).catch(() => undefined)
  },
  async submit(input: ContactSubmission): Promise<ContactMessage> {
    return api.post('/contacts/submit', input)
  },
  async updateStatus(id: string, status: ContactMessage['status']): Promise<void> {
    await api.patch(`/contacts/${id}/status`, { status })
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/contacts/${id}`)
  },
  async unreadCount(): Promise<number> {
    const result = await api.get<{ count: number }>('/contacts/unread-count')
    return result.count
  },
}
