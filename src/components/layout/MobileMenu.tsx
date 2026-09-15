import { AnimatePresence, motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { MAIN_NAV } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[95] bg-bg/98 backdrop-blur-xl md:hidden"
        >
          <div className="flex h-full flex-col px-6 pt-24 pb-10">
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-line text-text"
            >
              <X size={18} />
            </button>

            <nav className="flex flex-1 flex-col justify-center gap-2">
              {MAIN_NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <NavLink
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'font-display block border-b border-line py-4 text-4xl uppercase tracking-wide text-text transition-colors',
                        isActive && 'text-accent',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <NavLink
                to="/contact"
                onClick={onClose}
                className="group flex w-full items-center justify-center gap-2 rounded-[var(--r-control)] bg-accent px-6 py-4 font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-[#04110f]"
              >
                Start a Project
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </NavLink>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
