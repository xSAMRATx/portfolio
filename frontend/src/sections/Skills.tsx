import type { Skill, SkillCategory } from '../api/types'
import LevelBar from '../components/LevelBar'
import Section from '../components/Section'
import Skeleton from '../components/Skeleton'

const categoryLabels: Record<SkillCategory, string> = {
  backend: 'Backend',
  frontend: 'Frontend',
  database: 'Database',
  tools: 'Tools',
  other: 'Other',
}

export default function Skills({ skills, loading }: { skills: Skill[]; loading: boolean }) {
  const groups = (Object.keys(categoryLabels) as SkillCategory[])
    .map((cat) => ({ cat, items: skills.filter((s) => s.category === cat) }))
    .filter((g) => g.items.length > 0)

  return (
    <Section id="skills" eyebrow="Skills" title="What I work with">
      {loading && skills.length === 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-48" />)}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map(({ cat, items }) => (
            <div key={cat} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="text-lg font-semibold text-white">{categoryLabels[cat]}</h3>
              <ul className="mt-5 space-y-4">
                {items.map((s) => (
                  <li key={s.id}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="text-slate-200">{s.name}</span>
                      <span className="text-slate-500">{s.level}%</span>
                    </div>
                    <LevelBar level={s.level} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}
