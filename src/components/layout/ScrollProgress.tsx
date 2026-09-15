import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.2 })

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[110] h-[2px] origin-left bg-accent"
      style={{ scaleX, boxShadow: '0 0 8px var(--c-accent-glow)' }}
    />
  )
}
