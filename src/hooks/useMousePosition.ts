import { useEffect, useState, type RefObject } from 'react'

interface NormalizedPosition {
  x: number // -1 to 1
  y: number // -1 to 1
}

/** Tracks pointer position relative to an element's center, normalized to [-1, 1]. */
export function useMouseParallax(ref: RefObject<HTMLElement | null>, disabled = false): NormalizedPosition {
  const [pos, setPos] = useState<NormalizedPosition>({ x: 0, y: 0 })

  useEffect(() => {
    if (disabled) return
    const el = ref.current
    if (!el) return

    function handleMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
      setPos({ x, y })
    }
    function handleLeave() {
      setPos({ x: 0, y: 0 })
    }

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [ref, disabled])

  return pos
}

/** Tracks raw viewport pointer position — used by the custom cursor. */
export function useViewportPointer(disabled = false) {
  const [pos, setPos] = useState({ x: -100, y: -100 })

  useEffect(() => {
    if (disabled) return
    function handleMove(e: MouseEvent) {
      setPos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [disabled])

  return pos
}
