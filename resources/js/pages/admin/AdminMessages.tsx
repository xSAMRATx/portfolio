import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminApi } from '../../api/client'
import type { ContactMessage } from '../../api/types'
import { useConfirm } from '../../components/ui/ConfirmDialog'
import Icon from '../../components/ui/Icon'
import { button, card, field } from '../../components/ui/styles'
import { useToast } from '../../components/ui/Toast'
import PageHeader from './PageHeader'

type Filter = 'all' | 'unread'

const dateTime = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' })

export default function AdminMessages() {
  const toast = useToast()
  const confirm = useConfirm()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    adminApi.messages
      .list()
      .then(setMessages)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])
  useEffect(load, [load])

  const unread = messages.filter((m) => !m.read_at).length
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return messages
      .filter((m) => filter === 'all' || !m.read_at)
      .filter((m) => !q || [m.name, m.email, m.subject ?? '', m.message].some((t) => t.toLowerCase().includes(q)))
  }, [messages, query, filter])

  const markRead = async (m: ContactMessage) => {
    try {
      const updated = await adminApi.messages.markRead(m.id)
      setMessages((list) => list.map((x) => (x.id === m.id ? updated : x)))
      toast.success('Marked as read')
    } catch {
      toast.error('Could not update the message.')
    }
  }

  const remove = async (m: ContactMessage) => {
    const ok = await confirm({ title: 'Delete this message?', message: `The message from ${m.name} will be removed permanently.`, confirmLabel: 'Delete', danger: true })
    if (!ok) return
    try {
      await adminApi.messages.remove(m.id)
      setMessages((list) => list.filter((x) => x.id !== m.id))
      toast.success('Message deleted')
    } catch {
      toast.error('Could not delete the message.')
    }
  }

  const tab = (value: Filter, label: string) => (
    <button
      type="button"
      onClick={() => setFilter(value)}
      aria-pressed={filter === value}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${filter === value ? 'bg-card text-fg shadow-sm' : 'text-muted hover:text-fg'}`}
    >
      {label}
    </button>
  )

  return (
    <div>
      <PageHeader title="Messages" description={unread ? `${unread} unread` : 'Messages sent through the contact form.'} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="relative min-w-0 flex-1 sm:max-w-sm">
          <span className="sr-only">Search messages</span>
          <Icon name="search" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search messages…" className={`${field.input} pl-10`} />
        </label>
        <div className="flex rounded-xl bg-card-2 p-1">
          {tab('all', 'All')}
          {tab('unread', `Unread${unread ? ` (${unread})` : ''}`)}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3" role="status" aria-label="Loading">
          {[0, 1].map((i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-card-2" />)}
        </div>
      ) : error ? (
        <div className={`${card} flex flex-col items-center gap-3 p-10 text-center`}>
          <p className="text-danger">{error}</p>
          <button type="button" className={button.secondary} onClick={load}>Try again</button>
        </div>
      ) : shown.length === 0 ? (
        <div className={`${card} flex flex-col items-center gap-2 p-12 text-center`}>
          <Icon name="inbox" className="size-8 text-subtle" />
          <p className="font-medium text-fg">{messages.length === 0 ? 'No messages yet' : 'Nothing matches'}</p>
          <p className="text-sm text-muted">{messages.length === 0 ? 'New messages from the contact form show up here.' : 'Try a different search or filter.'}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {shown.map((m) => (
            <li key={m.id} className={`${card} relative p-5 ${m.read_at ? '' : 'border-accent/40'}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {!m.read_at && <span className="size-2 shrink-0 rounded-full bg-accent" aria-label="Unread" />}
                    <p className="truncate font-semibold text-fg">{m.name}</p>
                  </div>
                  <a href={`mailto:${m.email}`} className="text-sm text-accent hover:underline">{m.email}</a>
                  <p className="mt-0.5 text-xs text-subtle">
                    <time dateTime={m.created_at}>{dateTime.format(new Date(m.created_at))}</time>
                  </p>
                </div>
                <div className="flex gap-1">
                  {!m.read_at && (
                    <button type="button" className={button.ghost} onClick={() => markRead(m)}>
                      <Icon name="check" className="size-4" />
                      Mark read
                    </button>
                  )}
                  <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject ?? 'Your message'}`)}`} className={button.ghost}>
                    <Icon name="mail" className="size-4" />
                    Reply
                  </a>
                  <button type="button" className={`${button.icon} hover:text-danger`} onClick={() => remove(m)} aria-label={`Delete message from ${m.name}`} title="Delete">
                    <Icon name="trash" className="size-4" />
                  </button>
                </div>
              </div>
              {m.subject && <p className="mt-3 font-medium text-fg">{m.subject}</p>}
              <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-muted">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
