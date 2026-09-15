import { useCountUp } from '@/hooks/useCountUp'

interface CountUpProps {
  value: string // e.g. "1000+", "750+", "1200"
  className?: string
}

/** Parses a leading number out of a display string and animates it counting up. */
export function CountUp({ value, className }: CountUpProps) {
  const match = value.match(/[\d,]+/)
  const numeric = match ? parseInt(match[0].replace(/,/g, ''), 10) : 0
  const suffix = match ? value.slice(match.index! + match[0].length) : ''
  const prefix = match ? value.slice(0, match.index) : value
  const { ref, value: current } = useCountUp(numeric)

  return (
    <div ref={ref} className={className}>
      {prefix}
      {current.toLocaleString()}
      {suffix}
    </div>
  )
}
