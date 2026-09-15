import { useState, type ReactNode } from 'react'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SkeletonTableRow } from './Skeleton'
import { EmptyState } from './EmptyState'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  sortable?: boolean
  sortValue?: (row: T) => string | number
  className?: string
  hideOnMobile?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyField: keyof T
  loading?: boolean
  onRowClick?: (row: T) => void
  renderActions?: (row: T) => ReactNode
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
}

export function DataTable<T extends object>({
  columns,
  data,
  keyField,
  loading,
  onRowClick,
  renderActions,
  emptyTitle = 'Nothing here yet.',
  emptyDescription,
  emptyAction,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const sorted = (() => {
    if (!sortKey) return data
    const col = columns.find((c) => c.key === sortKey)
    if (!col) return data
    const getValue = col.sortValue ?? ((row: T) => String((row as Record<string, unknown>)[col.key] ?? ''))
    return [...data].sort((a, b) => {
      const va = getValue(a)
      const vb = getValue(b)
      const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb))
      return sortDir === 'asc' ? cmp : -cmp
    })
  })()

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  if (!loading && data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
  }

  return (
    <div className="overflow-x-auto rounded-[var(--r-card)] border border-line">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-surface">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'whitespace-nowrap px-4 py-3 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted',
                  col.hideOnMobile && 'hidden md:table-cell',
                  col.className,
                )}
              >
                {col.sortable ? (
                  <button
                    onClick={() => toggleSort(col.key)}
                    className="inline-flex items-center gap-1 transition-colors hover:text-text"
                  >
                    {col.header}
                    {sortKey === col.key ? (
                      sortDir === 'asc' ? (
                        <ChevronUp size={12} />
                      ) : (
                        <ChevronDown size={12} />
                      )
                    ) : (
                      <ChevronsUpDown size={12} className="opacity-40" />
                    )}
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
            {renderActions && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={columns.length + (renderActions ? 1 : 0)}>
                    <SkeletonTableRow cols={columns.length} />
                  </td>
                </tr>
              ))
            : sorted.map((row) => (
                <tr
                  key={String(row[keyField as keyof T])}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'border-b border-line last:border-0 transition-colors hover:bg-surface',
                    onRowClick && 'cursor-pointer',
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn('px-4 py-3.5 align-middle text-text', col.hideOnMobile && 'hidden md:table-cell', col.className)}
                    >
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '—')}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      {renderActions(row)}
                    </td>
                  )}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  )
}
