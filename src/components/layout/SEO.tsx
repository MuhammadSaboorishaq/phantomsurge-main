import { useEffect } from 'react'
import { useSite } from '@/context/SiteContext'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  if (!content) return
  let tag = document.querySelector(`meta[${attr}="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

/** Sets document title + meta tags per-page. No extra dependency needed. */
export function SEO({ title, description, image, noIndex }: SEOProps) {
  const { settings } = useSite()

  useEffect(() => {
    const finalTitle = title ? `${title} — ${settings.brandName}` : settings.seoTitle
    const finalDescription = description ?? settings.seoDescription
    const finalImage = image ?? settings.ogImage ?? ''

    document.title = finalTitle
    setMeta('description', finalDescription)
    setMeta('robots', noIndex ? 'noindex,nofollow' : 'index,follow')
    setMeta('og:title', finalTitle, 'property')
    setMeta('og:description', finalDescription, 'property')
    setMeta('og:type', 'website', 'property')
    if (finalImage) setMeta('og:image', finalImage, 'property')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', finalTitle)
    setMeta('twitter:description', finalDescription)

    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', window.location.href)
  }, [title, description, image, noIndex, settings])

  return null
}
