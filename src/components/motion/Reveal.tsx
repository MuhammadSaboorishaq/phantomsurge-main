import type { ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import { fadeUp, staggerChildren, staggerItem, viewportOnce } from '@/lib/motion'
import { useReducedMotionPref } from '@/hooks/useReducedMotion'

interface RevealProps {
  children: ReactNode
  variants?: Variants
  delay?: number
  className?: string
  as?: 'div' | 'section'
}

/** Fades/slides its children into view once, on scroll. */
export function Reveal({ children, variants = fadeUp, delay = 0, className, as = 'div' }: RevealProps) {
  const reduced = useReducedMotionPref()
  const Component = motion[as]

  if (reduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <Component
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </Component>
  )
}

interface StaggerProps {
  children: ReactNode
  className?: string
  stagger?: number
  delayChildren?: number
}

/** Staggers direct children (wrap each child in <StaggerItem>) into view. */
export function Stagger({ children, className, stagger = 0.08, delayChildren = 0 }: StaggerProps) {
  const reduced = useReducedMotionPref()
  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={staggerChildren(stagger, delayChildren)}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotionPref()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  )
}
