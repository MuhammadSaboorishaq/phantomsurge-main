import type { Transition, Variants } from 'framer-motion'

/**
 * Central motion system for Phantom Surge Studios.
 * All timings/easing live here so the whole site moves with one voice.
 * Respect `prefers-reduced-motion` by checking `useReducedMotionPref()`
 * (see hooks/useReducedMotion.ts) before applying these where it matters.
 */

export const EASE_OUT = [0.16, 1, 0.3, 1] as const
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const

export const DURATION = {
  fast: 0.2,
  normal: 0.45,
  cinematic: 0.9,
} as const

export const springs = {
  soft: { type: 'spring', stiffness: 120, damping: 20, mass: 0.6 } satisfies Transition,
  snappy: { type: 'spring', stiffness: 260, damping: 24 } satisfies Transition,
  magnetic: { type: 'spring', stiffness: 150, damping: 15, mass: 0.3 } satisfies Transition,
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE_OUT },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DURATION.normal, ease: EASE_OUT } },
}

export const slideIn = (direction: 'left' | 'right' = 'left'): Variants => ({
  hidden: { opacity: 0, x: direction === 'left' ? -40 : 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.normal, ease: EASE_OUT },
  },
})

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.normal, ease: EASE_OUT },
  },
}

export const reveal: Variants = {
  hidden: { opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' },
  show: {
    opacity: 1,
    y: 0,
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: DURATION.cinematic, ease: EASE_OUT },
  },
}

export const imageReveal: Variants = {
  hidden: { clipPath: 'inset(0 0 0 100%)', scale: 1.08 },
  show: {
    clipPath: 'inset(0 0 0 0%)',
    scale: 1,
    transition: { duration: DURATION.cinematic, ease: EASE_OUT },
  },
}

export const staggerChildren = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
})

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.normal, ease: EASE_OUT } },
}

export const wordReveal: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
}

export const wordItem: Variants = {
  hidden: { opacity: 0, y: '100%' },
  show: { opacity: 1, y: '0%', transition: { duration: 0.6, ease: EASE_OUT } },
}

export const viewportOnce = { once: true, margin: '-80px 0px -80px 0px' } as const
