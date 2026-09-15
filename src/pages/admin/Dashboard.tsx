import { Link } from 'react-router-dom'
import { Briefcase, CheckCircle2, FileEdit, Mail, MessageSquareQuote, Newspaper, Plus, Palette, ExternalLink } from 'lucide-react'
import { portfolioService } from '@/services/portfolioService'
import { blogService } from '@/services/blogService'
import { serviceService } from '@/services/serviceService'
import { contactService } from '@/services/contactService'
import { useAsync } from '@/hooks/useAsync'
import { StatCard } from '@/components/admin/StatCard'
import { Badge } from '@/components/ui/Badge'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { EmptyState } from '@/components/ui/EmptyState'
import { ADMIN_ROUTES } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import type { PortfolioItem, ContactMessage } from '@/types'

export default function Dashboard() {
  const { data: projects } = useAsync(() => portfolioService.list(), [])
  const published = projects.filter((p) => p.published)
  const drafts = projects.filter((p) => !p.published)
  const { data: messages } = useAsync(() => contactService.list(), [])
  const { data: posts } = useAsync(() => blogService.list(), [])
  const { data: services } = useAsync(() => serviceService.list(), [])

  const projectColumns: Column<PortfolioItem>[] = [
    { key: 'title', header: 'Project', render: (p) => <span className="font-medium">{p.title}</span> },
    { key: 'category', header: 'Category', hideOnMobile: true },
    {
      key: 'published',
      header: 'Status',
      render: (p) => (
        <Badge variant={p.published ? 'success' : 'muted'}>{p.published ? 'Published' : 'Draft'}</Badge>
      ),
    },
    { key: 'updatedAt', header: 'Updated', hideOnMobile: true, render: (p) => formatDate(p.updatedAt) },
  ]

  const messageColumns: Column<ContactMessage>[] = [
    { key: 'name', header: 'From', render: (m) => <span className="font-medium">{m.name}</span> },
    { key: 'projectType', header: 'Type', hideOnMobile: true },
    {
      key: 'status',
      header: 'Status',
      render: (m) => (
        <Badge variant={m.status === 'new' ? 'accent' : 'muted'}>{m.status}</Badge>
      ),
    },
    { key: 'createdAt', header: 'Received', render: (m) => formatDate(m.createdAt) },
  ]

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-text">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">An overview of your studio's content and inbox.</p>
        </div>
        <Link
          to="/?preview=true"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-[var(--r-control)] border border-line-strong px-4 py-2.5 font-mono text-[11px] uppercase tracking-wide text-muted transition-colors hover:border-accent hover:text-accent"
        >
          View Website <ExternalLink size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Projects" value={projects.length} icon={Briefcase} href={ADMIN_ROUTES.portfolio} />
        <StatCard label="Published" value={published.length} icon={CheckCircle2} href={ADMIN_ROUTES.portfolio} />
        <StatCard label="Drafts" value={drafts.length} icon={FileEdit} href={ADMIN_ROUTES.portfolio} />
        <StatCard label="Messages" value={messages.length} icon={Mail} href={ADMIN_ROUTES.messages} />
        <StatCard label="Blog Posts" value={posts.length} icon={Newspaper} href={ADMIN_ROUTES.blog} />
        <StatCard label="Services" value={services.length} icon={MessageSquareQuote} href={ADMIN_ROUTES.services} />
      </div>

      <div>
        <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: 'Add Project', icon: Plus, href: ADMIN_ROUTES.portfolioNew },
            { label: 'Edit Theme', icon: Palette, href: ADMIN_ROUTES.theme },
            { label: 'Add Blog Post', icon: Newspaper, href: ADMIN_ROUTES.blogNew },
            { label: 'View Website', icon: ExternalLink, href: '/' },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="flex flex-col items-center gap-2.5 rounded-[var(--r-card)] border border-line bg-surface/40 px-4 py-6 text-center transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <action.icon size={18} className="text-accent" />
              <span className="font-mono text-[11px] uppercase tracking-wide text-text">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Recent Projects</h2>
            <Link to={ADMIN_ROUTES.portfolio} className="font-mono text-[11px] uppercase text-accent">View all</Link>
          </div>
          {projects.length === 0 ? (
            <EmptyState
              title="No projects yet."
              description="Create your first portfolio project to showcase your work."
              action={<Link to={ADMIN_ROUTES.portfolioNew} className="font-mono text-xs uppercase text-accent">Add Project →</Link>}
            />
          ) : (
            <DataTable columns={projectColumns} data={projects.slice(0, 5)} keyField="id" />
          )}
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Recent Messages</h2>
            <Link to={ADMIN_ROUTES.messages} className="font-mono text-[11px] uppercase text-accent">View all</Link>
          </div>
          {messages.length === 0 ? (
            <EmptyState title="No messages yet." description="Contact form submissions will appear here." />
          ) : (
            <DataTable columns={messageColumns} data={messages.slice(0, 5)} keyField="id" />
          )}
        </div>
      </div>
    </div>
  )
}
