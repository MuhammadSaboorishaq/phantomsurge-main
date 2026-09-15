import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: number
  className?: string
}

/**
 * Read-only when `onChange` is omitted (used on the public site); an
 * interactive click-to-set picker when it's provided (used in the admin
 * testimonial form) — same visual, one component.
 */
export function StarRating({ value, onChange, size = 13, className }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const interactive = !!onChange
  const display = hoverValue ?? value

  return (
    <div
      className={cn('flex gap-0.5', className)}
      onMouseLeave={() => setHoverValue(null)}
      role={interactive ? 'radiogroup' : undefined}
      aria-label={interactive ? 'Rating' : `Rated ${value} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1
        const filled = starValue <= display
        return interactive ? (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={starValue === value}
            aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            onMouseEnter={() => setHoverValue(starValue)}
            onClick={() => onChange!(starValue)}
            className="p-0.5 text-faint transition-colors hover:text-accent"
          >
            <Star size={size} className={filled ? 'fill-accent text-accent' : ''} />
          </button>
        ) : (
          <Star key={i} size={size} className={filled ? 'fill-accent text-accent' : 'text-faint'} />
        )
      })}
    </div>
  )
}
