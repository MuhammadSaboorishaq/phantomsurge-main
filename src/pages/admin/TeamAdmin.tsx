import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react'
import { teamService } from '@/services/teamService'
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
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import type { TeamMember } from '@/types'

const EMPTY: Partial<TeamMember> = {
  name: '',
  role: '',
  department: '',
  bio: '',
  social: {},
  featured: false,
  published: true,
}

const SOCIAL_FIELDS = [
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/…' },
  { key: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/…' },
  { key: 'github', label: 'GitHub', placeholder: 'https://github.com/…' },
  { key: 'website', label: 'Website', placeholder: 'https://…' },
] as const

export default function TeamAdmin() {
  const { show } = useToast()
  const { data: items, refetch } = useAsync(() => teamService.list(), [])
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<TeamMember | Partial<TeamMember> | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter(
      (m) => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q) || m.department.toLowerCase().includes(q),
    )
  }, [items, query])

  function openNew() {
    setFormError(null)
    setEditing({ ...EMPTY })
  }

  function openEdit(m: TeamMember) {
    setFormError(null)
    setEditing(m)
  }

  function closeModal() {
    setFormError(null)
    setEditing(null)
  }

  function togglePublished(m: TeamMember) {
    teamService.update(m.id, { published: !m.published }).then(() => refetch())
  }

  function toggleFeatured(m: TeamMember) {
    teamService.update(m.id, { featured: !m.featured }).then(() => refetch())
  }

  function move(m: TeamMember, dir: -1 | 1) {
    const sorted = [...items].sort((a, b) => a.order - b.order)
    const index = sorted.findIndex((i) => i.id === m.id)
    const swapIndex = index + dir
    if (swapIndex < 0 || swapIndex >= sorted.length) return
    const orderedIds = sorted.map((i) => i.id)
    ;[orderedIds[index], orderedIds[swapIndex]] = [orderedIds[swapIndex], orderedIds[index]]
    teamService.reorder(orderedIds).then(() => refetch())
  }

  function handleSave() {
    if (!editing) return
    if (!editing.name?.trim()) {
      setFormError('Name is required.')
      return
    }
    setFormError(null)
    const done = () => {
      refetch()
      setEditing(null)
    }
    if ('id' in editing && editing.id) {
      teamService.update(editing.id, editing).then(() => {
        show('Team member updated.', 'success')
        done()
      })
    } else {
      teamService.create(editing).then(() => {
        show('Team member added.', 'success')
        done()
      })
    }
  }

  function handleDelete() {
    if (!deleteId) return
    teamService.remove(deleteId).then(() => {
      refetch()
      show('Team member removed.', 'success')
    })
  }

  const columns: Column<TeamMember>[] = [
    {
      key: 'name',
      header: 'Member',
      sortable: true,
      render: (m) => (
        <div className="flex items-center gap-3">
          {m.avatar ? (
            <img src={m.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 font-mono text-xs text-accent">{m.name[0]}</div>
          )}
          <div>
            <p className="font-medium">{m.name}</p>
            <p className="text-xs text-faint">{m.role}</p>
          </div>
        </div>
      ),
    },
    { key: 'department', header: 'Department', sortable: true, hideOnMobile: true },
    { key: 'bio', header: 'Bio', hideOnMobile: true, className: 'max-w-sm truncate' },
    {
      key: 'published',
      header: 'Status',
      render: (m) => (
        <div className="flex gap-1.5">
          <Badge variant={m.published ? 'success' : 'muted'}>{m.published ? 'Published' : 'Draft'}</Badge>
          {m.featured && <Badge variant="accent">Featured</Badge>}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-text">Team</h1>
          <p className="mt-1 text-sm text-muted">
            {items.length} members · {items.filter((i) => i.published).length} published
          </p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={openNew}>
          Add Member
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search team…" className="pl-9" />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyField="id"
        emptyTitle="No team members yet."
        emptyDescription="Add the people behind the studio to show on the website."
        emptyAction={
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={openNew}>
            Add Member
          </Button>
        }
        renderActions={(m) => (
          <div className="flex items-center justify-end gap-1.5">
            <IconButton onClick={() => move(m, -1)} aria-label="Move up"><ArrowUp size={13} /></IconButton>
            <IconButton onClick={() => move(m, 1)} aria-label="Move down"><ArrowDown size={13} /></IconButton>
            <IconButton
              onClick={() => toggleFeatured(m)}
              className={m.featured ? 'border-accent/40 text-accent' : ''}
              aria-label={m.featured ? 'Unfeature' : 'Feature'}
            >
              <Star size={13} className={m.featured ? 'fill-accent' : ''} />
            </IconButton>
            <IconButton onClick={() => togglePublished(m)} aria-label={m.published ? 'Unpublish' : 'Publish'}>
              {m.published ? <EyeOff size={13} /> : <Eye size={13} />}
            </IconButton>
            <IconButton onClick={() => openEdit(m)} aria-label="Edit"><Pencil size={13} /></IconButton>
            <IconButton onClick={() => setDeleteId(m.id)} className="hover:border-red-500/40 hover:text-red-400" aria-label="Delete">
              <Trash2 size={13} />
            </IconButton>
          </div>
        )}
      />

      <Modal open={!!editing} onClose={closeModal} title={editing && 'id' in editing ? 'Edit Team Member' : 'New Team Member'}>
        {editing && (
          <div>
            <div className="grid grid-cols-2 gap-x-6">
              <Field label="Name" required error={formError ?? undefined}>
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  error={!!formError}
                  autoFocus
                />
              </Field>
              <Field label="Role" hint="Optional — can be filled in later">
                <Input value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} placeholder="e.g. Lead Engineer" />
              </Field>
            </div>
            <Field label="Department">
              <Input value={editing.department} onChange={(e) => setEditing({ ...editing, department: e.target.value })} placeholder="e.g. Engineering" />
            </Field>
            <Field label="Bio">
              <Textarea value={editing.bio} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} />
            </Field>
            <Field label="Photo" hint="Square portrait works best">
              <ImageUploader
                value={editing.avatar}
                onChange={(v) => setEditing({ ...editing, avatar: v })}
                onRemove={() => setEditing({ ...editing, avatar: '' })}
                aspect="aspect-square"
              />
            </Field>
            <div className="grid grid-cols-2 gap-x-6">
              {SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
                <Field key={key} label={label}>
                  <Input
                    value={editing.social?.[key] ?? ''}
                    onChange={(e) => setEditing({ ...editing, social: { ...editing.social, [key]: e.target.value } })}
                    placeholder={placeholder}
                  />
                </Field>
              ))}
            </div>
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
              <Button variant="ghost" size="sm" onClick={closeModal}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleSave}>Save Member</Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Remove team member"
        description="This removes the member from the website. This cannot be undone."
        confirmLabel="Remove"
        danger
      />
    </div>
  )
}
