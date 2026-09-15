import type { AuthSession } from '@/types'
import { api, setToken, clearToken } from '@/lib/api'
import { STORAGE_PREFIX } from '@/lib/constants'

const SESSION_KEY = `${STORAGE_PREFIX}admin-session`

export const authService = {
  async login(email: string, password: string): Promise<AuthSession> {
    const session = await api.post<AuthSession>('/auth/login', { email, password })
    setToken(session.token)
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return session
  },

  logout(): void {
    clearToken()
    window.localStorage.removeItem(SESSION_KEY)
    api.post('/auth/logout').catch(() => {})
  },

  getSession(): AuthSession | null {
    if (typeof window === 'undefined') return null
    try {
      const raw = window.localStorage.getItem(SESSION_KEY)
      if (!raw) return null
      const session = JSON.parse(raw) as AuthSession
      if (session.expiresAt < Date.now()) {
        clearToken()
        window.localStorage.removeItem(SESSION_KEY)
        return null
      }
      return session
    } catch {
      return null
    }
  },
}
