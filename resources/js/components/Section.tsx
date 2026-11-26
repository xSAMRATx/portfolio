import type { ReactNode } from 'react'
import Reveal from './Reveal'

interface Props {
  id: string
  eyebrow: string
  title: string
  intro?: string
  children: ReactNode
}

export default function Section({ id, eyebrow, title, intro, children }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <p className="text-sm font-semibold tracking-wide text-accent">{eyebrow}</p>
        <h2 id={`${id}-title`} className="mt-2 text-3xl font-bold tracking-tight text-balance text-fg sm:text-4xl">
          {title}
        </h2>
        {intro && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-pretty text-muted">{intro}</p>}
      </Reveal>
      <div className="mt-12">{children}</div>
    </section>
  )
}
