import { handle } from 'hono/vercel'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'

import auth from '../server/routes/auth.js'
import portfolio from '../server/routes/portfolio.js'
import blog from '../server/routes/blog.js'
import services from '../server/routes/services.js'
import teamRoutes from '../server/routes/team.js'
import testimonials from '../server/routes/testimonials.js'
import contacts from '../server/routes/contacts.js'
import settings from '../server/routes/settings.js'
import upload from '../server/routes/upload.js'
import bot from '../server/routes/bot.js'

const app = new Hono().basePath('/api')

app.use('*', secureHeaders())
app.use(
  '*',
  cors({
    origin: process.env.CORS_ORIGIN ?? '*',
    credentials: true,
  }),
)

app.route('/auth', auth)
app.route('/portfolio', portfolio)
app.route('/blog', blog)
app.route('/services', services)
app.route('/team', teamRoutes)
app.route('/testimonials', testimonials)
app.route('/contacts', contacts)
app.route('/settings', settings)
app.route('/upload', upload)
app.route('/bot', bot)

app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

const handler = handle(app)
export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
