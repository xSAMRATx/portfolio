import type { Profile } from '../api/types'
import { API_URL } from '../api/client'

export default function Hero({ profile }: { profile: Profile }) {
  const cvHref = profile.cv_url ? (profile.cv_url.startsWith('http') ? profile.cv_url : `${API_URL}${profile.cv_url}`) : null

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-20 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 pt-24 pb-16">
        <p className="font-mono text-sm text-cyan-400">Hi, my name is</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">{profile.name}</h1>
        <p className="mt-4 text-2xl font-semibold text-slate-400 sm:text-4xl">{profile.title}</p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">{profile.bio.split('\n')[0]}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#projects" className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
            View my work
          </a>
          {cvHref ? (
            <a
              href={cvHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
            >
              Download CV
            </a>
          ) : (
            <a href="#contact" className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400">
              Get in touch
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
