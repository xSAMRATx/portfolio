import type { Skill, SkillCategory } from '../api/types'
import LevelBar from '../components/LevelBar'
import Reveal from '../components/Reveal'
import Section from '../components/Section'
import Skeleton from '../components/Skeleton'
import Icon, { type IconName } from '../components/ui/Icon'
import { card } from '../components/ui/styles'

const categories: Record<SkillCategory, { label: string; icon: IconName }> = {
  languages: { label: 'Languages', icon: 'code' },
  frameworks: { label: 'Frameworks & libraries', icon: 'layers' },
  backend: { label: 'Backend & data', icon: 'folder' },
  tools: { label: 'Tools & DevOps', icon: 'briefcase' },
  other: { label: 'Other', icon: 'star' },
}

export default function Skills({ skills, loading }: { skills: Skill[]; loading: boolean }) {
  const groups = (Object.keys(categories) as SkillCategory[])
    .map((cat) => ({ cat, items: skills.filter((s) => s.category === cat) }))
    .filter((g) => g.items.length > 0)

  return (
    <Section id="skills" eyebrow="Skills" title="What I work with">
      {loading && skills.length === 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {groups.map(({ cat, items }) => {
            const leveled = items.filter((s) => s.level !== null)
            const tags = items.filter((s) => s.level === null)
            return (
              <Reveal key={cat} className={`${card} p-6 transition hover:border-accent/40`}>
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent">
                    <Icon name={categories[cat].icon} />
                  </span>
                  <h3 className="text-lg font-semibold text-fg">{categories[cat].label}</h3>
                  <span className="ml-auto text-sm text-subtle">{items.length}</span>
                </div>
                {tags.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {tags.map((s) => (
                      <li key={s.id} className="rounded-lg border border-line bg-card-2 px-3 py-1.5 text-sm font-medium text-fg">
                        {s.name}
                      </li>
                    ))}
                  </ul>
                )}
                {leveled.length > 0 && (
                  <ul className="mt-5 space-y-4">
                    {leveled.map((s) => (
                      <li key={s.id}>
                        <div className="mb-1.5 flex justify-between text-sm">
                          <span className="font-medium text-fg">{s.name}</span>
                          <span className="text-subtle">{s.level}%</span>
                        </div>
                        <LevelBar level={s.level ?? 0} label={`${s.name} level`} />
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            )
          })}
        </div>
      )}
    </Section>
  )
}
