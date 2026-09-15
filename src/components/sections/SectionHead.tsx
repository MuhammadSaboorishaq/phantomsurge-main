import type { ReactNode } from 'react'
import { Reveal } from '@/components/motion/Reveal'
import { TextReveal } from '@/components/motion/TextReveal'

interface SectionHeadProps {
  eyebrow: string
  title: string
  description?: ReactNode
  align?: 'between' | 'start'
}

export function SectionHead({ eyebrow, title, description, align = 'between' }: SectionHeadProps) {
  return (
    <div className={`mb-14 flex flex-wrap items-end gap-10 md:mb-16 ${align === 'between' ? 'justify-between' : ''}`}>
      <div>
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <h2 className="font-display chrome-text mt-3 text-[clamp(30px,4.2vw,48px)]">
          <TextReveal text={title} />
        </h2>
      </div>
      {description && (
        <Reveal delay={0.1} className="max-w-sm text-[15px] text-muted">
          {description}
        </Reveal>
      )}
    </div>
  )
}
