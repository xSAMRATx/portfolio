import { useState, type ChangeEvent, type FormEvent } from 'react'
import { ApiError, publicApi } from '../api/client'
import type { ContactPayload } from '../api/types'
import Section from '../components/Section'

const empty: ContactPayload = { name: '', email: '', subject: '', message: '' }

const inputClass =
  'w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'

export default function Contact({ email }: { email: string }) {
  const [form, setForm] = useState<ContactPayload>(empty)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [message, setMessage] = useState('')

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrors({})
    try {
      const res = await publicApi.contact(form)
      setStatus('sent')
      setMessage(res.message)
      setForm(empty)
    } catch (err) {
      setStatus('error')
      if (err instanceof ApiError) {
        setErrors(err.errors)
        setMessage(err.status === 429 ? 'Too many messages. Please try again in a minute.' : err.message)
      } else {
        setMessage('Could not reach the server. Please email me directly.')
      }
    }
  }

  const fieldError = (name: string) => errors[name]?.[0] && <p className="mt-1 text-sm text-rose-400">{errors[name][0]}</p>

  return (
    <Section id="contact" eyebrow="Contact" title="Let's work together">
      <div className="grid gap-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <p className="text-lg leading-relaxed text-slate-400">
            Have a project in mind or a role you think I'd be a good fit for? Send a message and I'll get back to you.
          </p>
          <a href={`mailto:${email}`} className="mt-6 inline-block break-all text-cyan-400 hover:underline">{email}</a>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 md:col-span-3" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <input name="name" value={form.name} onChange={onChange} placeholder="Your name" className={inputClass} required />
              {fieldError('name')}
            </div>
            <div>
              <input name="email" type="email" value={form.email} onChange={onChange} placeholder="Your email" className={inputClass} required />
              {fieldError('email')}
            </div>
          </div>
          <div>
            <input name="subject" value={form.subject} onChange={onChange} placeholder="Subject (optional)" className={inputClass} />
            {fieldError('subject')}
          </div>
          <div>
            <textarea name="message" value={form.message} onChange={onChange} rows={6} placeholder="Your message" className={inputClass} required />
            {fieldError('message')}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
            {status === 'sent' && <p className="text-emerald-400">{message}</p>}
            {status === 'error' && <p className="text-rose-400">{message}</p>}
          </div>
        </form>
      </div>
    </Section>
  )
}
