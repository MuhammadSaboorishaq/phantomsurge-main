import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useReducedMotionPref } from '@/hooks/useReducedMotion'

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation()
  const reduced = useReducedMotionPref()

  if (reduced) return <>{children}</>

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
