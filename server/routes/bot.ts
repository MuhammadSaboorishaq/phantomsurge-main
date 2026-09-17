import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db, schema } from '../db/index.js'
import { v4 as uuid } from 'uuid'

const app = new Hono()

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
}

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function requireBotKey(c: any, next: any) {
  const key = c.req.header('x-bot-key')
  if (!key || key !== process.env.BOT_API_KEY) {
    return c.json({ error: 'Invalid or missing bot API key' }, 401)
  }
  return next()
}

app.post('/blog', requireBotKey, async (c) => {
  const body = await c.req.json()

  if (!body.title) return c.json({ error: 'title is required' }, 400)
  if (!body.content) return c.json({ error: 'content is required' }, 400)

  const id = `bp_${uuid().slice(0, 8)}`
  const slug = body.slug ? slugify(body.slug) : slugify(body.title)

  const existing = await db.select({ id: schema.blogPosts.id })
    .from(schema.blogPosts)
    .where(eq(schema.blogPosts.slug, slug))
    .limit(1)

  const finalSlug = existing.length > 0 ? `${slug}-${Date.now().toString(36)}` : slug

  const row = {
    id,
    title: body.title,
    slug: finalSlug,
    excerpt: body.excerpt ?? '',
    content: body.content,
    coverImage: body.coverImage ?? '',
    author: body.author ?? 'PhantomSurge AI',
    category: body.category ?? 'Studio Notes',
    tags: body.tags ?? [],
    publishedDate: new Date(),
    readingTime: readingTime(body.content),
    featured: false,
    published: false,
  }

  await db.insert(schema.blogPosts).values(row)

  return c.json({
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: 'draft',
    message: 'Blog post created as draft. Review and publish from the admin panel.',
  }, 201)
})

export default app
