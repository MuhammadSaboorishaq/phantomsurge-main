import { useMemo, useState } from 'react'

interface UseLoadMoreResult<T> {
  visible: T[]
  hasMore: boolean
  remaining: number
  loadMore: () => void
}

/**
 * Progressive-disclosure pagination for a list already loaded client-side —
 * shows `pageSize` items, then reveals another `pageSize` per "Load More"
 * click until the full list is visible. `pageSize` resets the reveal count
 * if it changes (e.g. the admin edits it in Site Settings while this is on
 * screen) so it never gets stuck showing a stale, smaller batch.
 */
export function useLoadMore<T>(items: T[], pageSize: number): UseLoadMoreResult<T> {
  const safePageSize = Math.max(1, pageSize || 1)
  const [count, setCount] = useState(safePageSize)

  const visible = useMemo(() => items.slice(0, Math.max(count, safePageSize)), [items, count, safePageSize])
  const hasMore = visible.length < items.length

  function loadMore() {
    setCount((c) => Math.max(c, safePageSize) + safePageSize)
  }

  return { visible, hasMore, remaining: items.length - visible.length, loadMore }
}
