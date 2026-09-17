import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth.js'
import { put } from '@vercel/blob'

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

  return c.json({ url: blob.url, key: blob.pathname }, 201)
})

export default app
