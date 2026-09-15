import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'
import {
  SEED_SERVICES,
  SEED_PORTFOLIO,
  SEED_TEAM,
  SEED_TESTIMONIALS,
  SEED_BLOG,
} from '../../src/data/seed'

async function main() {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL
  if (!url) throw new Error('DATABASE_URL or POSTGRES_URL required')
  const sql = neon(url)
  const db = drizzle(sql, { schema })

  // Services
  for (const s of SEED_SERVICES) {
    await db.insert(schema.services).values({
      id: s.id,
      number: s.number,
      title: s.title,
      shortDescription: s.shortDescription,
      longDescription: s.longDescription ?? '',
      icon: s.icon,
      enabled: s.enabled,
      order: s.order,
    }).onConflictDoNothing()
  }
  console.log(`Seeded ${SEED_SERVICES.length} services`)

  // Portfolio
  for (const p of SEED_PORTFOLIO) {
    await db.insert(schema.portfolio).values({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      client: p.client ?? '',
      year: p.year,
      shortDescription: p.shortDescription,
      longDescription: p.longDescription ?? '',
      thumbnail: p.thumbnail ?? '',
      heroImage: p.heroImage ?? '',
      gallery: p.gallery ?? [],
      technologies: p.technologies ?? [],
      services: p.services ?? [],
      challenge: p.challenge ?? '',
      solution: p.solution ?? '',
      results: p.results ?? '',
      websiteUrl: p.websiteUrl ?? '',
      githubUrl: p.githubUrl ?? '',
      featured: p.featured ?? false,
      published: p.published ?? true,
      order: p.order ?? 0,
      createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
      updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    }).onConflictDoNothing()
  }
  console.log(`Seeded ${SEED_PORTFOLIO.length} portfolio items`)

  // Team
  for (const t of SEED_TEAM) {
    await db.insert(schema.team).values({
      id: t.id,
      name: t.name,
      role: t.role,
      department: t.department ?? '',
      bio: t.bio ?? '',
      avatar: t.avatar ?? '',
      social: t.social ?? {},
      featured: t.featured ?? false,
      published: t.published ?? true,
      order: t.order ?? 0,
    }).onConflictDoNothing()
  }
  console.log(`Seeded ${SEED_TEAM.length} team members`)

  // Testimonials
  for (const t of SEED_TESTIMONIALS) {
    await db.insert(schema.testimonials).values({
      id: t.id,
      name: t.name,
      role: t.role ?? '',
      company: t.company ?? '',
      avatar: t.avatar ?? '',
      quote: t.quote,
      rating: t.rating ?? 5,
      featured: t.featured ?? false,
      published: t.published ?? true,
      order: t.order ?? 0,
    }).onConflictDoNothing()
  }
  console.log(`Seeded ${SEED_TESTIMONIALS.length} testimonials`)

  // Blog
  for (const b of SEED_BLOG) {
    await db.insert(schema.blogPosts).values({
      id: b.id,
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt ?? '',
      content: b.content ?? '',
      coverImage: b.coverImage ?? '',
      author: b.author ?? 'Phantom Surge Studios',
      category: b.category ?? '',
      tags: b.tags ?? [],
      publishedDate: b.publishedDate ? new Date(b.publishedDate) : new Date(),
      readingTime: b.readingTime ?? 5,
      featured: b.featured ?? false,
      published: b.published ?? true,
    }).onConflictDoNothing()
  }
  console.log(`Seeded ${SEED_BLOG.length} blog posts`)

  console.log('All content seeded!')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
