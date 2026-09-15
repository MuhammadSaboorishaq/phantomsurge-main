import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, ArrowRight } from 'lucide-react'
import { MAIN_NAV } from '@/lib/constants'
import { useScrolled } from '@/hooks/useScrollPosition'
import { Logo } from '@/components/brand/Logo'
import { MobileMenu } from './MobileMenu'
import { cn } from '@/lib/utils'

export function Header() {
  const scrolled = useScrolled(20)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[100] border-b transition-all duration-300',
          scrolled ? 'border-line bg-bg/80 backdrop-blur-xl' : 'border-transparent bg-transparent',
        )}
      >
        <nav className="wrap flex items-center justify-between py-4">
          <Logo />

          <ul className="hidden items-center gap-9 font-sans text-sm font-medium text-muted md:flex">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  data-cursor="link"
                  className={({ isActive }) =>
                    cn('group relative py-1 transition-colors hover:text-text', isActive && 'text-text')
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      <span
                        className={cn(
                          'absolute -bottom-0.5 left-0 h-px bg-accent shadow-[0_0_6px_var(--c-accent-glow)] transition-all duration-300',
                          isActive ? 'w-full' : 'w-0 group-hover:w-full',
                        )}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/contact')}
            data-cursor="link"
            className="hidden items-center gap-2 rounded-[var(--r-control)] bg-accent px-5 py-2.5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-[#04110f] transition-shadow hover:shadow-[0_6px_24px_-4px_var(--c-accent-glow)] md:inline-flex"
          >
            Start a Project
            <ArrowRight size={13} />
          </motion.button>

          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-text md:hidden"
          >
            <Menu size={18} />
          </button>
        </nav>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
