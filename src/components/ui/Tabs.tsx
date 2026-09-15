import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  content: ReactNode
}

export function Tabs({ tabs, defaultTab }: { tabs: Tab[]; defaultTab?: string }) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id)
  const activeTab = tabs.find((t) => t.id === active)

  return (
    <div>
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-line" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              'relative shrink-0 whitespace-nowrap px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors',
              active === tab.id ? 'text-accent' : 'text-muted hover:text-text',
            )}
          >
            {tab.label}
            {active === tab.id && (
              <motion.div layoutId="tab-underline" className="absolute inset-x-0 -bottom-px h-[2px] bg-accent" />
            )}
          </button>
        ))}
      </div>
      <div>{activeTab?.content}</div>
    </div>
  )
}
