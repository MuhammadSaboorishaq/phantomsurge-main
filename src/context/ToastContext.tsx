import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, Info, X, XCircle } from 'lucide-react'
import { generateId } from '@/lib/utils'

type ToastVariant = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  show: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const ICONS: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
}

const COLORS: Record<ToastVariant, string> = {
  success: 'text-accent border-accent/30',
  error: 'text-red-400 border-red-400/30',
  info: 'text-chrome-2 border-line-strong',
  warning: 'text-amber-400 border-amber-400/30',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const show = useCallback(
    (message: string, variant: ToastVariant = 'success') => {
      const id = generateId('toast')
      setToasts((prev) => [...prev, { id, message, variant }])
      setTimeout(() => dismiss(id), 4200)
    },
    [dismiss],
  )

  const value = useMemo<ToastContextValue>(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[200] flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.variant]
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`pointer-events-auto flex items-start gap-3 rounded-control border bg-surface/95 px-4 py-3 font-mono text-[13px] text-text shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)] backdrop-blur ${COLORS[t.variant]}`}
              >
                <Icon size={16} className="mt-0.5 shrink-0" />
                <span className="flex-1 leading-snug">{t.message}</span>
                <button
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss notification"
                  className="shrink-0 text-faint transition-colors hover:text-text"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
