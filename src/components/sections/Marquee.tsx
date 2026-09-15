import { useSite } from '@/context/SiteContext'

export function Marquee() {
  const { settings } = useSite()
  const items = settings.technologies

  return (
    <div className="border-y border-line py-6" data-cursor="default">
      <div className="group overflow-hidden">
        <div className="animate-marquee flex w-max gap-16 group-hover:[animation-play-state:paused]">
          {[...items, ...items].map((tech, i) => (
            <span
              key={i}
              className="font-mono text-[13px] uppercase tracking-[0.14em] text-faint transition-colors hover:text-muted"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
