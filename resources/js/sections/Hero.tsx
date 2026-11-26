import type { Experience, Profile } from '../api/types'
import Icon from '../components/ui/Icon'
import { button } from '../components/ui/styles'
import { socialItems } from '../lib/socials'

interface Stat {
  value: string
  label: string
}

export default function Hero({ profile, current, stats }: { profile: Profile; current: Experience | null; stats: Stat[] }) {
  const github = socialItems(profile.social_links).find((s) => s.key === 'github')

  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* Soft background glow + grid, purely decorative. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-48 left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-glow-1 blur-3xl" />
        <div className="absolute top-1/3 -right-32 size-96 rounded-full bg-glow-2 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--line)_1px,transparent_1px),linear-gradient(to_bottom,var(--line)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_top,black_20%,transparent_70%)] bg-size-[56px_56px] opacity-40" />
      </div>

      <div className="mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-center px-5 pt-28 pb-20 sm:px-8">
        <div className="motion-safe:animate-fade-up">
          {profile.location && (
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card/70 px-3 py-1 text-sm text-muted backdrop-blur">
              <Icon name="mapPin" className="size-4 text-accent" />
              {profile.location}
            </p>
          )}
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-balance text-fg sm:text-6xl lg:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-4 text-xl font-semibold text-balance text-accent sm:text-2xl">{profile.title}</p>
          {current && (
            <p className="mt-6 inline-flex items-center gap-2.5 text-lg text-muted">
              <span aria-hidden="true" className="relative flex size-2.5">
                <span className="absolute inline-flex size-full rounded-full bg-success opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex size-2.5 rounded-full bg-success" />
              </span>
              <span>
                Currently {current.role} at <span className="font-semibold text-fg">{current.company}</span>
              </span>
            </p>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            {profile.cv_url ? (
              <a href={profile.cv_url} target="_blank" rel="noreferrer" className={`${button.primary} ${button.large}`}>
                <Icon name="download" className="size-5" />
                Download CV
              </a>
            ) : (
              <a href="#projects" className={`${button.primary} ${button.large}`}>
                View my work
                <Icon name="arrowRight" className="size-5" />
              </a>
            )}
            <a href="#contact" className={`${button.secondary} ${button.large}`}>
              <Icon name="mail" className="size-5" />
              Contact me
            </a>
            {github && (
              <a href={github.url} target="_blank" rel="noreferrer" className={`${button.secondary} ${button.large}`}>
                <Icon name="github" className="size-5" />
                GitHub
              </a>
            )}
          </div>
        </div>

        {stats.length > 0 && (
          <dl className="mt-16 grid max-w-xl grid-cols-3 gap-4 motion-safe:animate-fade-up motion-safe:[animation-delay:150ms]">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-line bg-card/70 px-4 py-4 backdrop-blur">
                <dt className="text-xs font-medium text-subtle sm:text-sm">{s.label}</dt>
                <dd className="mt-1 text-2xl font-bold tracking-tight text-fg sm:text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}
