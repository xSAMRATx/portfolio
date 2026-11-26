import type { Experience as ExperienceItem } from '../api/types'
import Reveal from '../components/Reveal'
import Section from '../components/Section'
import Skeleton from '../components/Skeleton'
import { formatDuration, formatMonthYear } from '../lib/format'

export default function Experience({ experiences, loading }: { experiences: ExperienceItem[]; loading: boolean }) {
  const sorted = [...experiences].sort((a, b) => b.start_date.localeCompare(a.start_date))

  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked">
      {loading && experiences.length === 0 ? (
        <div className="space-y-6">{[0, 1].map((i) => <Skeleton key={i} className="h-36" />)}</div>
      ) : sorted.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">Experience will be listed here soon.</p>
      ) : (
        <ol>
          {sorted.map((e, index) => {
            const dates = (
              <>
                <p className="text-sm font-medium text-fg">
                  <time dateTime={e.start_date}>{formatMonthYear(e.start_date)}</time> –{' '}
                  {e.end_date ? <time dateTime={e.end_date}>{formatMonthYear(e.end_date)}</time> : 'Present'}
                </p>
                <p className="text-sm text-subtle">{formatDuration(e.start_date, e.end_date)}</p>
              </>
            )
            return (
              <li key={e.id} className="grid grid-cols-[auto_1fr] gap-x-5 md:grid-cols-[11rem_auto_1fr] md:gap-x-8">
                <div className="hidden pt-1 text-right md:block">{dates}</div>
                {/* Timeline rail: a dot per job, joined by a line. */}
                <div aria-hidden="true" className="flex flex-col items-center">
                  <span className={`mt-1.5 grid size-6 shrink-0 place-items-center rounded-full border-2 bg-page ${e.is_current ? 'border-accent' : 'border-line'}`}>
                    <span className={`size-2 rounded-full ${e.is_current ? 'bg-accent' : 'bg-subtle'}`} />
                  </span>
                  {index < sorted.length - 1 && <span className="mt-2 w-px flex-1 bg-line" />}
                </div>
                <div className="pb-8">
                  <div className="mb-3 md:hidden">{dates}</div>
                  <Reveal className="rounded-2xl border border-line bg-card p-6 transition hover:border-accent/40">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="text-lg font-semibold text-fg">{e.role}</h3>
                      {e.is_current && <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">Current</span>}
                    </div>
                    <p className="mt-1 font-medium text-accent">{e.company}</p>
                    {e.description && (
                      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
                        {e.description
                          .split('\n')
                          .map((line) => line.replace(/^[-•*]\s*/, '').trim())
                          .filter(Boolean)
                          .map((line, i) => (
                            <li key={i} className="flex gap-3">
                              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-accent/60" />
                              <span>{line}</span>
                            </li>
                          ))}
                      </ul>
                    )}
                  </Reveal>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </Section>
  )
}
