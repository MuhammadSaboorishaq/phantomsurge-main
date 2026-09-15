import { Field } from '@/components/ui/Field'
import { Input, Select } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { BUNDLED_VIDEOS } from '@/lib/constants'
import { detectVideoType, getEmbedUrl } from '@/lib/video'

const CUSTOM_VIDEO_VALUE = '__custom__'

interface VideoFieldProps {
  label: string
  description: string
  value: { enabled: boolean; url: string }
  onChange: (next: { enabled: boolean; url: string }) => void
}

export function VideoField({ label, description, value, onChange }: VideoFieldProps) {
  const isBundled = BUNDLED_VIDEOS.some((v) => v.url === value.url)
  const videoType = detectVideoType(value.url)
  const embedUrl = getEmbedUrl(value.url)

  return (
    <div className="rounded-[var(--r-card)] border border-line p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-text">{label}</p>
          <p className="text-xs text-faint">{description}</p>
        </div>
        <Switch checked={value.enabled} onChange={(v) => onChange({ ...value, enabled: v })} />
      </div>

      <Field label="Source" hint="Choose a bundled video, or paste a YouTube, Vimeo, or direct .mp4 URL">
        <Select
          value={isBundled ? value.url : CUSTOM_VIDEO_VALUE}
          onChange={(e) => {
            const next = e.target.value
            if (next === CUSTOM_VIDEO_VALUE) {
              onChange({ ...value, url: '' })
              return
            }
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
        <Field label="Custom Video URL" hint="YouTube, Vimeo, or a direct .mp4 link">
          <Input value={value.url} onChange={(e) => onChange({ ...value, url: e.target.value })} placeholder="https://youtube.com/watch?v=… or https://…/video.mp4" />
          {value.url && videoType !== 'direct' && (
            <p className="mt-1 text-xs text-primary">
              {videoType === 'youtube' ? 'YouTube' : 'Vimeo'} video detected
            </p>
          )}
        </Field>
      )}

      {value.url && (
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-muted">Preview</p>
          {embedUrl ? (
            <div className="aspect-video w-full overflow-hidden rounded-[var(--r-control)] border border-line-strong">
              <iframe
                src={embedUrl}
                allow="autoplay; encrypted-media"
                className="h-full w-full border-0"
                title="Video preview"
              />
            </div>
          ) : (
            <video
              key={value.url}
              src={value.url}
              muted
              loop
              autoPlay
              playsInline
              className="aspect-video w-full rounded-[var(--r-control)] border border-line-strong object-cover"
            />
          )}
        </div>
      )}
    </div>
  )
}
