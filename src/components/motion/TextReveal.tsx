import { motion } from 'framer-motion'
import { wordItem, wordReveal, viewportOnce } from '@/lib/motion'
import { useReducedMotionPref } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

/** Reveals text word-by-word as it scrolls into view. Use for headlines. */
export function TextReveal({ text, className }: { text: string; className?: string }) {
  const reduced = useReducedMotionPref()
  const words = text.split(' ')

  if (reduced) return <span className={className}>{text}</span>

  return (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={wordReveal}
      className={cn('inline', className)}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em]">
          <motion.span variants={wordItem} className="inline-block">
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
