import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  href?: string
  trend?: string
}

export function StatCard({ label, value, icon: Icon, href, trend }: StatCardProps) {
  const content = (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="rounded-[var(--r-card)] border border-line bg-surface/50 p-6"
    >
      <div className="flex items-start justify-between">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">{label}</span>
        <Icon size={17} className="text-accent" />
      </div>
      <div className="mt-4 font-display text-4xl text-text">{value}</div>
      {trend && <p className="mt-1.5 font-mono text-[11px] text-faint">{trend}</p>}
    </motion.div>
  )

  return href ? <Link to={href}>{content}</Link> : content
}
