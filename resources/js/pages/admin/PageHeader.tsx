import type { ReactNode } from 'react'
import Icon from '../../components/ui/Icon'

interface Props {
  title: string
  description?: string
  back?: { label: string; onClick: () => void }
  children?: ReactNode
}

export default function PageHeader({ title, description, back, children }: Props) {
  return (
    <div className="mb-6">
      {back && (
        <button type="button" onClick={back.onClick} className="mb-3 inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-muted hover:text-fg">
          <Icon name="arrowRight" className="size-4 rotate-180" />
          {back.label}
        </button>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fg">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}
