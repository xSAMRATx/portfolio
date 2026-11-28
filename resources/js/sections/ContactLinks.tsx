import type { Profile } from '../api/types'
import Reveal from '../components/Reveal'
import Section from '../components/Section'
import Icon, { type IconName } from '../components/ui/Icon'
import { card } from '../components/ui/styles'
import { socialItems } from '../lib/socials'

interface ContactCard {
  key: string
  href: string
  label: string
  value: string
  icon: IconName
  external: boolean
}

/** Static-site contact section: there is no server to send a form to, so visitors get direct links instead. */
export default function ContactLinks({ profile }: { profile: Profile }) {
  const cards: ContactCard[] = [
    { key: 'email', href: `mailto:${profile.email}`, label: 'Email me', value: profile.email, icon: 'mail', external: false },
    ...socialItems(profile.social_links).map((s) => ({
      key: s.key,
      href: s.url,
      label: s.key === 'linkedin' ? 'Connect on LinkedIn' : s.key === 'github' ? 'See my code on GitHub' : s.label,
      value: s.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
      icon: s.icon,
      external: true,
    })),
  ]

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's work together"
      intro="Have a project in mind, or a role you think I'd be a good fit for? Email me or connect on LinkedIn and I'll get back to you."
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <li key={c.key} className="min-w-0">
            <Reveal className="h-full min-w-0">
              <a
                href={c.href}
                {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                className={`${card} group flex h-full items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:border-accent/50 motion-reduce:hover:translate-y-0`}
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon name={c.icon} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-fg group-hover:text-accent">{c.label}</span>
                  <span className="block truncate text-sm text-subtle">{c.value}</span>
                </span>
                <Icon name={c.external ? 'external' : 'arrowRight'} className="size-4 shrink-0 text-subtle group-hover:text-accent" />
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
