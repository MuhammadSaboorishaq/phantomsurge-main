import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db, schema } from '../db'
import { requireAuth } from '../middleware/auth'

const app = new Hono()

// ── Site Settings ─────────────────────────────────────────────────

app.get('/site', async (c) => {
  const [row] = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.id, 'default')).limit(1)
  if (!row) return c.json({})
  return c.json(row.data)
})

app.patch('/site', requireAuth, async (c) => {
  const patch = await c.req.json()
  const [existing] = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.id, 'default')).limit(1)

  if (!existing) {
    await db.insert(schema.siteSettings).values({ id: 'default', data: patch, updatedAt: new Date() })
    return c.json(patch)
  }

  const merged = { ...(existing.data as Record<string, unknown>), ...patch }
  await db.update(schema.siteSettings).set({ data: merged, updatedAt: new Date() }).where(eq(schema.siteSettings.id, 'default'))
  return c.json(merged)
})

app.post('/site/reset', requireAuth, async (c) => {
  await db.delete(schema.siteSettings).where(eq(schema.siteSettings.id, 'default'))
  return c.json({ ok: true })
})

// ── Theme Settings ────────────────────────────────────────────────

app.get('/theme', async (c) => {
  const [row] = await db.select().from(schema.themeSettings).where(eq(schema.themeSettings.id, 'default')).limit(1)
  if (!row) return c.json({})
  return c.json(row.data)
})

app.patch('/theme', requireAuth, async (c) => {
  const patch = await c.req.json()
  const [existing] = await db.select().from(schema.themeSettings).where(eq(schema.themeSettings.id, 'default')).limit(1)

  if (!existing) {
    await db.insert(schema.themeSettings).values({ id: 'default', data: patch, updatedAt: new Date() })
    return c.json(patch)
  }

  const merged = { ...(existing.data as Record<string, unknown>), ...patch }
  await db.update(schema.themeSettings).set({ data: merged, updatedAt: new Date() }).where(eq(schema.themeSettings.id, 'default'))
  return c.json(merged)
})

app.post('/theme/reset', requireAuth, async (c) => {
  await db.delete(schema.themeSettings).where(eq(schema.themeSettings.id, 'default'))
  return c.json({ ok: true })
})

export default app
