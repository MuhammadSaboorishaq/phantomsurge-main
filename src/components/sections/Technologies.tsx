import { useSite } from '@/context/SiteContext'
import { SectionHead } from './SectionHead'
import { Stagger, StaggerItem } from '@/components/motion/Reveal'

export function Technologies() {
  const { settings } = useSite()

  return (
    <section id="about" className="py-24 md:py-32">
      <div className="wrap">
        <SectionHead eyebrow="Under the hood" title="Tools we build with" />
        <Stagger className="flex flex-wrap gap-4" stagger={0.05}>
          {settings.technologies.map((tech) => (
            <StaggerItem key={tech}>
              <div className="group flex items-center gap-2.5 rounded-[var(--r-control)] border border-line px-5 py-3.5 font-mono text-[13px] text-muted transition-colors duration-200 hover:border-accent hover:text-text">
                <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--c-accent-glow)]" />
                {tech}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
