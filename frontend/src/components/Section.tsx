import type { ReactNode } from 'react'

interface Props {
  id: string
  eyebrow: string
  title: string
  children: ReactNode
}

export default function Section({ id, eyebrow, title, children }: Props) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">{title}</h2>
      <div className="mt-10">{children}</div>
    </section>
  )
}
