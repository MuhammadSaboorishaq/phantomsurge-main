import { useMemo, useState } from 'react'
import { Archive, Mail, MailOpen, Search, Trash2 } from 'lucide-react'
import { contactService } from '@/services/contactService'
import { useAsync } from '@/hooks/useAsync'
import { useToast } from '@/context/ToastContext'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { IconButton } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { formatDate } from '@/lib/utils'
import type { ContactMessage } from '@/types'

const STATUS_VARIANT: Record<ContactMessage['status'], 'accent' | 'muted' | 'success' | 'warning'> = {
  new: 'accent',
  read: 'muted',
  replied: 'success',
  archived: 'warning',
}

export default function Messages() {
  const { show } = useToast()
  const { data: items, refetch } = useAsync(() => contactService.list(), [])
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<ContactMessage | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.message.toLowerCase().includes(q))
  }, [items, query])

  function open(m: ContactMessage) {
    setActive(m)
    if (m.status === 'new') {
      contactService.updateStatus(m.id, 'read').then(() => refetch())
    }
  }

  function setStatus(id: string, status: ContactMessage['status']) {
    contactService.updateStatus(id, status).then(() => {
      refetch()
      setActive((a) => (a && a.id === id ? { ...a, status } : a))
    })
  }

  function remove(id: string) {
    contactService.remove(id).then(() => {
      refetch()
      setActive(null)
      show('Message deleted.', 'success')
    })
  }

  const columns: Column<ContactMessage>[] = [
    {
      key: 'name',
      header: 'From',
      render: (m) => (
        <div className="flex items-center gap-2.5">
          {m.status === 'new' ? <Mail size={14} className="text-accent" /> : <MailOpen size={14} className="text-faint" />}
          <div>
            <p className={m.status === 'new' ? 'font-semibold text-text' : 'text-text'}>{m.name}</p>
            <p className="text-xs text-faint">{m.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'projectType', header: 'Project Type', hideOnMobile: true },
    { key: 'budget', header: 'Budget', hideOnMobile: true },
    { key: 'status', header: 'Status', render: (m) => <Badge variant={STATUS_VARIANT[m.status]}>{m.status}</Badge> },
    { key: 'createdAt', header: 'Received', sortable: true, render: (m) => formatDate(m.createdAt) },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-text">Messages</h1>
        <p className="mt-1 text-sm text-muted">
          {items.length} total · {items.filter((m) => m.status === 'new').length} unread
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search messages…" className="pl-9" />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyField="id"
        onRowClick={open}
        emptyTitle="No messages yet."
        emptyDescription="Contact form submissions will appear here."
        renderActions={(m) => (
          <IconButton onClick={() => setDeleteId(m.id)} className="hover:border-red-500/40 hover:text-red-400" aria-label="Delete">
            <Trash2 size={13} />
          </IconButton>
        )}
      />

      <Drawer open={!!active} onClose={() => setActive(null)} title="Message">
        {active && (
          <div className="space-y-6">
            <div>
              <p className="text-lg font-semibold text-text">{active.name}</p>
              <a href={`mailto:${active.email}`} className="font-mono text-sm text-accent">{active.email}</a>
              {active.company && <p className="mt-1 text-sm text-muted">{active.company}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <p className="uppercase tracking-wide text-faint">Project Type</p>
                <p className="mt-1 text-text">{active.projectType}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide text-faint">Budget</p>
                <p className="mt-1 text-text">{active.budget}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide text-faint">Received</p>
                <p className="mt-1 text-text">{formatDate(active.createdAt)}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide text-faint">Status</p>
                <Badge variant={STATUS_VARIANT[active.status]} className="mt-1">{active.status}</Badge>
              </div>
            </div>

            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-wide text-faint">Message</p>
              <p className="whitespace-pre-line rounded-[var(--r-control)] border border-line bg-bg-alt p-4 text-sm leading-relaxed text-text">
                {active.message}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={`mailto:${active.email}?subject=Re: Your project inquiry`}
                onClick={() => setStatus(active.id, 'replied')}
                className="inline-flex items-center gap-2 rounded-[var(--r-control)] bg-accent px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-[#04110f]"
              >
                <Mail size={13} /> Reply by Email
              </a>
              <button
                onClick={() => setStatus(active.id, 'archived')}
                className="inline-flex items-center gap-2 rounded-[var(--r-control)] border border-line-strong px-4 py-2.5 font-mono text-[11px] uppercase tracking-wide text-muted hover:text-text"
              >
                <Archive size={13} /> Archive
              </button>
              <button
                onClick={() => setDeleteId(active.id)}
                className="inline-flex items-center gap-2 rounded-[var(--r-control)] border border-red-500/30 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wide text-red-400 hover:bg-red-500/10"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && remove(deleteId)}
        title="Delete message"
        description="This permanently removes the message. This cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}
