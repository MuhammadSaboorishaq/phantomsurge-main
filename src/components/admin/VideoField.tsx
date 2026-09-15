import { Field } from '@/components/ui/Field'
import { Input, Select } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { BUNDLED_VIDEOS } from '@/lib/constants'

const CUSTOM_VIDEO_VALUE = '__custom__'

interface VideoFieldProps {
  label: string
  description: string
  value: { enabled: boolean; url: string }
  onChange: (next: { enabled: boolean; url: string }) => void
}

/** Admin control for one video slot — enable toggle, bundled/custom source picker, live preview. */
export function VideoField({ label, description, value, onChange }: VideoFieldProps) {
  const isBundled = BUNDLED_VIDEOS.some((v) => v.url === value.url)

  return (
    <div className="rounded-[var(--r-card)] border border-line p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-text">{label}</p>
          <p className="text-xs text-faint">{description}</p>
        </div>
        <Switch checked={value.enabled} onChange={(v) => onChange({ ...value, enabled: v })} />
      </div>

      <Field label="Source" hint="Choose a video already bundled with the site, or supply an external URL">
        <Select
          value={isBundled ? value.url : CUSTOM_VIDEO_VALUE}
          onChange={(e) => {
            const next = e.target.value
            if (next === CUSTOM_VIDEO_VALUE) return
            onChange({ ...value, url: next })
          }}
        >
          {BUNDLED_VIDEOS.map((v) => (
            <option key={v.url} value={v.url}>{v.label}</option>
          ))}
          <option value={CUSTOM_VIDEO_VALUE}>Custom URL…</option>
        </Select>
      </Field>

      {!isBundled && (
        <Field label="Custom Video URL" hint="A direct link to a .mp4 file">
          <Input value={value.url} onChange={(e) => onChange({ ...value, url: e.target.value })} placeholder="https://…/video.mp4" />
        </Field>
      )}

      {value.url && (
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-muted">Preview</p>
          <video
            key={value.url}
            src={value.url}
            muted
            loop
            autoPlay
            playsInline
            className="aspect-video w-full rounded-[var(--r-control)] border border-line-strong object-cover"
          />
        </div>
      )}
    </div>
  )
}
