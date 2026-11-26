import type { Education as Edu } from '../api/types'
import Section from '../components/Section'

export default function Education({ items }: { items: Edu[] }) {
  if (items.length === 0) return null
  const degrees = items.filter((i) => i.type === 'degree')
  const trainings = items.filter((i) => i.type === 'training')

  const card = (e: Edu) => (
    <li key={e.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-white">{e.title}</h3>
        {e.period && <span className="font-mono text-sm text-slate-500">{e.period}</span>}
      </div>
      <p className="mt-1 text-cyan-400">{e.institution}</p>
      {e.result && <p className="mt-3 inline-block rounded-md bg-slate-800 px-2.5 py-1 text-sm text-slate-300">{e.result}</p>}
      {e.description && <p className="mt-3 text-sm leading-relaxed text-slate-400">{e.description}</p>}
    </li>
  )

  return (
    <Section id="education" eyebrow="Education" title="Education & training">
      {degrees.length > 0 && <ul className="grid gap-6 md:grid-cols-2">{degrees.map(card)}</ul>}
      {trainings.length > 0 && (
        <>
          <h3 className="mt-12 mb-6 text-sm font-semibold uppercase tracking-widest text-slate-500">Training</h3>
          <ul className="grid gap-6 md:grid-cols-2">{trainings.map(card)}</ul>
        </>
      )}
    </Section>
  )
}
