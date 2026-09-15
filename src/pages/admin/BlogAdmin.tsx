import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react'
import { blogService } from '@/services/blogService'
import { useAsync } from '@/hooks/useAsync'
import { useToast } from '@/context/ToastContext'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { IconButton } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { ADMIN_ROUTES } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import type { BlogPost } from '@/types'

export default function BlogAdmin() {
  const navigate = useNavigate()
  const { show } = useToast()
  const { data: items, refetch } = useAsync(() => blogService.list(), [])
  const [query, setQuery] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter((p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
  }, [items, query])

  function togglePublish(p: BlogPost) {
    blogService.update(p.id, { published: !p.published }).then(() => refetch())
  }

  function toggleFeature(p: BlogPost) {
    blogService.update(p.id, { featured: !p.featured }).then(() => refetch())
  }

  function remove(id: string) {
    blogService.remove(id).then(() => {
      refetch()
      show('Post deleted.', 'success')
    })
  }

  const columns: Column<BlogPost>[] = [
    {
      key: 'title',
      header: 'Post',
      render: (p) => (
        <div className="flex items-center gap-3">
          <img src={p.coverImage} alt="" className="h-10 w-14 shrink-0 rounded-[4px] object-cover" />
          <div className="min-w-0">
            <p className="truncate font-medium text-text">{p.title}</p>
            <p className="truncate text-xs text-faint">{p.category}</p>
          </div>
        </div>
      ),
    },
    { key: 'author', header: 'Author', hideOnMobile: true },
    { key: 'publishedDate', header: 'Date', hideOnMobile: true, render: (p) => formatDate(p.publishedDate) },
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
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-text">Blog</h1>
          <p className="mt-1 text-sm text-muted">{items.length} posts · {items.filter((i) => i.published).length} published</p>
        </div>
        <Link
          to={ADMIN_ROUTES.blogNew}
          className="inline-flex items-center gap-2 rounded-[var(--r-control)] bg-accent px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-[#04110f]"
        >
          <Plus size={14} /> Add Post
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search posts…" className="pl-9" />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyField="id"
        onRowClick={(p) => navigate(ADMIN_ROUTES.blogEdit(p.id))}
        emptyTitle="No posts yet."
        emptyDescription="Write your first studio update."
        emptyAction={<Link to={ADMIN_ROUTES.blogNew} className="font-mono text-xs uppercase text-accent">Add Post →</Link>}
        renderActions={(p) => (
          <div className="flex items-center justify-end gap-1.5">
            <IconButton onClick={() => toggleFeature(p)} className={p.featured ? 'border-accent/40 text-accent' : ''} aria-label="Feature">
              <Star size={14} className={p.featured ? 'fill-accent' : ''} />
            </IconButton>
            <IconButton onClick={() => togglePublish(p)} aria-label="Publish toggle">
              {p.published ? <EyeOff size={14} /> : <Eye size={14} />}
            </IconButton>
            <Link to={ADMIN_ROUTES.blogEdit(p.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--r-control)] border border-line text-muted hover:border-line-strong hover:text-text">
              <Pencil size={14} />
            </Link>
            <IconButton onClick={() => setDeleteId(p.id)} className="hover:border-red-500/40 hover:text-red-400" aria-label="Delete">
              <Trash2 size={14} />
            </IconButton>
          </div>
        )}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && remove(deleteId)}
        title="Delete post"
        description="This permanently removes the post. This cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}
