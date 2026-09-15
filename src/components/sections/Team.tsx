import { Globe } from 'lucide-react'
import { teamService } from '@/services/teamService'
import { useAsync } from '@/hooks/useAsync'
import { useSite } from '@/context/SiteContext'
import { useLoadMore } from '@/hooks/useLoadMore'
import { SectionHead } from './SectionHead'
import { Reveal } from '@/components/motion/Reveal'
import { LoadMoreButton } from '@/components/ui/LoadMoreButton'
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/icons/SocialIcons'
import type { TeamMember } from '@/types'

const SOCIAL_ORDER = [
  { key: 'linkedin', Icon: LinkedinIcon, label: 'LinkedIn' },
  { key: 'twitter', Icon: TwitterIcon, label: 'Twitter' },
  { key: 'github', Icon: GithubIcon, label: 'GitHub' },
  { key: 'website', Icon: Globe, label: 'Website' },
] as const

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <Reveal
      delay={(index % 4) * 0.06}
      className="group relative bg-bg p-7 transition-colors duration-300 hover:bg-surface md:p-8"
    >
      <div className="relative mb-6 aspect-square overflow-hidden rounded-[var(--r-card)] border border-line">
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            loading="lazy"
            className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-2 font-display text-5xl text-accent">
            {member.name[0]}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute bottom-3 left-3 flex gap-2 opacity-0 transition-all duration-300 translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
          {SOCIAL_ORDER.map(({ key, Icon, label }) => {
            const url = member.social[key]
            if (!url) return null
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${member.name} on ${label}`}
                data-cursor="link"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line-strong bg-bg/80 text-muted backdrop-blur transition-colors hover:border-accent hover:text-accent"
              >
                <Icon size={13} />
              </a>
            )
          })}
        </div>
      </div>

      <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent">{member.department}</span>
      <h3 className="font-display mt-1.5 text-xl uppercase tracking-wide text-text">{member.name}</h3>
      <p className="font-mono text-xs text-muted">{member.role}</p>
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{member.bio}</p>
    </Reveal>
  )
}

export function Team() {
  const { settings } = useSite()
  const { data: allMembers } = useAsync(() => teamService.listFeatured(), [])
  const { visible: members, hasMore, remaining, loadMore } = useLoadMore(allMembers, settings.displayLimits.team)
  if (allMembers.length === 0) return null

  return (
    <section className="py-24 md:py-32">
      <div className="wrap">
        <SectionHead
          eyebrow="The operators"
          title="Meet the team"
          description="The directors and leads behind every engagement — engineering, art and applied AI under one roof."
        />
        <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member, i) => (
            <TeamCard key={member.id} member={member} index={i} />
          ))}
        </div>

        {hasMore && <LoadMoreButton onClick={loadMore} remaining={remaining} className="mt-10" />}
      </div>
    </section>
  )
}
