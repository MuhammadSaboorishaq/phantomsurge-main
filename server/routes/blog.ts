import { Hono } from 'hono'
import { eq, desc } from 'drizzle-orm'
import { db, schema } from '../db/index.js'
import { requireAuth } from '../middleware/auth.js'
import { v4 as uuid } from 'uuid'

const app = new Hono()

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
}

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

// ── Public ────────────────────────────────────────────────────────

app.get('/', async (c) => {
  const rows = await db.select().from(schema.blogPosts).orderBy(desc(schema.blogPosts.publishedDate))
  return c.json(rows.map(toApi))
})

app.get('/published', async (c) => {
  const rows = await db.select().from(schema.blogPosts).orderBy(desc(schema.blogPosts.publishedDate))
  return c.json(rows.filter((r) => r.published).map(toApi))
})

app.get('/featured', async (c) => {
  const rows = await db.select().from(schema.blogPosts).orderBy(desc(schema.blogPosts.publishedDate))
  return c.json(rows.filter((r) => r.published && r.featured).map(toApi))
})

app.get('/categories', async (c) => {
  const rows = await db.select({ category: schema.blogPosts.category }).from(schema.blogPosts)
  return c.json([...new Set(rows.map((r) => r.category))].sort())
})

app.get('/slug/:slug', async (c) => {
  const [row] = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.slug, c.req.param('slug'))).limit(1)
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json(toApi(row))
})

app.get('/:id', async (c) => {
  const [row] = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.id, c.req.param('id'))).limit(1)
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json(toApi(row))
})

// ── Admin ─────────────────────────────────────────────────────────

app.post('/', requireAuth, async (c) => {
  const body = await c.req.json()
  const row = {
    id: `bp_${uuid().slice(0, 8)}`,
    title: body.title ?? 'Untitled Post',
    slug: body.slug ? slugify(body.slug) : slugify(body.title ?? `post-${Date.now()}`),
    excerpt: body.excerpt ?? '',
    content: body.content ?? '',
    coverImage: body.coverImage ?? '',
    author: body.author ?? 'Phantom Surge Studios',
    category: body.category ?? 'Studio Notes',
    tags: body.tags ?? [],
    publishedDate: body.publishedDate ? new Date(body.publishedDate) : new Date(),
    readingTime: body.content ? readingTime(body.content) : 1,
    featured: body.featured ?? false,
    published: body.published ?? false,
  }
  await db.insert(schema.blogPosts).values(row)
  return c.json(toApi(row), 201)
})

app.patch('/:id', requireAuth, async (c) => {
  const body = await c.req.json()
  if (body.slug) body.slug = slugify(body.slug)
  if (body.content) body.readingTime = readingTime(body.content)
  if (body.publishedDate) body.publishedDate = new Date(body.publishedDate)

  await db.update(schema.blogPosts).set(body).where(eq(schema.blogPosts.id, c.req.param('id')))
  const [updated] = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.id, c.req.param('id'))).limit(1)
  if (!updated) return c.json({ error: 'Not found' }, 404)
  return c.json(toApi(updated))
})

app.delete('/:id', requireAuth, async (c) => {
  await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, c.req.param('id')))
  return c.json({ ok: true })
})

function toApi(row: typeof schema.blogPosts.$inferSelect) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.coverImage,
    author: row.author,
    category: row.category,
    tags: row.tags,
    publishedDate: row.publishedDate.toISOString(),
    readingTime: row.readingTime,
    featured: row.featured,
    published: row.published,
  }
}

export default app
