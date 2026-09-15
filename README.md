# Phantom Surge Studios

A premium, production-quality website and content-managed admin dashboard for **Phantom Surge Studios** — a games & AI development studio. Dark, technical, chrome-and-teal identity; cinematic motion; a full CMS behind it so nothing requires touching source code.

- **Public site** — home, work (portfolio), services, about, contact, blog
- **Admin dashboard** — CRUD for portfolio, services, testimonials, blog, messages
- **Theme customization** — colors, typography, radius, motion, backgrounds, hero/card style, 5 presets, live preview
- **Site settings** — brand, SEO, social, logo management, maintenance mode, section visibility/order

---

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion · React Router 7 · Lucide React

No backend is wired up. All content is served through a **service layer** (`src/services/*`) backed by `localStorage`, so the app is a fully working demo out of the box and a real API is a drop-in replacement later (see [Connecting a real backend](#connecting-a-real-backend)).

---

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The admin is at `/admin`.

```bash
npm run build     # production build to dist/
npm run preview   # preview the production build locally
npm run lint       # oxlint
```

### Demo admin credentials

```
email:    admin@phantomsurge.studio
password: phantom2026
```

This is a **mock, local authentication layer** (`src/services/authService.ts`) for demonstration only — credentials and the session token are stored in plaintext in `localStorage`. It is explicitly **not production-secure**. See [Connecting a real backend](#connecting-a-real-backend) for how to replace it.

---

## Project architecture

```
src/
  types/            Shared data models (Service, PortfolioItem, BlogPost, Testimonial,
                     ContactMessage, SiteSettings, ThemeSettings, ...)
  data/seed.ts       Initial/demo content — only used the first time the app runs
  services/          Repository layer: portfolioService, blogService, serviceService,
                     testimonialService, contactService, siteService, themeService,
                     authService — all backed by services/storage.ts (localStorage)
  context/           ThemeProvider, SiteProvider, AuthProvider, ToastProvider
  hooks/             useReducedMotionPref, useMouseParallax, useCountUp, useScrolled, ...
  lib/               motion.ts (Framer Motion variants), utils.ts, constants.ts,
                     iconRegistry.ts, fontLoader.ts
  components/
    layout/          Header, MobileMenu, Footer, PageTransition, CustomCursor,
                     BackgroundFX, ScrollProgress, SEO, PublicLayout
    hero/            Hero (cinematic, mouse-parallax)
    sections/        Services, PortfolioFeatured, Stats, Technologies, Testimonials,
                     BlogPreview, ContactCTA, Marquee, SectionHead
    portfolio/       PortfolioCard, PortfolioGallery
    motion/          Reveal, Stagger, Parallax, CountUp, TextReveal — the motion system
    ui/               Button, Input, Textarea, Select, Badge, Modal, Drawer, Tabs, Toast,
                     Tooltip, DataTable, Skeleton, EmptyState, ErrorState, ImageUploader
    admin/            AdminLayout, Sidebar, Topbar, StatCard, ProtectedRoute, ConfirmDialog,
                     ColorField, ThemePreviewPanel
    brand/            Logo, StreakMark (the signature chrome streak motif)
    icons/            SocialIcons (lucide-react ships no trademarked brand glyphs, so the
                     handful used in the footer/links live here as minimal inline SVGs)
  pages/              Route-level components (Home, Work, WorkDetail, Services, About,
                     Contact, Blog, BlogDetail, NotFound, admin/*)
```

**Data flow**: pages call a `services/*` function → that function reads/writes a
`localStorage`-backed repository (`services/storage.ts`) → React state in the
calling component/page re-renders. Nothing talks to `localStorage` directly outside
`services/`.

**Theme flow**: `ThemeProvider` holds `ThemeSettings`, persists it via `themeService`,
and writes CSS custom properties (`--c-bg`, `--c-accent`, `--f-display`, `--r-card`, …) onto
`document.documentElement` on every change. Tailwind's `@theme` block in `src/index.css`
maps utility classes (`bg-bg`, `text-accent`, `font-display`, `rounded-card`, …) straight to
those variables, so **every themed utility class updates instantly** when the admin changes
a color, font, radius, or preset — no rebuild, no page reload.

---

## Routes

**Public**
`/` `/work` `/work/:slug` `/services` `/about` `/contact` `/blog` `/blog/:slug` `*` (404 — "Signal Lost")

**Admin** (behind `ProtectedRoute`, login at `/admin`)
`/admin/dashboard` `/admin/portfolio` `/admin/portfolio/new` `/admin/portfolio/:id`
`/admin/services` `/admin/testimonials` `/admin/blog` `/admin/blog/new` `/admin/blog/:id`
`/admin/messages` `/admin/theme` `/admin/settings`

Append `?preview=true` to the public site URL to bypass maintenance mode (the admin
Topbar's "Preview site" link does this automatically).

---

## Adding a portfolio project

1. `/admin/portfolio` → **Add Project**
2. **Basic Info** — title (slug auto-generates), category, client, year, short/long description
3. **Media** — thumbnail (4:5) and hero image (16:9) via drag-and-drop upload, optional gallery,
   optional direct video URL / YouTube / Vimeo
4. **Project Info** — comma-separated technologies & services, challenge/solution/results
5. **Links** — website, GitHub, case study
6. **Settings** — featured, published, sort order
7. **Preview** (top right) shows exactly what the public detail page will look like
8. **Save Draft** or **Publish**

Images are stored as data URLs in the mock layer — see [Image handling](#image-handling--uploads).

---

## Customizing the theme

`/admin/theme` — pick one of five presets (Phantom Surge, Void, Cyber, Ember, Steel) as a
starting point, then override individual colors, heading/body/mono fonts (loaded on demand
from Google Fonts), border radius (sharp/subtle/rounded), animation intensity
(minimal/normal/cinematic), background effects (grid/glow/noise/particles/streaks), hero
style, and card style. The live preview panel updates immediately using the same CSS
variables the public site reads — what you see is what ships. **Reset to Default** restores
the Phantom Surge preset.

---

## Image handling & uploads

There is no object storage in this demo. `ImageUploader` (`src/components/ui/ImageUploader.tsx`)
reads the file client-side and stores it as a base64 data URL directly on the record (project,
blog post, testimonial avatar, logo). It supports drag-and-drop, click-to-upload, a simulated
progress bar, file-type/size validation (6MB cap), and preview/replace/remove. This keeps the
demo fully self-contained, but data URLs bloat `localStorage` — swap `ImageUploader`'s
`processFile` for a real upload call (see below) before using this with many/large images.

---

## Connecting a real backend

Every piece of dynamic data goes through `src/services/*`. To connect Supabase, Firebase, or
a custom API:

1. **Data (portfolio/services/testimonials/blog/messages/settings/theme)** — reimplement the
   functions exported by each `src/services/*Service.ts` file to call your API instead of
   `src/services/storage.ts`'s `createRepository`/`createSingleton` helpers. Keep the same
   function signatures (`list`, `get`, `create`, `update`, `remove`, …) and no calling code
   changes.
2. **Auth** — replace the body of `src/services/authService.ts` (`login`, `logout`,
   `getSession`) with your provider's SDK calls. `AuthContext` already treats it as an async
   black box.
3. **Images** — replace `ImageUploader`'s data-URL `FileReader` flow with an upload request to
   your storage provider, returning a public URL instead of a data URL.
4. **Contact form** — `contactService.submit` is already `async`; point it at a real endpoint
   or email service.

`.env.example` documents the environment variables this would introduce.

---

## Accessibility & motion

- Semantic landmarks, skip-to-content link, visible focus rings (`:focus-visible`) everywhere,
  labeled icon-only buttons, form errors tied to their fields.
- All scroll/parallax/cursor effects check `prefers-reduced-motion` (`useReducedMotionPref`)
  and fall back to static, instant layouts.
- The custom cursor auto-disables on touch devices and reduced-motion.

## Content honesty

The three homepage statistics (projects completed, assets created, trusted clients) are
seed/demo data, explicitly flagged `isDemo: true` in `src/data/seed.ts` and shown with a
"(demo)" label wherever rendered — replace them with real numbers in `/admin/settings` or the
seed file before shipping.
