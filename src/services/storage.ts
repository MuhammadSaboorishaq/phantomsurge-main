import { STORAGE_PREFIX } from '@/lib/constants'

/**
 * Generic localStorage-backed repository.
 *
 * This is the mock persistence layer for the whole CMS. Every domain service
 * (portfolioService, blogService, ...) is a thin wrapper around one of these,
 * so swapping to a real backend later means replacing the body of each
 * function in `src/services/*` with a `fetch()` call — the call signatures
 * (list/get/create/update/remove) can stay identical.
 */
export function createRepository<T extends { id: string }>(key: string, seed: T[]) {
  const storageKey = `${STORAGE_PREFIX}${key}`
  const knownSeedIdsKey = `${storageKey}:seed-ids`

  /**
   * Reconciles stored data against the current seed array whenever new seed
   * records are added to the codebase after a browser already has this
   * collection persisted (e.g. shipping 10 more demo projects to an app
   * someone already has open). Any seed id the browser has never seen before
   * gets appended; ids it HAS seen before but no longer has are left alone,
   * because that means the admin deliberately deleted that record — this
   * only ever adds genuinely new seed content, never resurrects a deletion.
   */
  function mergeNewSeedItems(stored: T[]): T[] {
    if (typeof window === 'undefined') return stored
    try {
      const knownRaw = window.localStorage.getItem(knownSeedIdsKey)
      const known: string[] = knownRaw ? JSON.parse(knownRaw) : []
      const knownSet = new Set(known)
      const storedIds = new Set(stored.map((item) => item.id))
      const newItems = seed.filter((item) => !knownSet.has(item.id) && !storedIds.has(item.id))

      const allSeedIds = seed.map((item) => item.id)
      window.localStorage.setItem(knownSeedIdsKey, JSON.stringify(allSeedIds))

      if (newItems.length === 0) return stored
      const merged = [...stored, ...newItems]
      window.localStorage.setItem(storageKey, JSON.stringify(merged))
      return merged
    } catch {
      return stored
    }
  }

  function readAll(): T[] {
    if (typeof window === 'undefined') return seed
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (!raw) {
        window.localStorage.setItem(storageKey, JSON.stringify(seed))
        window.localStorage.setItem(knownSeedIdsKey, JSON.stringify(seed.map((item) => item.id)))
        return seed
      }
      return mergeNewSeedItems(JSON.parse(raw) as T[])
    } catch {
      return seed
    }
  }

  function writeAll(items: T[]): void {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(storageKey, JSON.stringify(items))
  }

  return {
    list(): T[] {
      return readAll()
    },
    get(id: string): T | undefined {
      return readAll().find((item) => item.id === id)
    },
    create(item: T): T {
      const items = readAll()
      items.push(item)
      writeAll(items)
      return item
    },
    update(id: string, patch: Partial<T>): T | undefined {
      const items = readAll()
      const index = items.findIndex((item) => item.id === id)
      if (index === -1) return undefined
      items[index] = { ...items[index], ...patch }
      writeAll(items)
      return items[index]
    },
    remove(id: string): void {
      writeAll(readAll().filter((item) => item.id !== id))
    },
    replaceAll(items: T[]): void {
      writeAll(items)
    },
    reset(): void {
      writeAll(seed)
    },
  }
}

export function createSingleton<T>(key: string, seed: T) {
  const storageKey = `${STORAGE_PREFIX}${key}`

  function read(): T {
    if (typeof window === 'undefined') return seed
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (!raw) {
        window.localStorage.setItem(storageKey, JSON.stringify(seed))
        return seed
      }
      return { ...seed, ...(JSON.parse(raw) as Partial<T>) }
    } catch {
      return seed
    }
  }

  function write(value: T): void {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(storageKey, JSON.stringify(value))
  }

  return {
    get(): T {
      return read()
    },
    set(value: T): T {
      write(value)
      return value
    },
    update(patch: Partial<T>): T {
      const next = { ...read(), ...patch }
      write(next)
      return next
    },
    reset(): T {
      write(seed)
      return seed
    },
  }
}
