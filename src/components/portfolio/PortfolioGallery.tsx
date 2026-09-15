import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { GalleryItem } from '@/types'
import { Reveal } from '@/components/motion/Reveal'

export function PortfolioGallery({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<number | null>(null)

  if (items.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={(i % 2) * 0.06}>
            <button
              onClick={() => setActive(i)}
              data-cursor="image"
              className="group block aspect-[4/3] w-full overflow-hidden rounded-[var(--r-card)] border border-line"
            >
              {item.kind === 'video' ? (
                <video src={item.url} className="h-full w-full object-cover" muted loop playsInline />
              ) : (
                <img
                  src={item.url}
                  alt={item.caption ?? ''}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 p-6"
            onClick={() => setActive(null)}
          >
            <button
              aria-label="Close gallery"
              className="absolute right-6 top-6 text-white/70 hover:text-white"
              onClick={() => setActive(null)}
            >
              <X size={24} />
            </button>
            {items.length > 1 && (
              <>
                <button
                  aria-label="Previous image"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActive((a) => (a! - 1 + items.length) % items.length)
                  }}
                  className="absolute left-4 text-white/70 hover:text-white md:left-8"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  aria-label="Next image"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActive((a) => (a! + 1) % items.length)
                  }}
                  className="absolute right-4 text-white/70 hover:text-white md:right-8"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-4xl"
            >
              {items[active].kind === 'video' ? (
                <video src={items[active].url} className="max-h-[85vh] rounded-sm" controls autoPlay />
              ) : (
                <img src={items[active].url} alt="" className="max-h-[85vh] rounded-sm object-contain" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
