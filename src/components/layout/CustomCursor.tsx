import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useIsTouchDevice } from '@/hooks/useMediaQuery'
import { useReducedMotionPref } from '@/hooks/useReducedMotion'

type CursorState = 'default' | 'hover' | 'link' | 'image' | 'drag'

/**
 * Subtle custom cursor for desktop, non-touch, motion-safe environments only.
 * Reads `data-cursor` attributes from hovered elements to switch state.
 */
export function CustomCursor() {
  const isTouch = useIsTouchDevice()
  const reduced = useReducedMotionPref()
  const [state, setState] = useState<CursorState>('default')
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })

  useEffect(() => {
    if (isTouch || reduced) return

    function handleMove(e: MouseEvent) {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!visible) setVisible(true)
      const target = (e.target as HTMLElement)?.closest('[data-cursor]') as HTMLElement | null
      setState((target?.dataset.cursor as CursorState) || 'default')
    }
    function handleLeave() {
      setVisible(false)
    }

    window.addEventListener('mousemove', handleMove)
    document.documentElement.addEventListener('mouseleave', handleLeave)
    document.body.classList.add('cursor-none-desktop')
    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.documentElement.removeEventListener('mouseleave', handleLeave)
      document.body.classList.remove('cursor-none-desktop')
    }
  }, [isTouch, reduced, visible, x, y])

  if (isTouch || reduced) return null

  const sizeMap: Record<CursorState, number> = { default: 8, hover: 44, link: 56, image: 64, drag: 40 }
  const size = sizeMap[state]

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[300] flex items-center justify-center rounded-full mix-blend-difference"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        opacity: visible ? 1 : 0,
      }}
      animate={{ width: size, height: size }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="h-full w-full rounded-full border border-white bg-white/10" />
      {state === 'link' && (
        <span className="absolute font-mono text-[9px] uppercase tracking-wide text-white">View</span>
      )}
      {state === 'drag' && (
        <span className="absolute font-mono text-[9px] uppercase tracking-wide text-white">Drag</span>
      )}
    </motion.div>
  )
}
