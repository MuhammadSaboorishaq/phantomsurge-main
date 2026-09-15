import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useReducedMotionPref } from '@/hooks/useReducedMotion'

interface ParallaxProps {
  children: ReactNode
  speed?: number // px of travel
  className?: string
}

/** Subtle vertical parallax tied to scroll progress through the viewport. */
export function Parallax({ children, speed = 60, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotionPref()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed])

  if (reduced) return <div className={className}>{children}</div>

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}
