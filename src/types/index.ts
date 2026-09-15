/** ==========================================================================
 * Phantom Surge Studios — shared data models
 * These map 1:1 to the mock localStorage-backed repositories in `src/services`.
 * Swapping to a real backend later means re-implementing the repository
 * functions against an API — nothing above the service layer should change.
 * ========================================================================== */

export interface Service {
  id: string
  number: string // "01"
  title: string
  shortDescription: string
  longDescription: string
  icon: string // lucide-react icon name
  image?: string
  enabled: boolean
  order: number
}

export type MediaKind = 'image' | 'video'

export interface GalleryItem {
  id: string
  url: string
  kind: MediaKind
  caption?: string
}

export interface PortfolioItem {
  id: string
  title: string
  slug: string
  category: string
  client?: string
  year: number
  shortDescription: string
  longDescription: string

  thumbnail: string
  heroImage: string
  gallery: GalleryItem[]
  videoUrl?: string
  youtubeUrl?: string
  vimeoUrl?: string

  technologies: string[]
  services: string[]
  challenge?: string
  solution?: string
  results?: string

  websiteUrl?: string
  githubUrl?: string
  caseStudyUrl?: string

  featured: boolean
  published: boolean
  order: number

  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  department: string
  bio: string
  avatar?: string
  social: {
    linkedin?: string
    twitter?: string
    github?: string
    website?: string
  }
  featured: boolean
  published: boolean
  order: number
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  avatar?: string
  quote: string
  rating: number // 1-5
  published: boolean
  featured: boolean
  order: number
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  author: string
  category: string
  tags: string[]
  publishedDate: string
  readingTime: number
  featured: boolean
  published: boolean
}

export type ProjectType = 'game-development' | 'ai-development' | 'art-animation' | 'immersive' | 'tools' | 'other'
export type Budget = 'under-10k' | '10k-50k' | '50k-150k' | '150k-plus' | 'not-sure'

export interface ContactMessage {
  id: string
  name: string
  email: string
  company?: string
  projectType: ProjectType
  budget: Budget
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  createdAt: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'owner' | 'editor'
  avatar?: string
}

export type SectionKey =
  | 'hero'
  | 'marquee'
  | 'services'
  | 'portfolio'
  | 'stats'
  | 'about'
  | 'team'
  | 'testimonials'
  | 'blog'
  | 'contact'
  | 'footer'

export interface SectionSettings {
  key: SectionKey
  label: string
  enabled: boolean
  order: number
}

export interface StatItem {
  id: string
  value: string
  label: string
  isDemo: boolean
}

export interface SiteSettings {
  brandName: string
  tagline: string
  description: string
  email: string
  phone: string
  address: string
  social: {
    twitter?: string
    linkedin?: string
    github?: string
    instagram?: string
    youtube?: string
  }
  footerText: string
  copyright: string
  seoTitle: string
  seoDescription: string
  ogImage?: string
  favicon?: string
  googleAnalyticsId?: string
  contactEmail: string
  maintenanceMode: boolean
  defaultLanguage: string
  timezone: string
  logo: {
    main?: string
    mark?: string
    light?: string
    dark?: string
  }
  media: {
    heroVideo: { enabled: boolean; url: string }
    contactVideo: { enabled: boolean; url: string }
  }
  /** Initial item count shown before a "Load More" control appears — admin-tunable per section. */
  displayLimits: {
    services: number
    testimonials: number
    team: number
  }
  sections: SectionSettings[]
  technologies: string[]
  stats: StatItem[]
}

export type RadiusStyle = 'sharp' | 'subtle' | 'rounded'
export type AnimationIntensity = 'minimal' | 'normal' | 'cinematic'
export type HeroStyle = 'cinematic' | 'minimal' | 'centered' | 'split'
export type CardStyle = 'technical' | 'glass' | 'minimal' | 'bordered'

export interface BackgroundEffects {
  grid: boolean
  glow: boolean
  noise: boolean
  particles: boolean
  streaks: boolean
}

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  backgroundAlt: string
  surface: string
  text: string
  mutedText: string
  border: string
}

export interface ThemeSettings {
  presetId: string
  colors: ThemeColors
  fonts: {
    heading: string
    body: string
    mono: string
  }
  radius: RadiusStyle
  animationIntensity: AnimationIntensity
  backgroundEffects: BackgroundEffects
  heroStyle: HeroStyle
  cardStyle: CardStyle
}

export interface ThemePreset {
  id: string
  name: string
  description: string
  colors: ThemeColors
}

export interface AuthSession {
  user: AdminUser
  token: string
  expiresAt: number
}
