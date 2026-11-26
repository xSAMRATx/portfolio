import { useEffect, useState, type FormEvent } from 'react'
import { ApiError } from '../../api/client'
import { btnDanger, btnGhost, btnPrimary, input } from './ui'

export type FieldType = 'text' | 'textarea' | 'number' | 'url' | 'date' | 'checkbox' | 'select' | 'tags'

export interface Field<F> {
  name: keyof F & string
  label: string
  type: FieldType
  options?: string[]
  required?: boolean
}

interface Api<T, I> {
  list: () => Promise<T[]>
  create: (input: I) => Promise<T>
  update: (id: number, input: I) => Promise<T>
  remove: (id: number) => Promise<void>
}

interface Props<T extends { id: number }, F> {
  title: string
  api: Api<T, F>
  fields: Field<F>[]
  empty: F
  toForm: (item: T) => F
  summary: (item: T) => { primary: string; secondary?: string }
}

type FormValue = string | number | boolean | string[] | null | undefined

export default function CrudManager<T extends { id: number }, F extends Record<string, FormValue>>({
  title,
  api,
  fields,
  empty,
  toForm,
  summary,
}: Props<T, F>) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<number | 'new' | null>(null)
  const [form, setForm] = useState<F>(empty)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [notice, setNotice] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    api
      .list()
      .then(setItems)
      .catch((e: unknown) => setNotice(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [])

  const startNew = () => {
    setForm(empty)
    setErrors({})
    setEditing('new')
  }
  const startEdit = (item: T) => {
    setForm(toForm(item))
    setErrors({})
    setEditing(item.id)
  }
  const set = (name: string, value: FormValue) => setForm((f) => ({ ...f, [name]: value }))

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})
    try {
      if (editing === 'new') await api.create(form)
      else if (typeof editing === 'number') await api.update(editing, form)
      setEditing(null)
      setNotice('Saved')
      load()
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.errors)
        setNotice(err.message)
      }
    }
  }

  const onDelete = async (item: T) => {
    if (!window.confirm(`Delete "${summary(item).primary}"?`)) return
    await api.remove(item.id)
    setNotice('Deleted')
    load()
  }

  const renderField = (f: Field<F>) => {
    const value = form[f.name]
    switch (f.type) {
      case 'textarea':
        return <textarea className={input} rows={4} value={String(value ?? '')} onChange={(e) => set(f.name, e.target.value)} />
      case 'checkbox':
        return (
          <input type="checkbox" className="h-4 w-4 accent-cyan-500" checked={Boolean(value)} onChange={(e) => set(f.name, e.target.checked)} />
        )
      case 'select':
        return (
          <select className={input} value={String(value ?? '')} onChange={(e) => set(f.name, e.target.value)}>
            {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        )
      case 'number':
        return <input type="number" className={input} value={value === null || value === undefined ? '' : Number(value)} onChange={(e) => set(f.name, e.target.value === '' ? null : Number(e.target.value))} />
      case 'tags':
        return (
          <input
            className={input}
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
            className={input}
            value={String(value ?? '')}
            required={f.required}
            onChange={(e) => set(f.name, e.target.value === '' && f.type !== 'text' ? null : e.target.value)}
          />
        )
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {editing === null && <button type="button" className={btnPrimary} onClick={startNew}>Add new</button>}
      </div>
      {notice && (
        <p className="mb-4 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300">{notice}</p>
      )}

      {editing !== null ? (
        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          {fields.map((f) => (
            <label key={f.name} className={f.type === 'checkbox' ? 'flex items-center gap-3' : 'block space-y-1'}>
              <span className="text-sm font-medium text-slate-300">{f.label}{f.required && ' *'}</span>
              {renderField(f)}
              {errors[f.name]?.[0] && <span className="block text-sm text-rose-400">{errors[f.name][0]}</span>}
            </label>
          ))}
          <div className="flex gap-3">
            <button type="submit" className={btnPrimary}>Save</button>
            <button type="button" className={btnGhost} onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      ) : loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-slate-500">Nothing here yet.</p>
      ) : (
        <ul className="divide-y divide-slate-800 rounded-2xl border border-slate-800">
          {items.map((item) => {
            const s = summary(item)
            return (
              <li key={item.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{s.primary}</p>
                  {s.secondary && <p className="truncate text-sm text-slate-500">{s.secondary}</p>}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" className={btnGhost} onClick={() => startEdit(item)}>Edit</button>
                  <button type="button" className={btnDanger} onClick={() => onDelete(item)}>Delete</button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
