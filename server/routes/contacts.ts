import { Hono } from 'hono'
import { eq, desc, sql } from 'drizzle-orm'
import { db, schema } from '../db'
import { requireAuth } from '../middleware/auth'
import { v4 as uuid } from 'uuid'

const app = new Hono()

// Public — contact form submission (no auth required)
app.post('/submit', async (c) => {
  const body = await c.req.json()
  if (!body.name || !body.email || !body.message) {
    return c.json({ error: 'Name, email, and message are required' }, 400)
  }
  const row = {
    id: `msg_${uuid().slice(0, 8)}`,
    name: body.name,
    email: body.email,
    company: body.company ?? null,
    projectType: body.projectType ?? 'other',
    budget: body.budget ?? 'not-sure',
    message: body.message,
    status: 'new' as const,
    createdAt: new Date(),
  }
  await db.insert(schema.contactMessages).values(row)
  return c.json({ id: row.id, status: row.status, createdAt: row.createdAt.toISOString() }, 201)
})

// Admin — list all messages
app.get('/', requireAuth, async (c) => {
  const rows = await db.select().from(schema.contactMessages).orderBy(desc(schema.contactMessages.createdAt))
  return c.json(rows.map(toApi))
})

app.get('/unread-count', requireAuth, async (c) => {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.contactMessages)
    .where(eq(schema.contactMessages.status, 'new'))
  return c.json({ count: Number(result.count) })
})

app.get('/:id', requireAuth, async (c) => {
  const [row] = await db.select().from(schema.contactMessages).where(eq(schema.contactMessages.id, c.req.param('id'))).limit(1)
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json(toApi(row))
})

app.patch('/:id/status', requireAuth, async (c) => {
  const { status } = await c.req.json<{ status: string }>()
  await db.update(schema.contactMessages).set({ status }).where(eq(schema.contactMessages.id, c.req.param('id')))
  return c.json({ ok: true })
})

app.delete('/:id', requireAuth, async (c) => {
  await db.delete(schema.contactMessages).where(eq(schema.contactMessages.id, c.req.param('id')))
  return c.json({ ok: true })
})

function toApi(row: typeof schema.contactMessages.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company,
    projectType: row.projectType,
    budget: row.budget,
    message: row.message,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  }
}

export default app
