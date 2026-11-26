import type { Skill, SkillCategory } from '../api/types'
import LevelBar from '../components/LevelBar'
import Section from '../components/Section'
import Skeleton from '../components/Skeleton'

const categoryLabels: Record<SkillCategory, string> = {
  languages: 'Languages',
  frameworks: 'Frameworks & Libraries',
  backend: 'Backend',
  tools: 'Tools & DevOps',
  other: 'Other',
}

export default function Skills({ skills, loading }: { skills: Skill[]; loading: boolean }) {
  const groups = (Object.keys(categoryLabels) as SkillCategory[])
    .map((cat) => ({ cat, items: skills.filter((s) => s.category === cat) }))
    .filter((g) => g.items.length > 0)

  return (
    <Section id="skills" eyebrow="Skills" title="What I work with">
      {loading && skills.length === 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {groups.map(({ cat, items }) => {
            const withLevels = items.filter((s) => s.level !== null)
            const chips = items.filter((s) => s.level === null)
            return (
              <div key={cat} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold text-white">{categoryLabels[cat]}</h3>
                {chips.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {chips.map((s) => (
                      <li key={s.id} className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400">
                        {s.name}
                      </li>
                    ))}
                  </ul>
                )}
                {withLevels.length > 0 && (
                  <ul className="mt-5 space-y-4">
                    {withLevels.map((s) => (
                      <li key={s.id}>
                        <div className="mb-1.5 flex justify-between text-sm">
                          <span className="text-slate-200">{s.name}</span>
                          <span className="text-slate-500">{s.level}%</span>
                        </div>
                        <LevelBar level={s.level ?? 0} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Section>
  )
}
