import { Hono } from 'hono'
import pkg from 'bcryptjs'
const { compare } = pkg
import { eq } from 'drizzle-orm'
import { db, schema } from '../db/index.js'
import { signToken, requireAuth } from '../middleware/auth.js'

const app = new Hono()

app.post('/login', async (c) => {
  const body = await c.req.json<{ email: string; password: string }>().catch(() => null)
  if (!body?.email || !body?.password) {
    return c.json({ error: 'Email and password are required' }, 400)
  }

  const [user] = await db
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.email, body.email.trim().toLowerCase()))
    .limit(1)

  if (!user) return c.json({ error: 'Invalid email or password' }, 401)

  const valid = await compare(body.password, user.passwordHash)
  if (!valid) return c.json({ error: 'Invalid email or password' }, 401)

  const token = signToken({ userId: user.id, email: user.email, role: user.role })
  const expiresAt = Date.now() + 8 * 60 * 60 * 1000

  return c.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
    token,
    expiresAt,
  })
})

app.post('/logout', (c) => c.json({ ok: true }))

app.get('/me', requireAuth, async (c) => {
  const { userId } = c.get('user')
  const [user] = await db
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.id, userId))
    .limit(1)

  if (!user) return c.json({ error: 'User not found' }, 404)

  return c.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  })
})

export default app
