import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react'
import { testimonialService } from '@/services/testimonialService'
import { useAsync } from '@/hooks/useAsync'
import { useToast } from '@/context/ToastContext'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { Switch } from '@/components/ui/Switch'
import { IconButton, Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Field } from '@/components/ui/Field'
import { Input, Textarea } from '@/components/ui/Input'
import { ImageUploader } from '@/components/ui/ImageUploader'
import { StarRating } from '@/components/ui/StarRating'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import type { Testimonial } from '@/types'

const EMPTY: Partial<Testimonial> = {
  name: '',
  role: '',
  company: '',
  quote: '',
  rating: 5,
  published: true,
  featured: false,
}

export default function TestimonialsAdmin() {
  const { show } = useToast()
  const { data: items, refetch } = useAsync(() => testimonialService.list(), [])
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Testimonial | Partial<Testimonial> | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter(
      (t) => t.name.toLowerCase().includes(q) || t.company.toLowerCase().includes(q) || t.quote.toLowerCase().includes(q),
    )
  }, [items, query])

  function togglePublished(t: Testimonial) {
    testimonialService.update(t.id, { published: !t.published }).then(() => refetch())
  }

  function toggleFeatured(t: Testimonial) {
    testimonialService.update(t.id, { featured: !t.featured }).then(() => refetch())
  }

  function move(t: Testimonial, dir: -1 | 1) {
    const sorted = [...items].sort((a, b) => a.order - b.order)
    const index = sorted.findIndex((i) => i.id === t.id)
    const swapIndex = index + dir
    if (swapIndex < 0 || swapIndex >= sorted.length) return
    const orderedIds = sorted.map((i) => i.id)
    ;[orderedIds[index], orderedIds[swapIndex]] = [orderedIds[swapIndex], orderedIds[index]]
    testimonialService.reorder(orderedIds).then(() => refetch())
  }

  function handleSave() {
    if (!editing) return
    if (!editing.name?.trim() || !editing.quote?.trim()) {
      show('Name and quote are required.', 'error')
      return
    }
    const done = () => {
      refetch()
      setEditing(null)
    }
    if ('id' in editing && editing.id) {
      testimonialService.update(editing.id, editing).then(() => {
        show('Testimonial updated.', 'success')
        done()
      })
    } else {
      testimonialService.create(editing).then(() => {
        show('Testimonial created.', 'success')
        done()
      })
    }
  }

  function handleDelete() {
    if (!deleteId) return
    testimonialService.remove(deleteId).then(() => {
      refetch()
      show('Testimonial deleted.', 'success')
    })
  }

  const columns: Column<Testimonial>[] = [
    {
      key: 'name',
      header: 'Client',
      sortable: true,
      render: (t) => (
        <div className="flex items-center gap-3">
          {t.avatar ? (
            <img src={t.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 font-mono text-xs text-accent">{t.name[0]}</div>
          )}
          <div>
            <p className="font-medium">{t.name}</p>
            <p className="text-xs text-faint">{t.role}, {t.company}</p>
          </div>
        </div>
      ),
    },
    { key: 'quote', header: 'Quote', hideOnMobile: true, className: 'max-w-sm truncate' },
    {
      key: 'rating',
      header: 'Rating',
      sortable: true,
      hideOnMobile: true,
      render: (t) => <StarRating value={t.rating} size={12} />,
    },
    {
      key: 'published',
      header: 'Status',
      render: (t) => (
        <div className="flex gap-1.5">
          <Badge variant={t.published ? 'success' : 'muted'}>{t.published ? 'Published' : 'Draft'}</Badge>
          {t.featured && <Badge variant="accent">Featured</Badge>}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-text">Testimonials</h1>
          <p className="mt-1 text-sm text-muted">
            {items.length} testimonials · {items.filter((i) => i.published).length} published
          </p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setEditing({ ...EMPTY })}>
          Add Testimonial
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search testimonials…" className="pl-9" />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyField="id"
        emptyTitle="No testimonials yet."
        emptyDescription="Add a client quote to build trust on the homepage."
        emptyAction={
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setEditing({ ...EMPTY })}>
            Add Testimonial
          </Button>
        }
        renderActions={(t) => (
          <div className="flex items-center justify-end gap-1.5">
            <IconButton onClick={() => move(t, -1)} aria-label="Move up"><ArrowUp size={13} /></IconButton>
            <IconButton onClick={() => move(t, 1)} aria-label="Move down"><ArrowDown size={13} /></IconButton>
            <IconButton
              onClick={() => toggleFeatured(t)}
              className={t.featured ? 'border-accent/40 text-accent' : ''}
              aria-label={t.featured ? 'Unfeature' : 'Feature'}
            >
              <Star size={13} className={t.featured ? 'fill-accent' : ''} />
            </IconButton>
            <IconButton onClick={() => togglePublished(t)} aria-label={t.published ? 'Unpublish' : 'Publish'}>
              {t.published ? <EyeOff size={13} /> : <Eye size={13} />}
            </IconButton>
            <IconButton onClick={() => setEditing(t)} aria-label="Edit"><Pencil size={13} /></IconButton>
            <IconButton onClick={() => setDeleteId(t.id)} className="hover:border-red-500/40 hover:text-red-400" aria-label="Delete">
              <Trash2 size={13} />
            </IconButton>
          </div>
        )}
      />

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing && 'id' in editing ? 'Edit Testimonial' : 'New Testimonial'}>
        {editing && (
          <div>
            <div className="grid grid-cols-2 gap-x-6">
              <Field label="Name" required>
                <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </Field>
              <Field label="Rating">
                <StarRating value={editing.rating ?? 5} onChange={(v) => setEditing({ ...editing, rating: v })} size={18} className="pt-2.5" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-x-6">
              <Field label="Role">
                <Input value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
              </Field>
              <Field label="Company">
                <Input value={editing.company} onChange={(e) => setEditing({ ...editing, company: e.target.value })} />
              </Field>
            </div>
            <Field label="Quote" required>
              <Textarea value={editing.quote} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} />
            </Field>
            <Field label="Avatar" hint="Optional">
              <ImageUploader value={editing.avatar} onChange={(v) => setEditing({ ...editing, avatar: v })} onRemove={() => setEditing({ ...editing, avatar: '' })} aspect="aspect-square" />
            </Field>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between rounded-[var(--r-control)] border border-line p-3.5">
                <span className="text-sm text-text">Published</span>
                <Switch checked={!!editing.published} onChange={(v) => setEditing({ ...editing, published: v })} />
              </div>
              <div className="flex items-center justify-between rounded-[var(--r-control)] border border-line p-3.5">
                <span className="text-sm text-text">Featured</span>
                <Switch checked={!!editing.featured} onChange={(v) => setEditing({ ...editing, featured: v })} />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleSave}>Save Testimonial</Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete testimonial"
        description="This removes the testimonial from the site. This cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}
