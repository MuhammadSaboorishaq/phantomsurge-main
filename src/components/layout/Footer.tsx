import { NavLink } from 'react-router-dom'
import { GithubIcon, InstagramIcon, LinkedinIcon, TwitterIcon, YoutubeIcon } from '@/components/icons/SocialIcons'
import { useSite } from '@/context/SiteContext'
import { Logo } from '@/components/brand/Logo'
import { serviceService } from '@/services/serviceService'
import { useAsync } from '@/hooks/useAsync'
import { SITE_ROUTES } from '@/lib/constants'
import { FooterBackgroundGradient, TextHoverEffect } from '@/components/ui/hover-footer'

const SOCIAL_ICONS = {
  twitter: TwitterIcon,
  linkedin: LinkedinIcon,
  github: GithubIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
} as const

export function Footer() {
  const { settings } = useSite()
  const { data: allServices } = useAsync(() => serviceService.listEnabled(), [])
  const services = allServices.slice(0, 6)
  const year = new Date().getFullYear()

  // Mirrors Logo.tsx: "Phantom Surge Studios" -> big wordmark reads "PHANTOM SURGE"
  const brandWords = settings.brandName.trim().split(/\s+/)
  const wordmark = brandWords.length > 1 ? brandWords.slice(0, -1).join(' ') : settings.brandName

  return (
    <footer className="relative overflow-hidden border-t border-line">
      <FooterBackgroundGradient />
      <div className="wrap relative z-10 py-14 md:py-16">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm text-muted">{settings.description}</p>
            <div className="mt-6 flex gap-3">
              {Object.entries(settings.social).map(([key, url]) => {
                if (!url) return null
                const Icon = SOCIAL_ICONS[key as keyof typeof SOCIAL_ICONS]
                if (!Icon) return null
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={key}
                    data-cursor="link"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    <Icon size={15} />
                  </a>
                )
              })}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Navigate</h4>
            <ul className="space-y-3 text-sm">
              <li><NavLink to={SITE_ROUTES.home} className="text-muted transition-colors hover:text-accent">Home</NavLink></li>
              <li><NavLink to={SITE_ROUTES.work} className="text-muted transition-colors hover:text-accent">Work</NavLink></li>
              <li><NavLink to={SITE_ROUTES.about} className="text-muted transition-colors hover:text-accent">About</NavLink></li>
              <li><NavLink to={SITE_ROUTES.blog} className="text-muted transition-colors hover:text-accent">Blog</NavLink></li>
              <li><NavLink to={SITE_ROUTES.contact} className="text-muted transition-colors hover:text-accent">Contact</NavLink></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Services</h4>
            <ul className="space-y-3 text-sm">
              {services.map((s) => (
                <li key={s.id}>
                  <NavLink to={SITE_ROUTES.services} className="text-muted transition-colors hover:text-accent">
                    {s.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Contact</h4>
            <address className="space-y-3 font-mono text-[13px] not-italic leading-relaxed text-muted">
              <a href={`mailto:${settings.email}`} className="block transition-colors hover:text-accent">{settings.email}</a>
              <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`} className="block transition-colors hover:text-accent">{settings.phone}</a>
              <p>{settings.address}</p>
            </address>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-[0.04em] text-faint md:flex-row md:items-center">
          <span>{settings.copyright.replace('2026', String(year))}</span>
          <NavLink to="/admin" className="transition-colors hover:text-muted">
            Studio Admin
          </NavLink>
        </div>
      </div>

      {/* Signature hover-reveal wordmark — hidden below lg, where there's no
          room for a large SVG headline without crowding the real footer
          content. Sized to the .wrap container so it lines up with the
          columns and copyright bar above it instead of bleeding full-width. */}
      <div className="relative z-10 hidden pt-10 pb-8 lg:block" aria-hidden="true">
        <div className="wrap">
          <TextHoverEffect text={wordmark} />
        </div>
      </div>
    </footer>
  )
}
