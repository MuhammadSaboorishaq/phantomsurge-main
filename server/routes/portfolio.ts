import { Hono } from 'hono'
import { eq, asc } from 'drizzle-orm'
import { db, schema } from '../db/index.js'
import { requireAuth } from '../middleware/auth.js'
import { v4 as uuid } from 'uuid'

const app = new Hono()

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
}

// ── Public ────────────────────────────────────────────────────────

app.get('/', async (c) => {
  const rows = await db.select().from(schema.portfolio).orderBy(asc(schema.portfolio.order))
  return c.json(rows.map(toApi))
})

app.get('/published', async (c) => {
  const rows = await db.select().from(schema.portfolio).orderBy(asc(schema.portfolio.order))
  return c.json(rows.filter((r) => r.published).map(toApi))
})

app.get('/featured', async (c) => {
  const rows = await db.select().from(schema.portfolio).orderBy(asc(schema.portfolio.order))
  return c.json(rows.filter((r) => r.published && r.featured).map(toApi))
})

app.get('/categories', async (c) => {
  const rows = await db.select({ category: schema.portfolio.category }).from(schema.portfolio)
  const cats = [...new Set(rows.map((r) => r.category))].sort()
  return c.json(cats)
})

app.get('/slug/:slug', async (c) => {
  const [row] = await db.select().from(schema.portfolio).where(eq(schema.portfolio.slug, c.req.param('slug'))).limit(1)
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json(toApi(row))
})

app.get('/:id', async (c) => {
  const [row] = await db.select().from(schema.portfolio).where(eq(schema.portfolio.id, c.req.param('id'))).limit(1)
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json(toApi(row))
})

// ── Admin ─────────────────────────────────────────────────────────

app.post('/', requireAuth, async (c) => {
  const body = await c.req.json()
  const now = new Date()
  const id = `pf_${uuid().slice(0, 8)}`
  const rows = await db.select().from(schema.portfolio)

  const row = {
    id,
    title: body.title ?? 'Untitled Project',
    slug: body.slug ? slugify(body.slug) : slugify(body.title ?? `project-${Date.now()}`),
    category: body.category ?? 'Game Development',
    client: body.client ?? null,
    year: body.year ?? new Date().getFullYear(),
    shortDescription: body.shortDescription ?? '',
    longDescription: body.longDescription ?? '',
    thumbnail: body.thumbnail ?? '',
    heroImage: body.heroImage ?? body.thumbnail ?? '',
    gallery: body.gallery ?? [],
    videoUrl: body.videoUrl ?? null,
    youtubeUrl: body.youtubeUrl ?? null,
    vimeoUrl: body.vimeoUrl ?? null,
    technologies: body.technologies ?? [],
    services: body.services ?? [],
    challenge: body.challenge ?? null,
    solution: body.solution ?? null,
    results: body.results ?? null,
    websiteUrl: body.websiteUrl ?? null,
    githubUrl: body.githubUrl ?? null,
    caseStudyUrl: body.caseStudyUrl ?? null,
    featured: body.featured ?? false,
    published: body.published ?? false,
    order: body.order ?? rows.length + 1,
    createdAt: now,
    updatedAt: now,
  }

  await db.insert(schema.portfolio).values(row)
  return c.json(toApi(row), 201)
})

app.patch('/:id', requireAuth, async (c) => {
  const body = await c.req.json()
  const id = c.req.param('id')
  delete body.createdAt
  body.updatedAt = new Date()
  if (body.slug) body.slug = slugify(body.slug)

  await db.update(schema.portfolio).set(body).where(eq(schema.portfolio.id, id))
  const [updated] = await db.select().from(schema.portfolio).where(eq(schema.portfolio.id, id)).limit(1)
  if (!updated) return c.json({ error: 'Not found' }, 404)
  return c.json(toApi(updated))
})

app.delete('/:id', requireAuth, async (c) => {
  await db.delete(schema.portfolio).where(eq(schema.portfolio.id, c.req.param('id')))
  return c.json({ ok: true })
})

app.post('/reorder', requireAuth, async (c) => {
  const { orderedIds } = await c.req.json<{ orderedIds: string[] }>()
  for (let i = 0; i < orderedIds.length; i++) {
    await db.update(schema.portfolio).set({ order: i + 1 }).where(eq(schema.portfolio.id, orderedIds[i]))
  }
  return c.json({ ok: true })
})

app.post('/:id/duplicate', requireAuth, async (c) => {
  const [original] = await db.select().from(schema.portfolio).where(eq(schema.portfolio.id, c.req.param('id'))).limit(1)
  if (!original) return c.json({ error: 'Not found' }, 404)

  const now = new Date()
  const copy = {
    ...original,
    id: `pf_${uuid().slice(0, 8)}`,
    title: `${original.title} (Copy)`,
    slug: `${original.slug}-copy-${Date.now().toString(36)}`,
    published: false,
    featured: false,
    createdAt: now,
    updatedAt: now,
  }
  await db.insert(schema.portfolio).values(copy)
  return c.json(toApi(copy), 201)
})

function toApi(row: typeof schema.portfolio.$inferSelect) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    client: row.client,
    year: row.year,
    shortDescription: row.shortDescription,
    longDescription: row.longDescription,
    thumbnail: row.thumbnail,
    heroImage: row.heroImage,
    gallery: row.gallery,
    videoUrl: row.videoUrl,
    youtubeUrl: row.youtubeUrl,
    vimeoUrl: row.vimeoUrl,
    technologies: row.technologies,
    services: row.services,
    challenge: row.challenge,
    solution: row.solution,
    results: row.results,
    websiteUrl: row.websiteUrl,
    githubUrl: row.githubUrl,
    caseStudyUrl: row.caseStudyUrl,
    featured: row.featured,
    published: row.published,
    order: row.order,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export default app
