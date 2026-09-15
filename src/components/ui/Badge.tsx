import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'muted'

const VARIANTS: Record<BadgeVariant, string> = {
  default: 'border-line-strong text-text',
  accent: 'border-accent/40 text-accent bg-accent/10',
  success: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
  warning: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
  danger: 'border-red-500/40 text-red-400 bg-red-500/10',
  muted: 'border-line text-muted',
}

export function Badge({ children, variant = 'default', className }: { children: ReactNode; variant?: BadgeVariant; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.08em]',
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
