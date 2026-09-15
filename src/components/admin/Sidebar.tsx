import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  Wrench,
  Users,
  MessageSquareQuote,
  Newspaper,
  Mail,
  Palette,
  Settings,
  LogOut,
  X,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useSite } from '@/context/SiteContext'
import { StreakMark } from '@/components/brand/StreakMark'
import { ADMIN_ROUTES } from '@/lib/constants'
import { contactService } from '@/services/contactService'
import { useAsync } from '@/hooks/useAsync'
import { cn } from '@/lib/utils'

const NAV = [
  { to: ADMIN_ROUTES.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: ADMIN_ROUTES.portfolio, label: 'Portfolio', icon: Briefcase },
  { to: ADMIN_ROUTES.services, label: 'Services', icon: Wrench },
  { to: ADMIN_ROUTES.team, label: 'Team', icon: Users },
  { to: ADMIN_ROUTES.testimonials, label: 'Testimonials', icon: MessageSquareQuote },
  { to: ADMIN_ROUTES.blog, label: 'Blog', icon: Newspaper },
  { to: ADMIN_ROUTES.messages, label: 'Messages', icon: Mail, badge: true },
  { to: ADMIN_ROUTES.theme, label: 'Theme', icon: Palette },
  { to: ADMIN_ROUTES.settings, label: 'Site Settings', icon: Settings },
]

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth()
  const { settings } = useSite()
  const { data: unread } = useAsync(() => contactService.unreadCount(), 0)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-line px-6 py-5">
        <StreakMark className="h-6 w-6" />
        <div>
          <p className="font-display text-sm uppercase tracking-wide text-text">{settings.brandName}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center justify-between rounded-[var(--r-control)] px-3 py-2.5 font-mono text-[12.5px] uppercase tracking-[0.04em] transition-colors',
                isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-surface hover:text-text',
              )
            }
          >
            <span className="flex items-center gap-3">
              <item.icon size={16} />
              {item.label}
            </span>
            {item.badge && unread > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 font-mono text-[10px] font-bold text-[#04110f]">
                {unread}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line p-4">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 font-mono text-xs text-accent">
            {user?.name?.[0] ?? 'A'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] text-text">{user?.name}</p>
            <p className="truncate font-mono text-[10.5px] text-faint">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded-[var(--r-control)] px-3 py-2.5 font-mono text-[12px] uppercase tracking-wide text-muted transition-colors hover:bg-surface hover:text-red-400"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-line bg-surface/60 backdrop-blur-xl lg:block">
      <SidebarContent />
    </aside>
  )
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[140] lg:hidden">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 w-72 bg-surface">
        <button onClick={onClose} className="absolute right-4 top-5 text-muted hover:text-text" aria-label="Close menu">
          <X size={18} />
        </button>
        <SidebarContent onNavigate={onClose} />
      </div>
    </div>
  )
}
