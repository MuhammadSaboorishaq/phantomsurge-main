import { handle } from 'hono/vercel'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'

import auth from '../server/routes/auth'
import portfolio from '../server/routes/portfolio'
import blog from '../server/routes/blog'
import services from '../server/routes/services'
import teamRoutes from '../server/routes/team'
import testimonials from '../server/routes/testimonials'
import contacts from '../server/routes/contacts'
import settings from '../server/routes/settings'
import upload from '../server/routes/upload'

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

app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

export default handle(app)
