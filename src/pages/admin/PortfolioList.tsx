import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Copy, Eye, EyeOff, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react'
import { portfolioService } from '@/services/portfolioService'
import { useAsync } from '@/hooks/useAsync'
import { useToast } from '@/context/ToastContext'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { IconButton } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { ADMIN_ROUTES } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import type { PortfolioItem } from '@/types'

export default function PortfolioList() {
  const navigate = useNavigate()
  const { show } = useToast()
  const { data: items, refetch } = useAsync(() => portfolioService.list(), [])
  const [query, setQuery] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter((i) => i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q) || i.client?.toLowerCase().includes(q))
  }, [items, query])

  function togglePublish(item: PortfolioItem) {
    portfolioService.update(item.id, { published: !item.published }).then(() => {
      refetch()
      show(item.published ? 'Project unpublished.' : 'Project published.', 'success')
    })
  }

  function toggleFeature(item: PortfolioItem) {
    portfolioService.update(item.id, { featured: !item.featured }).then(() => refetch())
  }

  function duplicate(item: PortfolioItem) {
    portfolioService.duplicate(item.id).then(() => {
      refetch()
      show('Project duplicated.', 'success')
    })
  }

  function remove(id: string) {
    portfolioService.remove(id).then(() => {
      refetch()
      show('Project deleted.', 'success')
    })
  }

  const columns: Column<PortfolioItem>[] = [
    {
      key: 'title',
      header: 'Project',
      sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3">
          <img src={p.thumbnail} alt="" className="h-10 w-10 shrink-0 rounded-[4px] object-cover" />
          <div className="min-w-0">
            <p className="truncate font-medium text-text">{p.title}</p>
            <p className="truncate text-xs text-faint">{p.client ?? '—'}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', sortable: true, hideOnMobile: true },
    { key: 'year', header: 'Year', sortable: true, hideOnMobile: true },
    {
      key: 'published',
      header: 'Status',
      render: (p) => (
        <div className="flex gap-1.5">
          <Badge variant={p.published ? 'success' : 'muted'}>{p.published ? 'Published' : 'Draft'}</Badge>
          {p.featured && <Badge variant="accent">Featured</Badge>}
        </div>
      ),
    },
    { key: 'updatedAt', header: 'Updated', sortable: true, hideOnMobile: true, render: (p) => formatDate(p.updatedAt) },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-text">Portfolio</h1>
          <p className="mt-1 text-sm text-muted">{items.length} projects · {items.filter((i) => i.published).length} published</p>
        </div>
        <Link
          to={ADMIN_ROUTES.portfolioNew}
          className="inline-flex items-center gap-2 rounded-[var(--r-control)] bg-accent px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-[#04110f]"
        >
          <Plus size={14} /> Add Project
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects…" className="pl-9" />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyField="id"
        onRowClick={(p) => navigate(ADMIN_ROUTES.portfolioEdit(p.id))}
        emptyTitle="No projects yet."
        emptyDescription="Create your first portfolio project to showcase your work."
        emptyAction={
          <Link to={ADMIN_ROUTES.portfolioNew} className="font-mono text-xs uppercase text-accent">Add Project →</Link>
        }
        renderActions={(p) => (
          <div className="flex items-center justify-end gap-1.5">
            <Tooltip label={p.featured ? 'Unfeature' : 'Feature'}>
              <IconButton onClick={() => toggleFeature(p)} className={p.featured ? 'border-accent/40 text-accent' : ''}>
                <Star size={14} className={p.featured ? 'fill-accent' : ''} />
              </IconButton>
            </Tooltip>
            <Tooltip label={p.published ? 'Unpublish' : 'Publish'}>
              <IconButton onClick={() => togglePublish(p)}>
                {p.published ? <EyeOff size={14} /> : <Eye size={14} />}
              </IconButton>
            </Tooltip>
            <Tooltip label="Duplicate">
              <IconButton onClick={() => duplicate(p)}>
                <Copy size={14} />
              </IconButton>
            </Tooltip>
            <Tooltip label="Edit">
              <Link to={ADMIN_ROUTES.portfolioEdit(p.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--r-control)] border border-line text-muted transition-colors hover:border-line-strong hover:text-text">
                <Pencil size={14} />
              </Link>
            </Tooltip>
            <Tooltip label="Delete">
              <IconButton onClick={() => setDeleteId(p.id)} className="hover:border-red-500/40 hover:text-red-400">
                <Trash2 size={14} />
              </IconButton>
            </Tooltip>
          </div>
        )}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && remove(deleteId)}
        title="Delete project"
        description="This permanently removes the project from the CMS. This cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}
