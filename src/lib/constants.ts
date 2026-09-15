export const SITE_ROUTES = {
  home: '/',
  work: '/work',
  workDetail: (slug: string) => `/work/${slug}`,
  services: '/services',
  about: '/about',
  contact: '/contact',
  blog: '/blog',
  blogDetail: (slug: string) => `/blog/${slug}`,
} as const

export const ADMIN_ROUTES = {
  root: '/admin',
  dashboard: '/admin/dashboard',
  settings: '/admin/settings',
  theme: '/admin/theme',
  portfolio: '/admin/portfolio',
  portfolioNew: '/admin/portfolio/new',
  portfolioEdit: (id: string) => `/admin/portfolio/${id}`,
  services: '/admin/services',
  team: '/admin/team',
  testimonials: '/admin/testimonials',
  blog: '/admin/blog',
  blogNew: '/admin/blog/new',
  blogEdit: (id: string) => `/admin/blog/${id}`,
  messages: '/admin/messages',
} as const

export const MAIN_NAV = [
  { label: 'Work', href: SITE_ROUTES.work },
  { label: 'Services', href: SITE_ROUTES.services },
  { label: 'About', href: SITE_ROUTES.about },
  { label: 'Blog', href: SITE_ROUTES.blog },
  { label: 'Contact', href: SITE_ROUTES.contact },
] as const

export const STORAGE_PREFIX = 'phantom-surge:'

export const DEMO_ADMIN_EMAIL = 'admin@phantomsurge.studio'
export const DEMO_ADMIN_PASSWORD = 'phantom2026'

/**
 * Video files bundled in /public/videos. Background video can't reasonably
 * go through the same base64-data-URL mock upload flow as images — a single
 * clip is tens of MB, and localStorage caps out around 5-10MB per origin —
 * so the admin picks from files actually deployed with the site, or supplies
 * an external hosted URL instead.
 */
export const BUNDLED_VIDEOS = [
  { label: 'Hero Reel', url: '/videos/hero-reel.mp4' },
  { label: 'Contact Reel', url: '/videos/contact-reel.mp4' },
] as const
