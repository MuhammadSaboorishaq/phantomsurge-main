const loaded = new Set<string>()

/** Injects a Google Fonts <link> for a family the theme editor lets you pick, on demand. */
export function ensureGoogleFont(family: string): void {
  if (loaded.has(family) || typeof document === 'undefined') return
  loaded.add(family)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;500;600;700;800&display=swap`
  document.head.appendChild(link)
}

export const HEADING_FONTS = ['Saira Condensed', 'Oswald', 'Bebas Neue', 'Anton', 'Rajdhani', 'Barlow Condensed']
export const BODY_FONTS = ['Inter', 'Manrope', 'Sora', 'Work Sans', 'IBM Plex Sans', 'Space Grotesk']
export const MONO_FONTS = ['JetBrains Mono', 'IBM Plex Mono', 'Space Mono', 'Roboto Mono']
