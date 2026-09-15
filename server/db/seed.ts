import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

/**
 * Seeds the database with initial data. Run once after first migration:
 *   npx tsx server/db/seed.ts
 *
 * This mirrors src/data/seed.ts but writes to Postgres instead of localStorage.
 * It creates the admin user and inserts the demo site/theme settings.
 * It does NOT seed portfolio/blog/services/etc — those can be added from the admin UI.
 * To seed demo content too, import SEED_* from src/data/seed.ts and insert them.
 */

async function main() {
  const sql = neon(process.env.DATABASE_URL!)
  const db = drizzle(sql, { schema })

  // ── Admin user ────────────────────────────────────────────────
  const email = process.env.ADMIN_EMAIL ?? 'admin@phantomsurge.studio'
  const password = process.env.ADMIN_PASSWORD ?? 'phantom2026'
  const hash = await bcrypt.hash(password, 12)

  await db
    .insert(schema.adminUsers)
    .values({
      id: 'user_admin',
      name: 'Phantom Admin',
      email,
      passwordHash: hash,
      role: 'owner',
    })
    .onConflictDoNothing()

  console.log(`Admin user seeded: ${email}`)

  // ── Default site settings ─────────────────────────────────────
  await db
    .insert(schema.siteSettings)
    .values({
      id: 'default',
      data: {
        brandName: 'Phantom Surge Studios',
        tagline: 'We build the next surge.',
        description: 'Games & AI development studio — full-cycle game dev, applied AI, and immersive digital experiences.',
        email: 'hello@phantomsurge.studio',
        phone: '',
        address: '',
        social: {},
        footerText: 'Building the next surge in games and AI.',
        copyright: `© ${new Date().getFullYear()} Phantom Surge Studios. All rights reserved.`,
        seoTitle: 'Phantom Surge Studios — Games & AI Studio',
        seoDescription: 'Phantom Surge Studios builds the next surge in games and AI.',
        contactEmail: 'hello@phantomsurge.studio',
        maintenanceMode: false,
        defaultLanguage: 'en',
        timezone: 'UTC',
        logo: {},
        media: {
          heroVideo: { enabled: false, url: '' },
          contactVideo: { enabled: false, url: '' },
        },
        displayLimits: { services: 6, testimonials: 6, team: 8 },
        sections: [
          { key: 'hero', label: 'Hero', enabled: true, order: 1 },
          { key: 'marquee', label: 'Marquee', enabled: true, order: 2 },
          { key: 'services', label: 'Services', enabled: true, order: 3 },
          { key: 'portfolio', label: 'Portfolio', enabled: true, order: 4 },
          { key: 'stats', label: 'Stats', enabled: true, order: 5 },
          { key: 'about', label: 'About', enabled: true, order: 6 },
          { key: 'team', label: 'Team', enabled: true, order: 7 },
          { key: 'testimonials', label: 'Testimonials', enabled: true, order: 8 },
          { key: 'blog', label: 'Blog', enabled: true, order: 9 },
          { key: 'contact', label: 'Contact', enabled: true, order: 10 },
          { key: 'footer', label: 'Footer', enabled: true, order: 11 },
        ],
        technologies: ['Unreal Engine', 'Unity', 'React', 'TypeScript', 'Python', 'Blender', 'Substance Painter'],
        stats: [
          { id: 'stat_1', value: '50+', label: 'Projects Delivered', isDemo: true },
          { id: 'stat_2', value: '12+', label: 'Years Experience', isDemo: true },
          { id: 'stat_3', value: '30+', label: 'Team Members', isDemo: true },
          { id: 'stat_4', value: '98%', label: 'Client Satisfaction', isDemo: true },
        ],
      },
      updatedAt: new Date(),
    })
    .onConflictDoNothing()

  console.log('Site settings seeded')

  // ── Default theme settings ────────────────────────────────────
  await db
    .insert(schema.themeSettings)
    .values({
      id: 'default',
      data: {
        presetId: 'phantom-chrome',
        colors: {
          primary: '#2dd4bf',
          secondary: '#a78bfa',
          accent: '#38bdf8',
          background: '#07090b',
          backgroundAlt: '#0d1117',
          surface: '#151b23',
          text: '#e6edf3',
          mutedText: '#7d8590',
          border: '#2a313c',
        },
        fonts: { heading: 'Saira Condensed', body: 'Inter', mono: 'JetBrains Mono' },
        radius: 'subtle',
        animationIntensity: 'cinematic',
        backgroundEffects: { grid: true, glow: true, noise: true, particles: false, streaks: true },
        heroStyle: 'cinematic',
        cardStyle: 'technical',
      },
      updatedAt: new Date(),
    })
    .onConflictDoNothing()

  console.log('Theme settings seeded')
  console.log('Done!')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
