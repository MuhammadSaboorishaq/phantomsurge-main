import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  json,
  varchar,
  real,
} from 'drizzle-orm/pg-core'

// ── Services ──────────────────────────────────────────────────────

export const services = pgTable('services', {
  id: text('id').primaryKey(),
  number: varchar('number', { length: 10 }).notNull(),
  title: text('title').notNull(),
  shortDescription: text('short_description').notNull().default(''),
  longDescription: text('long_description').notNull().default(''),
  icon: text('icon').notNull().default('Sparkles'),
  image: text('image'),
  enabled: boolean('enabled').notNull().default(true),
  order: integer('sort_order').notNull().default(0),
})

// ── Portfolio ─────────────────────────────────────────────────────

export const portfolio = pgTable('portfolio', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  category: text('category').notNull(),
  client: text('client'),
  year: integer('year').notNull(),
  shortDescription: text('short_description').notNull().default(''),
  longDescription: text('long_description').notNull().default(''),
  thumbnail: text('thumbnail').notNull().default(''),
  heroImage: text('hero_image').notNull().default(''),
  gallery: json('gallery').$type<{ id: string; url: string; kind: 'image' | 'video'; caption?: string }[]>().notNull().default([]),
  videoUrl: text('video_url'),
  youtubeUrl: text('youtube_url'),
  vimeoUrl: text('vimeo_url'),
  technologies: json('technologies').$type<string[]>().notNull().default([]),
  services: json('services_used').$type<string[]>().notNull().default([]),
  challenge: text('challenge'),
  solution: text('solution'),
  results: text('results'),
  websiteUrl: text('website_url'),
  githubUrl: text('github_url'),
  caseStudyUrl: text('case_study_url'),
  featured: boolean('featured').notNull().default(false),
  published: boolean('published').notNull().default(false),
  order: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── Team ──────────────────────────────────────────────────────────

export const team = pgTable('team', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull().default(''),
  department: text('department').notNull().default(''),
  bio: text('bio').notNull().default(''),
  avatar: text('avatar'),
  social: json('social').$type<{ linkedin?: string; twitter?: string; github?: string; website?: string }>().notNull().default({}),
  featured: boolean('featured').notNull().default(false),
  published: boolean('published').notNull().default(true),
  order: integer('sort_order').notNull().default(0),
})

// ── Testimonials ──────────────────────────────────────────────────

export const testimonials = pgTable('testimonials', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull().default(''),
  company: text('company').notNull().default(''),
  avatar: text('avatar'),
  quote: text('quote').notNull().default(''),
  rating: integer('rating').notNull().default(5),
  published: boolean('published').notNull().default(true),
  featured: boolean('featured').notNull().default(false),
  order: integer('sort_order').notNull().default(0),
})

// ── Blog ──────────────────────────────────────────────────────────

export const blogPosts = pgTable('blog_posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt').notNull().default(''),
  content: text('content').notNull().default(''),
  coverImage: text('cover_image').notNull().default(''),
  author: text('author').notNull().default('Phantom Surge Studios'),
  category: text('category').notNull().default('Studio Notes'),
  tags: json('tags').$type<string[]>().notNull().default([]),
  publishedDate: timestamp('published_date', { withTimezone: true }).notNull().defaultNow(),
  readingTime: integer('reading_time').notNull().default(1),
  featured: boolean('featured').notNull().default(false),
  published: boolean('published').notNull().default(false),
})

// ── Contact Messages ──────────────────────────────────────────────

export const contactMessages = pgTable('contact_messages', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  company: text('company'),
  projectType: text('project_type').notNull(),
  budget: text('budget').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── Admin Users ───────────────────────────────────────────────────

export const adminUsers = pgTable('admin_users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('editor'),
  avatar: text('avatar'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── Site Settings (singleton — always one row, id = 'default') ───

export const siteSettings = pgTable('site_settings', {
  id: text('id').primaryKey().default('default'),
  data: json('data').$type<Record<string, unknown>>().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── Theme Settings (singleton — always one row, id = 'default') ──

export const themeSettings = pgTable('theme_settings', {
  id: text('id').primaryKey().default('default'),
  data: json('data').$type<Record<string, unknown>>().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
