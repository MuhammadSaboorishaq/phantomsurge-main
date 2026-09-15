import { Hono } from 'hono'
import { eq, asc } from 'drizzle-orm'
import { db, schema } from '../db/index.js'
import { requireAuth } from '../middleware/auth.js'
import { v4 as uuid } from 'uuid'

const app = new Hono()

app.get('/', async (c) => {
  const rows = await db.select().from(schema.team).orderBy(asc(schema.team.order))
  return c.json(rows)
})

app.get('/published', async (c) => {
  const rows = await db.select().from(schema.team).orderBy(asc(schema.team.order))
  return c.json(rows.filter((r) => r.published))
})

app.get('/featured', async (c) => {
  const rows = await db.select().from(schema.team).orderBy(asc(schema.team.order))
  return c.json(rows.filter((r) => r.published && r.featured))
})

app.get('/:id', async (c) => {
  const [row] = await db.select().from(schema.team).where(eq(schema.team.id, c.req.param('id'))).limit(1)
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json(row)
})

app.post('/', requireAuth, async (c) => {
  const body = await c.req.json()
  const rows = await db.select().from(schema.team)
  const row = {
    id: `tm_${uuid().slice(0, 8)}`,
    name: body.name ?? 'New Member',
    role: body.role ?? '',
    department: body.department ?? '',
    bio: body.bio ?? '',
    avatar: body.avatar ?? null,
    social: body.social ?? {},
    featured: body.featured ?? false,
    published: body.published ?? true,
    order: body.order ?? rows.length + 1,
  }
  await db.insert(schema.team).values(row)
  return c.json(row, 201)
})

app.patch('/:id', requireAuth, async (c) => {
  const body = await c.req.json()
  await db.update(schema.team).set(body).where(eq(schema.team.id, c.req.param('id')))
  const [updated] = await db.select().from(schema.team).where(eq(schema.team.id, c.req.param('id'))).limit(1)
  if (!updated) return c.json({ error: 'Not found' }, 404)
  return c.json(updated)
})

app.delete('/:id', requireAuth, async (c) => {
  await db.delete(schema.team).where(eq(schema.team.id, c.req.param('id')))
  return c.json({ ok: true })
})

app.post('/reorder', requireAuth, async (c) => {
  const { orderedIds } = await c.req.json<{ orderedIds: string[] }>()
  for (let i = 0; i < orderedIds.length; i++) {
    await db.update(schema.team).set({ order: i + 1 }).where(eq(schema.team.id, orderedIds[i]))
  }
  return c.json({ ok: true })
})

export default app
