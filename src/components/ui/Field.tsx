import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FieldProps {
  label: string
  htmlFor?: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function Field({ label, htmlFor, error, hint, required, children, className }: FieldProps) {
  return (
    <div className={cn('mb-4', className)}>
      <label
        htmlFor={htmlFor}
        className="mb-2 block font-mono text-[11px] uppercase tracking-[0.1em] text-muted"
      >
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-faint">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  )
}
