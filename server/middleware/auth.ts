import { createMiddleware } from 'hono/factory'
import pkg from 'jsonwebtoken'
const { sign, verify } = pkg

export interface JwtPayload {
  userId: string
  email: string
  role: string
}

const JWT_SECRET = () => process.env.JWT_SECRET ?? 'dev-secret-change-me'
const TOKEN_EXPIRY = '8h'

export function signToken(payload: JwtPayload): string {
  return sign(payload, JWT_SECRET(), { expiresIn: TOKEN_EXPIRY })
}

export function verifyToken(token: string): JwtPayload {
  return verify(token, JWT_SECRET()) as JwtPayload
}

export const requireAuth = createMiddleware<{
  Variables: { user: JwtPayload }
}>(async (c, next) => {
  const header = c.req.header('Authorization')
  if (!header?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  try {
    const payload = verifyToken(header.slice(7))
    c.set('user', payload)
    await next()
  } catch {
    return c.json({ error: 'Invalid or expired token' }, 401)
  }
})
