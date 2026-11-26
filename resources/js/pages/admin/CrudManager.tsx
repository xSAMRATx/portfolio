import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactElement } from 'react'
import { ApiError } from '../../api/client'
import { useConfirm } from '../../components/ui/ConfirmDialog'
import FormField, { type ControlProps } from '../../components/ui/FormField'
import Icon from '../../components/ui/Icon'
import { button, card, field } from '../../components/ui/styles'
import { useToast } from '../../components/ui/Toast'
import { firstErrors, type Errors } from '../../lib/validation'
import PageHeader from './PageHeader'

export type FieldType = 'text' | 'textarea' | 'number' | 'url' | 'date' | 'checkbox' | 'select' | 'tags'

export interface Field<F> {
  name: keyof F & string
  label: string
  type: FieldType
  options?: string[]
  required?: boolean
  hint?: string
  min?: number
  max?: number
  /** Show the field across both form columns. */
  wide?: boolean
}

interface Api<T, I> {
  list: () => Promise<T[]>
  create: (input: I) => Promise<T>
  update: (id: number, input: I) => Promise<T>
  remove: (id: number) => Promise<void>
}

export interface Summary {
  primary: string
  secondary?: string
  badge?: string
}

interface Props<T extends { id: number }, F> {
  title: string
  description?: string
  singular: string
  api: Api<T, F>
  fields: Field<F>[]
  empty: F
  toForm: (item: T) => F
  summary: (item: T) => Summary
}

type FormValue = string | number | boolean | string[] | null | undefined

const isBlank = (v: FormValue) => v === null || v === undefined || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0)

function isUrl(v: string): boolean {
  try {
    const u = new URL(v)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

/** Client-side checks that mirror the API rules, so most mistakes are caught before saving. */
function validate<F extends Record<string, FormValue>>(fields: Field<F>[], form: F): Errors {
  const errors: Errors = {}
  for (const f of fields) {
    const v = form[f.name]
    if (f.required && isBlank(v)) errors[f.name] = `${f.label} is required.`
    else if (f.type === 'url' && typeof v === 'string' && v.trim() && !isUrl(v.trim())) errors[f.name] = 'Enter a full URL starting with https://'
    else if (f.type === 'number' && typeof v === 'number') {
      if (f.min !== undefined && v < f.min) errors[f.name] = `Must be at least ${f.min}.`
      if (f.max !== undefined && v > f.max) errors[f.name] = `Must be ${f.max} or less.`
    }
  }
  return errors
}

export default function CrudManager<T extends { id: number }, F extends Record<string, FormValue>>({
  title,
  description,
  singular,
  api,
  fields,
  empty,
  toForm,
  summary,
}: Props<T, F>) {
  const toast = useToast()
  const confirm = useConfirm()
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<number | 'new' | null>(null)
  const [form, setForm] = useState<F>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    setLoadError(null)
    api
      .list()
      .then(setItems)
      .catch((e: unknown) => setLoadError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [api])

  useEffect(load, [load])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((item) => {
      const s = summary(item)
      return [s.primary, s.secondary, s.badge].some((t) => t?.toLowerCase().includes(q))
    })
  }, [items, query, summary])

  const open = (id: number | 'new', values: F) => {
    setForm(values)
    setErrors({})
    setEditing(id)
    window.scrollTo({ top: 0 })
  }
  const set = (name: string, value: FormValue) => {
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((e) => ({ ...e, [name]: undefined }))
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const clientErrors = validate(fields, form)
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      e.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    setSaving(true)
    try {
      if (editing === 'new') await api.create(form)
      else if (typeof editing === 'number') await api.update(editing, form)
      toast.success(editing === 'new' ? `${singular} added` : `${singular} updated`)
      setEditing(null)
      load()
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(firstErrors(err.errors))
        toast.error(err.message)
      } else toast.error('Could not reach the server.')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (item: T) => {
    const ok = await confirm({
      title: `Delete this ${singular.toLowerCase()}?`,
      message: `"${summary(item).primary}" will be removed permanently. This can't be undone.`,
      confirmLabel: 'Delete',
      danger: true,
    })
    if (!ok) return
    try {
      await api.remove(item.id)
      setItems((list) => list.filter((i) => i.id !== item.id))
      toast.success(`${singular} deleted`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  const renderControl = (f: Field<F>): ReactElement<ControlProps> => {
    const value = form[f.name]
    switch (f.type) {
      case 'textarea':
        return <textarea className={`${field.input} resize-y`} rows={5} value={String(value ?? '')} onChange={(e) => set(f.name, e.target.value)} />
      case 'select':
        return (
          <select className={field.input} value={String(value ?? '')} onChange={(e) => set(f.name, e.target.value)}>
            {f.options?.map((o) => (
              <option key={o} value={o}>
                {o.charAt(0).toUpperCase() + o.slice(1)}
              </option>
            ))}
          </select>
        )
      case 'number':
        return (
          <input
            type="number"
            inputMode="numeric"
            min={f.min}
            max={f.max}
            className={field.input}
            value={value === null || value === undefined ? '' : Number(value)}
            onChange={(e) => set(f.name, e.target.value === '' ? null : Number(e.target.value))}
          />
        )
      case 'tags':
        return (
          <input
            className={field.input}
            placeholder="Comma separated, e.g. Laravel, React"
            value={Array.isArray(value) ? value.join(', ') : ''}
            onChange={(e) => set(f.name, e.target.value.split(',').map((t) => t.trimStart()))}
            onBlur={(e) => set(f.name, e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
          />
        )
      default:
        return (
          <input
            type={f.type}
            className={field.input}
            placeholder={f.type === 'url' ? 'https://' : undefined}
            value={String(value ?? '')}
            onChange={(e) => set(f.name, e.target.value === '' && f.type !== 'text' ? null : e.target.value)}
          />
        )
    }
  }

  if (editing !== null) {
    return (
      <div>
        <PageHeader
          title={editing === 'new' ? `Add ${singular.toLowerCase()}` : `Edit ${singular.toLowerCase()}`}
          back={{ label: `Back to ${title.toLowerCase()}`, onClick: () => setEditing(null) }}
        />
        <form onSubmit={onSubmit} noValidate className={`${card} p-6 sm:p-8`}>
          <div className="grid gap-5 md:grid-cols-2">
            {fields.map((f) =>
              f.type === 'checkbox' ? (
                <label key={f.name} className="flex cursor-pointer items-center gap-3 rounded-xl border border-line p-4 md:col-span-2">
                  <input type="checkbox" className="size-4 accent-accent" checked={Boolean(form[f.name])} onChange={(e) => set(f.name, e.target.checked)} />
                  <span className="text-sm font-medium text-fg">{f.label}</span>
                  {f.hint && <span className="text-sm text-subtle">{f.hint}</span>}
                </label>
              ) : (
                <div key={f.name} className={f.wide || f.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <FormField label={f.label} optional={!f.required} error={errors[f.name]} hint={f.hint}>
                    {renderControl(f)}
                  </FormField>
                </div>
              ),
            )}
          </div>
          <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
            <button type="submit" className={button.primary} disabled={saving}>
              {saving ? 'Saving…' : editing === 'new' ? `Add ${singular.toLowerCase()}` : 'Save changes'}
            </button>
            <button type="button" className={button.secondary} onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title={title} description={description}>
        <button type="button" className={button.primary} onClick={() => open('new', empty)}>
          <Icon name="plus" className="size-4" />
          Add {singular.toLowerCase()}
        </button>
      </PageHeader>

      <div className={card}>
        <div className="border-b border-line p-4">
          <label className="relative block max-w-sm">
            <span className="sr-only">Search {title.toLowerCase()}</span>
            <Icon name="search" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${title.toLowerCase()}…`} className={`${field.input} pl-10`} />
          </label>
        </div>

        {loading ? (
          <div className="space-y-3 p-4" role="status" aria-label="Loading">
            {[0, 1, 2].map((i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-card-2" />)}
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <p className="text-danger">{loadError}</p>
            <button type="button" className={button.secondary} onClick={load}>Try again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <p className="font-medium text-fg">{query ? 'No matches' : `No ${title.toLowerCase()} yet`}</p>
            <p className="text-sm text-muted">{query ? 'Try a different search.' : `Add your first ${singular.toLowerCase()} to show it on the site.`}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">{title}</caption>
              <thead className="text-xs font-semibold text-subtle">
                <tr className="border-b border-line">
                  <th scope="col" className="px-5 py-3">Name</th>
                  <th scope="col" className="hidden px-5 py-3 md:table-cell">Details</th>
                  <th scope="col" className="px-5 py-3 text-right"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((item) => {
                  const s = summary(item)
                  return (
                    <tr key={item.id} className="transition hover:bg-card-2/60">
                      <td className="w-full max-w-0 px-5 py-4 md:w-1/2">
                        <div className="flex min-w-0 items-center gap-2">
                          <p className="min-w-0 truncate font-medium text-fg">{s.primary}</p>
                          {s.badge && <span className="shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">{s.badge}</span>}
                        </div>
                        {s.secondary && <p className="truncate text-muted md:hidden">{s.secondary}</p>}
                      </td>
                      <td className="hidden max-w-0 truncate px-5 py-4 text-muted md:table-cell">{s.secondary}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button type="button" className={button.icon} onClick={() => open(item.id, toForm(item))} aria-label={`Edit ${s.primary}`} title="Edit">
                            <Icon name="edit" className="size-4" />
                          </button>
                          <button type="button" className={`${button.icon} hover:text-danger`} onClick={() => onDelete(item)} aria-label={`Delete ${s.primary}`} title="Delete">
                            <Icon name="trash" className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {!loading && !loadError && items.length > 0 && (
        <p className="mt-3 text-sm text-subtle">
          {filtered.length === items.length ? `${items.length} total` : `${filtered.length} of ${items.length}`}
        </p>
      )}
    </div>
  )
}
