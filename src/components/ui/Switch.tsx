import { cn } from '@/lib/utils'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

export function Switch({ checked, onChange, label, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-200 disabled:opacity-40',
        checked ? 'border-accent bg-accent/25' : 'border-line-strong bg-bg-alt',
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-current transition-transform duration-200',
          checked ? 'translate-x-[22px] text-accent' : 'translate-x-1 text-faint',
        )}
      />
    </button>
  )
}
