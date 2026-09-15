import { Hono } from 'hono'
import { eq, asc } from 'drizzle-orm'
import { db, schema } from '../db/index.js'
import { requireAuth } from '../middleware/auth.js'
import { v4 as uuid } from 'uuid'

const app = new Hono()

app.get('/', async (c) => {
  const rows = await db.select().from(schema.testimonials).orderBy(asc(schema.testimonials.order))
  return c.json(rows)
})

app.get('/published', async (c) => {
  const rows = await db.select().from(schema.testimonials).orderBy(asc(schema.testimonials.order))
  return c.json(rows.filter((r) => r.published))
})

app.get('/featured', async (c) => {
  const rows = await db.select().from(schema.testimonials).orderBy(asc(schema.testimonials.order))
  return c.json(rows.filter((r) => r.published && r.featured))
})

app.get('/:id', async (c) => {
  const [row] = await db.select().from(schema.testimonials).where(eq(schema.testimonials.id, c.req.param('id'))).limit(1)
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json(row)
})

app.post('/', requireAuth, async (c) => {
  const body = await c.req.json()
  const rows = await db.select().from(schema.testimonials)
  const row = {
    id: `te_${uuid().slice(0, 8)}`,
    name: body.name ?? 'New Client',
    role: body.role ?? '',
    company: body.company ?? '',
    avatar: body.avatar ?? null,
    quote: body.quote ?? '',
    rating: body.rating ?? 5,
    published: body.published ?? true,
    featured: body.featured ?? false,
    order: body.order ?? rows.length + 1,
  }
  await db.insert(schema.testimonials).values(row)
  return c.json(row, 201)
})

app.patch('/:id', requireAuth, async (c) => {
  const body = await c.req.json()
  await db.update(schema.testimonials).set(body).where(eq(schema.testimonials.id, c.req.param('id')))
  const [updated] = await db.select().from(schema.testimonials).where(eq(schema.testimonials.id, c.req.param('id'))).limit(1)
  if (!updated) return c.json({ error: 'Not found' }, 404)
  return c.json(updated)
})

app.delete('/:id', requireAuth, async (c) => {
  await db.delete(schema.testimonials).where(eq(schema.testimonials.id, c.req.param('id')))
  return c.json({ ok: true })
})

app.post('/reorder', requireAuth, async (c) => {
  const { orderedIds } = await c.req.json<{ orderedIds: string[] }>()
  for (let i = 0; i < orderedIds.length; i++) {
    await db.update(schema.testimonials).set({ order: i + 1 }).where(eq(schema.testimonials.id, orderedIds[i]))
  }
  return c.json({ ok: true })
})

export default app
