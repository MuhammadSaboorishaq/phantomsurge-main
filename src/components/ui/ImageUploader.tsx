import { useCallback, useRef, useState, type DragEvent } from 'react'
import { motion } from 'framer-motion'
import { ImagePlus, Upload, X } from 'lucide-react'
import { formatFileSize } from '@/lib/utils'
import { api } from '@/lib/api'

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  label?: string
  accept?: string
  aspect?: string // tailwind aspect-* class
}

const MAX_SIZE_BYTES = 10 * 1024 * 1024

export function ImageUploader({
  value,
  onChange,
  onRemove,
  label = 'Drop an image, or click to upload',
  accept = 'image/png,image/jpeg,image/webp,image/svg+xml',
  aspect = 'aspect-video',
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
  const [meta, setMeta] = useState<{ name: string; size: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const processFile = useCallback(
    (file: File, replaceUrl?: string) => {
      setError(null)
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (JPG, PNG, WEBP or SVG).')
        return
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError(`File is too large (max ${formatFileSize(MAX_SIZE_BYTES)}).`)
        return
      }
      setMeta({ name: file.name, size: formatFileSize(file.size) })
      setProgress(0)
      let fakeProgress = 0
      const timer = setInterval(() => {
        fakeProgress = Math.min(90, fakeProgress + 12)
        setProgress(fakeProgress)
      }, 100)

      api.upload<{ url: string }>('/upload', file, replaceUrl)
        .then((result) => {
          clearInterval(timer)
          setProgress(100)
          onChange(result.url)
          setTimeout(() => setProgress(null), 400)
        })
        .catch((err) => {
          clearInterval(timer)
          setProgress(null)
          setError(err instanceof Error ? err.message : 'Upload failed.')
        })
    },
    [onChange],
  )

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  if (value) {
    return (
      <div className="group relative overflow-hidden rounded-[var(--r-control)] border border-line-strong">
        <div className={`${aspect} w-full overflow-hidden bg-bg-alt`}>
          <img src={value} alt="Uploaded preview" className="h-full w-full object-cover" />
        </div>
        {progress !== null ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70">
            <Upload className="text-accent" size={22} />
            <div className="w-2/3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-accent"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.15 }}
                />
              </div>
              {meta && <p className="mt-2 text-center font-mono text-[11px] text-white/70">{meta.name} · {meta.size}</p>}
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-[var(--r-control)] border border-line-strong bg-surface/90 px-3 py-2 font-mono text-[11px] uppercase tracking-wide text-text hover:border-accent hover:text-accent"
            >
              Replace
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="rounded-[var(--r-control)] border border-red-500/40 bg-surface/90 px-3 py-2 font-mono text-[11px] uppercase tracking-wide text-red-400 hover:bg-red-500/10"
              >
                Remove
              </button>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0], value)}
        />
      </div>
    )
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex ${aspect} w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--r-control)] border-2 border-dashed transition-colors ${
          dragActive ? 'border-accent bg-accent/5' : 'border-line-strong hover:border-line-strong/80 hover:bg-surface'
        }`}
      >
        {progress !== null ? (
          <div className="w-2/3 text-center">
            <Upload className="mx-auto mb-2 text-accent" size={22} />
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-alt">
              <motion.div
                className="h-full bg-accent"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.15 }}
              />
            </div>
            {meta && <p className="mt-2 font-mono text-[11px] text-muted">{meta.name} · {meta.size}</p>}
          </div>
        ) : (
          <>
            <ImagePlus size={22} className="text-faint" />
            <p className="px-4 text-center font-mono text-[11px] uppercase tracking-wide text-muted">{label}</p>
            <p className="text-[10.5px] text-faint">JPG, PNG, WEBP, SVG · up to {formatFileSize(MAX_SIZE_BYTES)}</p>
          </>
        )}
      </div>
      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
          <X size={12} /> {error}
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
      />
    </div>
  )
}
