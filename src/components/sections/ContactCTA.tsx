import { Link } from 'react-router-dom'
import { useSite } from '@/context/SiteContext'
import { BackgroundFX } from '@/components/layout/BackgroundFX'
import { VideoBackground } from '@/components/layout/VideoBackground'
import { Reveal } from '@/components/motion/Reveal'
import { SITE_ROUTES } from '@/lib/constants'

export function ContactCTA() {
  const { settings } = useSite()

  return (
    <section id="contact-us" className="py-24 md:py-32">
      <div className="wrap">
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--r-card)] border border-line bg-surface px-8 py-16 text-center md:px-16 md:py-24">
            {settings.media.contactVideo.enabled && settings.media.contactVideo.url && (
              <VideoBackground
                src={settings.media.contactVideo.url}
                overlayClassName="bg-gradient-to-b from-surface/90 via-surface/75 to-surface"
              />
            )}
            <BackgroundFX variant="contact" hasVideo={settings.media.contactVideo.enabled && !!settings.media.contactVideo.url} />
            <div className="relative z-[2]">
              <span className="eyebrow justify-center">Get in touch</span>
              <h2 className="font-display chrome-text mx-auto mt-5 max-w-2xl text-[clamp(30px,4.6vw,52px)] leading-[1.02]">
                Ready to build something extraordinary?
              </h2>
              <p className="mx-auto mt-5 max-w-md text-[15px] text-muted">
                Tell us about your project and we&rsquo;ll follow up within one business day.
              </p>
              <Link
                to={SITE_ROUTES.contact}
                data-cursor="link"
                className="mt-9 inline-flex items-center gap-2.5 rounded-[var(--r-control)] bg-accent px-8 py-4 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[#04110f] transition-shadow hover:shadow-[0_10px_32px_-6px_var(--c-accent-glow)]"
              >
                Start Your Project Today
              </Link>
              <p className="mt-6 font-mono text-xs text-faint">{settings.email}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
