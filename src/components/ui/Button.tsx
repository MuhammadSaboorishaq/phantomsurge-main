import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  showArrow?: boolean
  icon?: ReactNode
  fullWidth?: boolean
  children?: ReactNode
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-[#04110f] font-semibold hover:shadow-[0_8px_28px_-6px_var(--c-accent-glow)] disabled:opacity-50',
  outline: 'border border-line-strong text-text hover:border-accent hover:text-accent',
  ghost: 'text-muted hover:text-text',
  danger: 'border border-red-500/30 text-red-400 hover:bg-red-500/10',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[11px] gap-1.5',
  md: 'px-6 py-3 text-xs gap-2',
  lg: 'px-8 py-4 text-[13px] gap-2.5',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading, showArrow, icon, fullWidth, className, children, disabled, ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileHover={disabled || loading ? undefined : { y: -1 }}
      whileTap={disabled || loading ? undefined : { y: 0, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      disabled={disabled || loading}
      className={cn(
        'relative inline-flex items-center justify-center whitespace-nowrap rounded-[var(--r-control)] font-mono uppercase tracking-[0.08em] transition-colors duration-200',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'cursor-not-allowed',
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : icon}
      {children}
      {showArrow && !loading && (
        <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </motion.button>
  )
})

export function IconButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-[var(--r-control)] border border-line text-muted transition-colors hover:border-line-strong hover:text-text',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
