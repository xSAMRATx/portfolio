import type { Project } from '../api/types'
import { API_URL } from '../api/client'
import Section from '../components/Section'
import Skeleton from '../components/Skeleton'

function imageSrc(url: string | null): string | null {
  if (!url) return null
  return url.startsWith('http') ? url : `${API_URL}${url}`
}

export default function Projects({ projects, loading }: { projects: Project[]; loading: boolean }) {
  return (
    <Section id="projects" eyebrow="Projects" title="Things I've built">
      {loading && projects.length === 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-72" />)}
        </div>
      ) : projects.length === 0 ? (
        <p className="text-slate-500">Projects are coming soon.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const src = imageSrc(p.image_url)
            return (
              <article key={p.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 transition hover:-translate-y-1 hover:border-cyan-500/50">
                {src ? (
                  <img src={src} alt={p.title} className="h-44 w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-44 items-center justify-center bg-linear-to-br from-cyan-500/20 to-violet-600/20 text-4xl font-black text-white/20">
                    {p.title.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400">{p.title}</h3>
                    {p.featured && <span className="shrink-0 rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-400">Featured</span>}
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{p.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {p.tech_stack.map((t) => (
                      <li key={t} className="rounded-md bg-slate-800 px-2 py-0.5 font-mono text-xs text-slate-300">{t}</li>
                    ))}
                  </ul>
                  {(p.github_url || p.live_url) && (
                    <div className="mt-5 flex gap-4 text-sm font-medium">
                      {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-cyan-400">Code</a>}
                      {p.live_url && <a href={p.live_url} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-cyan-400">Live demo</a>}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </Section>
  )
}
