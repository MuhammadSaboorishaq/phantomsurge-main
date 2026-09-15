import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const baseClasses =
  'w-full rounded-[var(--r-control)] border border-line-strong bg-bg-alt px-3.5 py-3 font-sans text-sm text-text outline-none transition-colors placeholder:text-faint focus:border-accent disabled:opacity-50'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { error?: boolean }>(
  function Input({ className, error, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(baseClasses, error && 'border-red-500/50 focus:border-red-500', className)}
        {...props}
      />
    )
  },
)

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }
>(function Textarea({ className, error, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(baseClasses, 'min-h-[110px] resize-y', error && 'border-red-500/50 focus:border-red-500', className)}
      {...props}
    />
  )
})

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }>(
  function Select({ className, error, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(baseClasses, 'appearance-none bg-bg-alt', error && 'border-red-500/50', className)}
        {...props}
      >
        {children}
      </select>
    )
  },
)
