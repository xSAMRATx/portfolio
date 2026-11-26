import type { Experience as Exp } from '../api/types'
import Section from '../components/Section'
import Skeleton from '../components/Skeleton'

const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

export default function Experience({ experiences, loading }: { experiences: Exp[]; loading: boolean }) {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked">
      {loading && experiences.length === 0 ? (
        <div className="space-y-6">{[0, 1].map((i) => <Skeleton key={i} className="h-32" />)}</div>
      ) : experiences.length === 0 ? (
        <p className="text-slate-500">Experience details are coming soon.</p>
      ) : (
        <ol className="relative space-y-10 border-l border-slate-800 pl-8">
          {experiences.map((e) => (
            <li key={e.id} className="relative">
              <span className="absolute top-1.5 -left-[2.3rem] h-3 w-3 rounded-full border-2 border-cyan-400 bg-slate-950" />
              <p className="font-mono text-sm text-slate-500">
                {fmt(e.start_date)} — {e.is_current || !e.end_date ? 'Present' : fmt(e.end_date)}
              </p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                {e.role} <span className="text-cyan-400">@ {e.company}</span>
              </h3>
              {e.description && <p className="mt-3 max-w-3xl leading-relaxed text-slate-400 whitespace-pre-line">{e.description}</p>}
            </li>
          ))}
        </ol>
      )}
    </Section>
  )
}
