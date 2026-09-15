import { Input } from '@/components/ui/Input'

function toColorInputValue(value: string): string {
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) return value
  return '#2ee0cd'
}

export function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="font-mono text-[11.5px] uppercase tracking-[0.06em] text-muted">{label}</span>
      <div className="flex items-center gap-2">
        <label className="relative h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded-full border border-line-strong">
          <input
            type="color"
            value={toColorInputValue(value)}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -left-1 -top-1 h-10 w-10 cursor-pointer border-none bg-transparent p-0"
          />
        </label>
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="w-32 py-1.5 font-mono text-xs" />
      </div>
    </div>
  )
}
