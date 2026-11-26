import type { Profile } from '../api/types'
import Section from '../components/Section'

const socialLabels: Record<string, string> = { github: 'GitHub', linkedin: 'LinkedIn', twitter: 'X / Twitter', website: 'Website' }

export default function About({ profile }: { profile: Profile }) {
  const socials = Object.entries(profile.social_links ?? {}).filter((e): e is [string, string] => Boolean(e[1]))

  return (
    <Section id="about" eyebrow="About" title="A little about me">
      <div className="grid gap-10 md:grid-cols-3">
        <div className="space-y-4 text-lg leading-relaxed text-slate-400 md:col-span-2">
          {profile.bio.split('\n').filter(Boolean).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <dl className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          {profile.location && (
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">Location</dt>
              <dd className="mt-1 text-slate-200">{profile.location}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs uppercase tracking-wider text-slate-500">Email</dt>
            <dd className="mt-1 break-all">
              <a href={`mailto:${profile.email}`} className="text-cyan-400 hover:underline">{profile.email}</a>
            </dd>
          </div>
          {socials.length > 0 && (
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">Find me on</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {socials.map(([key, url]) => (
                  <a key={key} href={url} target="_blank" rel="noreferrer" className="rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-300 hover:border-cyan-400 hover:text-cyan-400">
                    {socialLabels[key] ?? key}
                  </a>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </Section>
  )
}
