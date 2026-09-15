import { useState } from 'react'
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react'
import { serviceService } from '@/services/serviceService'
import { useAsync } from '@/hooks/useAsync'
import { ICON_NAMES, getServiceIcon } from '@/lib/iconRegistry'
import { useToast } from '@/context/ToastContext'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { Switch } from '@/components/ui/Switch'
import { IconButton, Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Field } from '@/components/ui/Field'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import type { Service } from '@/types'

const EMPTY: Partial<Service> = {
  title: '',
  shortDescription: '',
  longDescription: '',
  icon: 'Sparkles',
  enabled: true,
}

export default function ServicesAdmin() {
  const { show } = useToast()
  const { data: items, refetch } = useAsync(() => serviceService.list(), [])
  const [editing, setEditing] = useState<Service | Partial<Service> | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function toggleEnabled(s: Service) {
    serviceService.update(s.id, { enabled: !s.enabled }).then(() => refetch())
  }

  function move(s: Service, dir: -1 | 1) {
    const sorted = [...items].sort((a, b) => a.order - b.order)
    const index = sorted.findIndex((i) => i.id === s.id)
    const swapIndex = index + dir
    if (swapIndex < 0 || swapIndex >= sorted.length) return
    const orderedIds = sorted.map((i) => i.id)
    ;[orderedIds[index], orderedIds[swapIndex]] = [orderedIds[swapIndex], orderedIds[index]]
    serviceService.reorder(orderedIds).then(() => refetch())
  }

  function handleSave() {
    if (!editing) return
    if (!editing.title?.trim()) {
      show('Title is required.', 'error')
      return
    }
    const done = () => {
      refetch()
      setEditing(null)
    }
    if ('id' in editing && editing.id) {
      serviceService.update(editing.id, editing).then(() => {
        show('Service updated.', 'success')
        done()
      })
    } else {
      serviceService.create(editing).then(() => {
        show('Service created.', 'success')
        done()
      })
    }
  }

  function handleDelete() {
    if (!deleteId) return
    serviceService.remove(deleteId).then(() => {
      refetch()
      show('Service deleted.', 'success')
    })
  }

  const columns: Column<Service>[] = [
    { key: 'number', header: '#', className: 'w-14 font-mono' },
    {
      key: 'title',
      header: 'Service',
      render: (s) => {
        const Icon = getServiceIcon(s.icon)
        return (
          <div className="flex items-center gap-3">
            <Icon size={16} className="text-accent" />
            <span className="font-medium">{s.title}</span>
          </div>
        )
      },
    },
    { key: 'shortDescription', header: 'Description', hideOnMobile: true, className: 'max-w-xs truncate' },
    {
      key: 'enabled',
      header: 'Status',
      render: (s) => <Badge variant={s.enabled ? 'success' : 'muted'}>{s.enabled ? 'Enabled' : 'Disabled'}</Badge>,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-text">Services</h1>
          <p className="mt-1 text-sm text-muted">{items.length} services · {items.filter((i) => i.enabled).length} enabled</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setEditing({ ...EMPTY })}>
          Add Service
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        keyField="id"
        emptyTitle="No services yet."
        emptyDescription="Add your first service offering."
        renderActions={(s) => (
          <div className="flex items-center justify-end gap-1.5">
            <IconButton onClick={() => move(s, -1)} aria-label="Move up"><ArrowUp size={13} /></IconButton>
            <IconButton onClick={() => move(s, 1)} aria-label="Move down"><ArrowDown size={13} /></IconButton>
            <Switch checked={s.enabled} onChange={() => toggleEnabled(s)} label="Enabled" />
            <IconButton onClick={() => setEditing(s)} aria-label="Edit"><Pencil size={13} /></IconButton>
            <IconButton onClick={() => setDeleteId(s.id)} className="hover:border-red-500/40 hover:text-red-400" aria-label="Delete">
              <Trash2 size={13} />
            </IconButton>
          </div>
        )}
      />

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing && 'id' in editing ? 'Edit Service' : 'New Service'}>
        {editing && (
          <div>
            <Field label="Title" required>
              <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <Field label="Icon">
              <Select value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })}>
                {ICON_NAMES.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </Select>
            </Field>
            <Field label="Short Description">
              <Textarea value={editing.shortDescription} onChange={(e) => setEditing({ ...editing, shortDescription: e.target.value })} />
            </Field>
            <Field label="Long Description">
              <Textarea className="min-h-[120px]" value={editing.longDescription} onChange={(e) => setEditing({ ...editing, longDescription: e.target.value })} />
            </Field>
            <div className="mt-2 flex items-center justify-between rounded-[var(--r-control)] border border-line p-3.5">
              <span className="text-sm text-text">Enabled</span>
              <Switch checked={!!editing.enabled} onChange={(v) => setEditing({ ...editing, enabled: v })} />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleSave}>Save Service</Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete service"
        description="This removes the service from the site. This cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}
