import type { Education as Edu } from '../api/types'
import Reveal from '../components/Reveal'
import Section from '../components/Section'
import Icon from '../components/ui/Icon'

function EducationCard({ item }: { item: Edu }) {
  return (
    <Reveal className="h-full">
      <article className="flex h-full gap-4 rounded-2xl border border-line bg-card p-6 transition hover:border-accent/40">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
          <Icon name={item.type === 'degree' ? 'graduation' : 'star'} />
        </span>
        <div className="min-w-0">
          <h4 className="font-semibold text-fg">{item.title}</h4>
          <p className="mt-0.5 text-sm font-medium text-accent">{item.institution}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
            {item.period && <span className="rounded-md border border-line px-2 py-1 text-muted">{item.period}</span>}
            {item.result && <span className="rounded-md bg-card-2 px-2 py-1 text-fg">{item.result}</span>}
          </div>
          {item.description && <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>}
        </div>
      </article>
    </Reveal>
  )
}

export default function Education({ items }: { items: Edu[] }) {
  if (items.length === 0) return null
  const sorted = [...items].sort((a, b) => a.order - b.order)
  const groups = [
    { label: 'Degrees', items: sorted.filter((i) => i.type === 'degree') },
    { label: 'Training & courses', items: sorted.filter((i) => i.type === 'training') },
  ].filter((g) => g.items.length > 0)

  return (
    <Section id="education" eyebrow="Education" title="Education & training">
      <div className="space-y-12">
        {groups.map((g) => (
          <div key={g.label}>
            <h3 className="mb-5 text-sm font-semibold text-subtle">{g.label}</h3>
            <ul className="grid gap-5 md:grid-cols-2">
              {g.items.map((item) => (
                <li key={item.id}>
                  <EducationCard item={item} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
