import type { ReactNode, SVGProps } from 'react'

/**
 * lucide-react no longer ships trademarked brand glyphs, so the handful of
 * social/brand icons used across the site (footer, contact links, work
 * detail "source" link) live here as minimal inline SVGs matching lucide's
 * 24x24 stroke style (stroke="currentColor", strokeWidth 2, round caps).
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number | string }

function base(children: ReactNode, { size, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ?? props.width ?? 24}
      height={size ?? props.height ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  )
}

export function TwitterIcon(props: IconProps) {
  return base(
    <path d="M4 4l7.5 9.2L4.3 20H6l6.4-6.3L17 20h3l-7.8-9.6L19.5 4H17.8l-5.9 5.8L7 4H4z" />,
    props,
  )
}

export function LinkedinIcon(props: IconProps) {
  return base(
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4v1.5A5.98 5.98 0 0 1 16 8z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>,
    props,
  )
}

export function GithubIcon(props: IconProps) {
  return base(
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.7 3 5.6 3.3 5.6 3.3a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.2 9.7c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />,
    props,
  )
}

export function InstagramIcon(props: IconProps) {
  return base(
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>,
    props,
  )
}

export function YoutubeIcon(props: IconProps) {
  return base(
    <>
      <path d="M2.5 8.5a3 3 0 0 1 3-3h13a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-13a3 3 0 0 1-3-3v-7z" />
      <path d="M10 9.5l5 2.5-5 2.5v-5z" fill="currentColor" stroke="none" />
    </>,
    props,
  )
}
