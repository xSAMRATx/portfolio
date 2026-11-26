import { useEffect, useState, type FormEvent } from 'react'
import { adminApi, ApiError } from '../../api/client'
import type { ProfileInput } from '../../api/types'
import { btnPrimary, input } from './ui'

const socialKeys = ['github', 'linkedin', 'twitter', 'website'] as const

export default function AdminProfile() {
  const [form, setForm] = useState<ProfileInput | null>(null)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    adminApi.profile.get().then(({ id: _id, cv_url, ...rest }) => setForm({ ...rest, cv_path: cv_url }))
  }, [])

  if (!form) return <p className="text-slate-400">Loading…</p>

  const set = <K extends keyof ProfileInput>(k: K, v: ProfileInput[K]) => setForm((f) => (f ? { ...f, [k]: v } : f))
  const err = (k: string) => errors[k]?.[0] && <span className="block text-sm text-rose-400">{errors[k][0]}</span>

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})
    try {
      await adminApi.profile.update(form)
      setNotice('Profile saved')
    } catch (ex) {
      if (ex instanceof ApiError) {
        setErrors(ex.errors)
        setNotice(ex.message)
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
      <h1 className="text-2xl font-bold text-white">Profile</h1>
      {notice && <p className="text-sm text-slate-300">{notice}</p>}
      <label className="block space-y-1"><span className="text-sm text-slate-300">Name</span>
        <input className={input} value={form.name} onChange={(e) => set('name', e.target.value)} />{err('name')}</label>
      <label className="block space-y-1"><span className="text-sm text-slate-300">Title</span>
        <input className={input} value={form.title} onChange={(e) => set('title', e.target.value)} />{err('title')}</label>
      <label className="block space-y-1"><span className="text-sm text-slate-300">Bio (blank line = new paragraph)</span>
        <textarea className={input} rows={6} value={form.bio} onChange={(e) => set('bio', e.target.value)} />{err('bio')}</label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1"><span className="text-sm text-slate-300">Email</span>
          <input className={input} type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />{err('email')}</label>
        <label className="block space-y-1"><span className="text-sm text-slate-300">Location</span>
          <input className={input} value={form.location ?? ''} onChange={(e) => set('location', e.target.value || null)} /></label>
      </div>
      <label className="block space-y-1"><span className="text-sm text-slate-300">CV path or URL (e.g. /storage/cv.pdf)</span>
        <input className={input} value={form.cv_path ?? ''} onChange={(e) => set('cv_path', e.target.value || null)} />{err('cv_path')}</label>
      <div className="grid gap-4 sm:grid-cols-2">
        {socialKeys.map((k) => (
          <label key={k} className="block space-y-1"><span className="text-sm capitalize text-slate-300">{k}</span>
            <input className={input} type="url" value={form.social_links[k] ?? ''}
              onChange={(e) => set('social_links', { ...form.social_links, [k]: e.target.value || null })} />{err(`social_links.${k}`)}</label>
        ))}
      </div>
      <button type="submit" className={btnPrimary}>Save profile</button>
    </form>
  )
}
