import { useEffect, useState } from 'react'
import { adminApi } from '../../api/client'
import type { ContactMessage } from '../../api/types'
import { btnDanger, btnGhost } from './ui'

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    adminApi.messages.list().then(setMessages).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const markRead = async (m: ContactMessage) => {
    await adminApi.messages.markRead(m.id)
    load()
  }
  const remove = async (m: ContactMessage) => {
    if (!window.confirm('Delete this message?')) return
    await adminApi.messages.remove(m.id)
    load()
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Messages</h1>
      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : messages.length === 0 ? (
        <p className="text-slate-500">No messages yet.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => (
            <li key={m.id} className={`rounded-2xl border p-5 ${m.read_at ? 'border-slate-800 bg-slate-900/30' : 'border-cyan-500/40 bg-slate-900/70'}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">
                    {m.name} <a href={`mailto:${m.email}`} className="font-normal text-cyan-400 hover:underline">&lt;{m.email}&gt;</a>
                  </p>
                  <p className="text-sm text-slate-500">{new Date(m.created_at).toLocaleString()}{m.subject && ` · ${m.subject}`}</p>
                </div>
                <div className="flex gap-2">
                  {!m.read_at && <button type="button" className={btnGhost} onClick={() => markRead(m)}>Mark read</button>}
                  <button type="button" className={btnDanger} onClick={() => remove(m)}>Delete</button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-slate-300">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
