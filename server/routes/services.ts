import { Hono } from 'hono'
import { eq, asc } from 'drizzle-orm'
import { db, schema } from '../db/index.js'
import { requireAuth } from '../middleware/auth.js'
import { v4 as uuid } from 'uuid'

const app = new Hono()

app.get('/', async (c) => {
  const rows = await db.select().from(schema.services).orderBy(asc(schema.services.order))
  return c.json(rows.map(toApi))
})

app.get('/enabled', async (c) => {
  const rows = await db.select().from(schema.services).orderBy(asc(schema.services.order))
  return c.json(rows.filter((r) => r.enabled).map(toApi))
})

app.get('/:id', async (c) => {
  const [row] = await db.select().from(schema.services).where(eq(schema.services.id, c.req.param('id'))).limit(1)
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json(toApi(row))
})

app.post('/', requireAuth, async (c) => {
  const body = await c.req.json()
  const rows = await db.select().from(schema.services)
  const row = {
    id: `svc_${uuid().slice(0, 8)}`,
    number: body.number ?? String(rows.length + 1).padStart(2, '0'),
    title: body.title ?? 'New Service',
    shortDescription: body.shortDescription ?? '',
    longDescription: body.longDescription ?? '',
    icon: body.icon ?? 'Sparkles',
    image: body.image ?? null,
    enabled: body.enabled ?? true,
    order: body.order ?? rows.length + 1,
  }
  await db.insert(schema.services).values(row)
  return c.json(toApi(row), 201)
})

app.patch('/:id', requireAuth, async (c) => {
  const body = await c.req.json()
  await db.update(schema.services).set(body).where(eq(schema.services.id, c.req.param('id')))
  const [updated] = await db.select().from(schema.services).where(eq(schema.services.id, c.req.param('id'))).limit(1)
  if (!updated) return c.json({ error: 'Not found' }, 404)
  return c.json(toApi(updated))
})

app.delete('/:id', requireAuth, async (c) => {
  await db.delete(schema.services).where(eq(schema.services.id, c.req.param('id')))
  return c.json({ ok: true })
})

app.post('/reorder', requireAuth, async (c) => {
  const { orderedIds } = await c.req.json<{ orderedIds: string[] }>()
  for (let i = 0; i < orderedIds.length; i++) {
    await db.update(schema.services).set({ order: i + 1 }).where(eq(schema.services.id, orderedIds[i]))
  }
  return c.json({ ok: true })
})

function toApi(row: typeof schema.services.$inferSelect) {
  return {
    id: row.id,
    number: row.number,
    title: row.title,
    shortDescription: row.shortDescription,
    longDescription: row.longDescription,
    icon: row.icon,
    image: row.image,
    enabled: row.enabled,
    order: row.order,
  }
}

export default app
