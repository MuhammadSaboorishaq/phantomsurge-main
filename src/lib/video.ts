const YT_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
]

const VIMEO_PATTERN = /vimeo\.com\/(?:video\/)?(\d+)/

export function getYouTubeId(url: string): string | null {
  for (const re of YT_PATTERNS) {
    const m = url.match(re)
    if (m) return m[1]
  }
  return null
}

export function getVimeoId(url: string): string | null {
  const m = url.match(VIMEO_PATTERN)
  return m ? m[1] : null
}

export type VideoType = 'youtube' | 'vimeo' | 'direct'

export function detectVideoType(url: string): VideoType {
  if (!url) return 'direct'
  if (getYouTubeId(url)) return 'youtube'
  if (getVimeoId(url)) return 'vimeo'
  return 'direct'
}

export function getEmbedUrl(url: string): string | null {
  const ytId = getYouTubeId(url)
  if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&modestbranding=1&rel=0`

  const vimeoId = getVimeoId(url)
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&background=1`

  return null
}

export function getThumbnailUrl(url: string): string | null {
  const ytId = getYouTubeId(url)
  if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
  return null
}
