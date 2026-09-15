import 'dotenv/config'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'

import auth from './routes/auth'
import portfolio from './routes/portfolio'
import blog from './routes/blog'
import services from './routes/services'
import teamRoutes from './routes/team'
import testimonials from './routes/testimonials'
import contacts from './routes/contacts'
import settings from './routes/settings'
import upload from './routes/upload'

const app = new Hono()

// ── Global middleware ─────────────────────────────────────────────

app.use('*', logger())
app.use('*', secureHeaders())
app.use(
  '/api/*',
  cors({
    origin: process.env.CORS_ORIGIN ?? '*',
    credentials: true,
  }),
)

// ── API routes ────────────────────────────────────────────────────

app.route('/api/auth', auth)
app.route('/api/portfolio', portfolio)
app.route('/api/blog', blog)
app.route('/api/services', services)
app.route('/api/team', teamRoutes)
app.route('/api/testimonials', testimonials)
app.route('/api/contacts', contacts)
app.route('/api/settings', settings)
app.route('/api/upload', upload)

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// ── Serve Vite build (production) ─────────────────────────────────

app.use('/*', serveStatic({ root: './dist' }))

// SPA fallback — serve index.html for all non-API, non-static routes
app.get('*', serveStatic({ root: './dist', path: 'index.html' }))

// ── Start ─────────────────────────────────────────────────────────

const port = Number(process.env.PORT) || 3000

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server running on http://localhost:${info.port}`)
})
