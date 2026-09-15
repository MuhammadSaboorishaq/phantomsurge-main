import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  const [show, setShow] = useState(false)
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            role="tooltip"
            className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-sm border border-line-strong bg-surface-2 px-2.5 py-1.5 font-mono text-[10.5px] text-text shadow-lg"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
