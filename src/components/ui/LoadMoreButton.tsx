import { Plus } from 'lucide-react'

interface LoadMoreButtonProps {
  onClick: () => void
  remaining: number
  className?: string
}

export function LoadMoreButton({ onClick, remaining, className }: LoadMoreButtonProps) {
  return (
    <div className={`flex justify-center ${className ?? ''}`}>
      <button
        type="button"
        onClick={onClick}
        data-cursor="link"
        className="group inline-flex items-center gap-2 rounded-[var(--r-control)] border border-line-strong px-7 py-3.5 font-mono text-xs uppercase tracking-[0.08em] text-text transition-colors hover:border-accent hover:text-accent"
      >
        Load More
        <Plus size={14} className="transition-transform group-hover:rotate-90" />
        <span className="text-faint">({remaining})</span>
      </button>
    </div>
  )
}
