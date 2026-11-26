import type { Project } from '../api/types'
import Reveal from '../components/Reveal'
import Section from '../components/Section'
import Skeleton from '../components/Skeleton'
import Icon from '../components/ui/Icon'

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5 motion-reduce:hover:translate-y-0">
      <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-card-2">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_30%_20%,var(--accent-soft),transparent_60%)]">
            <span className="grid size-16 place-items-center rounded-2xl border border-line bg-card text-accent shadow-sm transition duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100">
              <Icon name="code" className="size-8" />
            </span>
          </div>
        )}
        {project.featured && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-on-accent">
            <Icon name="star" className="size-3.5" />
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-fg">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{project.description}</p>
        {project.tech_stack.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tech stack">
            {project.tech_stack.map((t) => (
              <li key={t} className="rounded-md bg-accent-soft px-2 py-1 text-xs font-medium text-accent">
                {t}
              </li>
            ))}
          </ul>
        )}
        {(project.github_url || project.live_url) && (
          <div className="mt-6 flex gap-4 border-t border-line pt-4 text-sm font-medium">
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-muted hover:text-accent">
                <Icon name="github" className="size-4" />
                Code<span className="sr-only"> for {project.title}</span>
              </a>
            )}
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-muted hover:text-accent">
                <Icon name="external" className="size-4" />
                Live demo<span className="sr-only"> of {project.title}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export default function Projects({ projects, loading }: { projects: Project[]; loading: boolean }) {
  const sorted = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order)

  return (
    <Section id="projects" eyebrow="Projects" title="Things I've built" intro="A selection of work, from business systems to front-end builds.">
      {loading && projects.length === 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-96" />)}
        </div>
      ) : sorted.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">Projects are coming soon.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((p) => (
            <li key={p.id}>
              <Reveal className="h-full">
                <ProjectCard project={p} />
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}
