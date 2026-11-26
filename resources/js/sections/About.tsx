import type { Profile } from '../api/types'
import Reveal from '../components/Reveal'
import Section from '../components/Section'
import Icon from '../components/ui/Icon'
import { card } from '../components/ui/styles'
import { socialItems } from '../lib/socials'

export default function About({ profile }: { profile: Profile }) {
  const socials = socialItems(profile.social_links)
  const paragraphs = profile.bio.split('\n').filter((p) => p.trim() !== '')

  return (
    <Section id="about" eyebrow="About" title="A little about me">
      <div className="grid gap-8 lg:grid-cols-3">
        <Reveal className="space-y-5 text-lg leading-relaxed text-pretty text-muted lg:col-span-2">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Reveal>
        <Reveal>
          <dl className={`${card} divide-y divide-line`}>
            {profile.location && (
              <div className="flex items-center gap-4 p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent"><Icon name="mapPin" /></span>
                <div>
                  <dt className="text-xs font-medium text-subtle">Location</dt>
                  <dd className="font-medium text-fg">{profile.location}</dd>
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent"><Icon name="mail" /></span>
              <div className="min-w-0">
                <dt className="text-xs font-medium text-subtle">Email</dt>
                <dd className="truncate">
                  <a href={`mailto:${profile.email}`} className="font-medium text-fg hover:text-accent">{profile.email}</a>
                </dd>
              </div>
            </div>
            {socials.length > 0 && (
              <div className="p-5">
                <dt className="text-xs font-medium text-subtle">Find me on</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.key}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm font-medium text-fg transition hover:border-accent hover:text-accent"
                    >
                      <Icon name={s.icon} className="size-4" />
                      {s.label}
                    </a>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </Reveal>
      </div>
    </Section>
  )
}
