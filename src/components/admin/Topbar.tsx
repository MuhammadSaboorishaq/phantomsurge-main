import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, ExternalLink, Menu, Search, X } from 'lucide-react'
import { portfolioService } from '@/services/portfolioService'
import { blogService } from '@/services/blogService'
import { testimonialService } from '@/services/testimonialService'
import { teamService } from '@/services/teamService'
import { contactService } from '@/services/contactService'
import { useAsync } from '@/hooks/useAsync'
import { ADMIN_ROUTES } from '@/lib/constants'

interface SearchResult {
  id: string
  label: string
  type: string
  href: string
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)

  const { data: allProjects } = useAsync(() => portfolioService.list(), [])
  const { data: allPosts } = useAsync(() => blogService.list(), [])
  const { data: allTestimonials } = useAsync(() => testimonialService.list(), [])
  const { data: allTeam } = useAsync(() => teamService.list(), [])
  const { data: allMessages } = useAsync(() => contactService.list(), [])

  const unread = useMemo(() => allMessages.filter((m) => m.status === 'new'), [allMessages])

  const results = useMemo<SearchResult[]>(() => {
    if (query.trim().length < 2) return []
    const q = query.toLowerCase()
    const projects = allProjects
      .filter((p) => p.title.toLowerCase().includes(q))
      .map((p) => ({ id: p.id, label: p.title, type: 'Project', href: ADMIN_ROUTES.portfolioEdit(p.id) }))
    const posts = allPosts
      .filter((p) => p.title.toLowerCase().includes(q))
      .map((p) => ({ id: p.id, label: p.title, type: 'Post', href: ADMIN_ROUTES.blogEdit(p.id) }))
    const testimonials = allTestimonials
      .filter((t) => t.name.toLowerCase().includes(q) || t.company.toLowerCase().includes(q))
      .map((t) => ({ id: t.id, label: `${t.name} — ${t.company}`, type: 'Testimonial', href: ADMIN_ROUTES.testimonials }))
    const team = allTeam
      .filter((m) => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q))
      .map((m) => ({ id: m.id, label: `${m.name} — ${m.role}`, type: 'Team', href: ADMIN_ROUTES.team }))
    const messages = allMessages
      .filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q))
      .map((m) => ({ id: m.id, label: `${m.name} (${m.email})`, type: 'Message', href: ADMIN_ROUTES.messages }))
    return [...projects, ...posts, ...testimonials, ...team, ...messages].slice(0, 8)
  }, [query, allProjects, allPosts, allTestimonials, allTeam, allMessages])

  return (
    <div className="sticky top-0 z-20 flex items-center gap-4 border-b border-line bg-bg/80 px-5 py-3.5 backdrop-blur-xl lg:px-8">
      <button onClick={onMenuClick} className="text-muted hover:text-text lg:hidden" aria-label="Open menu">
        <Menu size={20} />
      </button>

      <div className="relative flex-1 max-w-md">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects, posts, messages…"
          className="w-full rounded-[var(--r-control)] border border-line bg-surface py-2 pl-9 pr-8 text-sm text-text outline-none placeholder:text-faint focus:border-accent"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-text">
            <X size={13} />
          </button>
        )}

        {results.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-[var(--r-control)] border border-line-strong bg-surface-2 shadow-2xl">
            {results.map((r) => (
              <button
                key={`${r.type}-${r.id}`}
                onClick={() => {
                  navigate(r.href)
                  setQuery('')
                }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-text hover:bg-surface"
              >
                <span className="truncate">{r.label}</span>
                <span className="ml-2 shrink-0 font-mono text-[10px] uppercase text-faint">{r.type}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Link
          to="/?preview=true"
          target="_blank"
          className="hidden items-center gap-2 rounded-[var(--r-control)] border border-line-strong px-3.5 py-2 font-mono text-[11px] uppercase tracking-wide text-muted transition-colors hover:border-accent hover:text-accent sm:inline-flex"
        >
          Preview site <ExternalLink size={13} />
        </Link>

        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted hover:text-text"
            aria-label="Notifications"
          >
            <Bell size={16} />
            {unread.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent font-mono text-[9px] font-bold text-[#04110f]">
                {unread.length}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 w-72 rounded-[var(--r-control)] border border-line-strong bg-surface-2 p-2 shadow-2xl">
              {unread.length === 0 ? (
                <p className="px-3 py-4 text-center text-xs text-muted">No new messages.</p>
              ) : (
                unread.slice(0, 5).map((m) => (
                  <Link
                    key={m.id}
                    to={ADMIN_ROUTES.messages}
                    onClick={() => setNotifOpen(false)}
                    className="block rounded-[var(--r-control)] px-3 py-2.5 hover:bg-surface"
                  >
                    <p className="text-[13px] text-text">{m.name}</p>
                    <p className="line-clamp-1 text-xs text-faint">{m.message}</p>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
