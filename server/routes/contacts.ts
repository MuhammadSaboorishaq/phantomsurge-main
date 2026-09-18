import { Hono } from 'hono'
import { eq, desc, sql } from 'drizzle-orm'
import { db, schema } from '../db/index.js'
import { requireAuth } from '../middleware/auth.js'
import { v4 as uuid } from 'uuid'

const app = new Hono()

async function getNotifyEmail(): Promise<string | null> {
  const [row] = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.id, 'default')).limit(1)
  if (!row) return null
  const data = row.data as Record<string, unknown>
  return (data.contactEmail as string) || null
}

async function sendNotification(msg: { name: string; email: string; company: string | null; projectType: string; budget: string; message: string }) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) { console.log('[contact-notify] RESEND_API_KEY not set'); return }

  const to = await getNotifyEmail()
  if (!to) { console.log('[contact-notify] No contactEmail in settings'); return }

  console.log(`[contact-notify] Sending to ${to}`)

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PhantomSurge <noreply@phantomsurgestudios.com>',
        to,
        subject: `New Contact: ${msg.name} — ${msg.projectType}`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
            <h2 style="margin:0 0 20px;font-size:18px;color:#111">New Contact Form Submission</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px 12px;color:#666;width:120px">Name</td><td style="padding:8px 12px;color:#111;font-weight:500">${msg.name}</td></tr>
              <tr style="background:#f8f8f8"><td style="padding:8px 12px;color:#666">Email</td><td style="padding:8px 12px"><a href="mailto:${msg.email}" style="color:#0ea5e9">${msg.email}</a></td></tr>
              <tr><td style="padding:8px 12px;color:#666">Company</td><td style="padding:8px 12px;color:#111">${msg.company || '—'}</td></tr>
              <tr style="background:#f8f8f8"><td style="padding:8px 12px;color:#666">Project Type</td><td style="padding:8px 12px;color:#111">${msg.projectType}</td></tr>
              <tr><td style="padding:8px 12px;color:#666">Budget</td><td style="padding:8px 12px;color:#111">${msg.budget}</td></tr>
            </table>
            <div style="margin-top:20px;padding:16px;background:#f4f4f4;border-radius:8px">
              <p style="margin:0 0 4px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:0.05em">Message</p>
              <p style="margin:0;font-size:14px;color:#111;line-height:1.6;white-space:pre-wrap">${msg.message}</p>
            </div>
            <p style="margin-top:24px;font-size:12px;color:#999">View all messages in the <a href="https://www.phantomsurgestudios.com/admin/contacts" style="color:#0ea5e9">admin panel</a>.</p>
          </div>
        `,
      }),
    })
    const resBody = await res.json().catch(() => ({}))
    console.log(`[contact-notify] Resend response: ${res.status}`, resBody)
  } catch (err) {
    console.error('[contact-notify] Failed:', err)
  }
}

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

  sendNotification(row).catch(() => {})

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
