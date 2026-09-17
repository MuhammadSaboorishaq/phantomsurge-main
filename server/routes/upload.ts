import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth.js'
import { put, del, list } from '@vercel/blob'
import { db, schema } from '../db/index.js'

const app = new Hono()

const ALLOWED_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
  'image/gif',
])

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

app.post('/', requireAuth, async (c) => {
  const formData = await c.req.formData()
  const file = formData.get('file')
  const replaceUrl = formData.get('replaceUrl') as string | null

  if (!file || !(file instanceof File)) {
    return c.json({ error: 'No file provided' }, 400)
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return c.json({ error: 'File type not allowed. Accepted: PNG, JPG, WEBP, SVG, GIF' }, 400)
  }

  if (file.size > MAX_SIZE) {
    return c.json({ error: 'File too large (max 10MB)' }, 400)
  }

  const blob = await put(file.name, file, {
    access: 'public',
    contentType: file.type,
    addRandomSuffix: true,
  })

  if (replaceUrl && replaceUrl.includes('.vercel-storage.com')) {
    try { await del(replaceUrl) } catch {}
  }

  return c.json({ url: blob.url, key: blob.pathname }, 201)
})

// ── Cleanup orphaned blobs ───────────────────────────────────────

app.post('/cleanup', requireAuth, async (c) => {
  const referencedUrls = new Set<string>()

  const [portfolioRows, blogRows, teamRows, testimonialRows, serviceRows, settingsRows] = await Promise.all([
    db.select().from(schema.portfolio),
    db.select().from(schema.blogPosts),
    db.select().from(schema.team),
    db.select().from(schema.testimonials),
    db.select().from(schema.services),
    db.select().from(schema.siteSettings),
  ])

  for (const row of portfolioRows) {
    if (row.thumbnail) referencedUrls.add(row.thumbnail)
    if (row.heroImage) referencedUrls.add(row.heroImage)
    if (row.gallery) {
      for (const item of row.gallery) {
        if (item.url) referencedUrls.add(item.url)
      }
    }
  }
  for (const row of blogRows) {
    if (row.coverImage) referencedUrls.add(row.coverImage)
  }
  for (const row of teamRows) {
    if (row.avatar) referencedUrls.add(row.avatar)
  }
  for (const row of testimonialRows) {
    if (row.avatar) referencedUrls.add(row.avatar)
  }
  for (const row of serviceRows) {
    if (row.image) referencedUrls.add(row.image)
  }
  for (const row of settingsRows) {
    const data = row.data as Record<string, unknown>
    JSON.stringify(data, (_key, value) => {
      if (typeof value === 'string' && value.includes('.vercel-storage.com')) {
        referencedUrls.add(value)
      }
      return value
    })
  }

  let deleted = 0
  let cursor: string | undefined
  do {
    const result = await list({ cursor, limit: 100 })
    for (const blob of result.blobs) {
      if (!referencedUrls.has(blob.url)) {
        try {
          await del(blob.url)
          deleted++
        } catch {}
      }
    }
    cursor = result.hasMore ? result.cursor : undefined
  } while (cursor)

  return c.json({ deleted, referenced: referencedUrls.size })
})

export default app
