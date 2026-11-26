import { useState, type ChangeEvent, type FormEvent } from 'react'
import { ApiError, publicApi } from '../api/client'
import type { ContactPayload } from '../api/types'
import Reveal from '../components/Reveal'
import Section from '../components/Section'
import FormField from '../components/ui/FormField'
import Icon from '../components/ui/Icon'
import { button, card, field } from '../components/ui/styles'
import { useToast } from '../components/ui/Toast'
import { firstErrors, validateContact, type Errors } from '../lib/validation'

type Key = keyof ContactPayload

const empty: ContactPayload = { name: '', email: '', subject: '', message: '' }

export default function Contact({ email }: { email: string }) {
  const toast = useToast()
  const [form, setForm] = useState<ContactPayload>(empty)
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({})
  const [serverErrors, setServerErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const clientErrors = validateContact(form)
  // Show a field's error only after the user has left it (or tried to send), never while they first type.
  const errorFor = (k: Key) => serverErrors[k] ?? (touched[k] ? clientErrors[k] : undefined)

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as Key
    setForm((f) => ({ ...f, [name]: e.target.value }))
    setServerErrors((s) => ({ ...s, [name]: undefined }))
  }
  const onBlur = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setTouched((t) => ({ ...t, [e.target.name]: true }))

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTouched({ name: true, email: true, subject: true, message: true })
    const firstInvalid = (Object.keys(clientErrors) as Key[])[0]
    if (firstInvalid) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    setSending(true)
    try {
      const res = await publicApi.contact({ ...form, name: form.name.trim(), message: form.message.trim() })
      toast.success(res.message || 'Thanks! Your message has been sent.')
      setForm(empty)
      setTouched({})
      setSent(true)
    } catch (err) {
      if (err instanceof ApiError) {
        setServerErrors(firstErrors(err.errors))
        toast.error(err.status === 429 ? 'Too many messages. Please try again in a minute.' : err.message)
      } else {
        toast.error(`Could not reach the server. Please email me at ${email}.`)
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <Section id="contact" eyebrow="Contact" title="Let's work together" intro="Have a project in mind, or a role you think I'd be a good fit for? Send a message and I'll get back to you.">
      <div className="grid gap-8 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <a href={`mailto:${email}`} className={`${card} group flex items-center gap-4 p-5 transition hover:border-accent/50`}>
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent"><Icon name="mail" /></span>
            <span className="min-w-0">
              <span className="block text-xs font-medium text-subtle">Email me directly</span>
              <span className="block truncate font-medium text-fg group-hover:text-accent">{email}</span>
            </span>
          </a>
        </Reveal>

        <Reveal className="lg:col-span-3">
          {sent ? (
            <div role="status" className={`${card} flex flex-col items-center p-10 text-center`}>
              <span className="grid size-14 place-items-center rounded-full bg-success/15 text-success"><Icon name="check" className="size-7" /></span>
              <h3 className="mt-4 text-xl font-semibold text-fg">Message sent</h3>
              <p className="mt-2 text-muted">Thanks for reaching out. I'll get back to you soon.</p>
              <button type="button" className={`${button.secondary} mt-6`} onClick={() => setSent(false)}>Send another message</button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate aria-label="Contact form" className={`${card} space-y-5 p-6 sm:p-8`}>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Name" error={errorFor('name')}>
                  <input name="name" autoComplete="name" value={form.name} onChange={onChange} onBlur={onBlur} className={field.input} maxLength={100} />
                </FormField>
                <FormField label="Email" error={errorFor('email')}>
                  <input name="email" type="email" autoComplete="email" value={form.email} onChange={onChange} onBlur={onBlur} className={field.input} maxLength={150} />
                </FormField>
              </div>
              <FormField label="Subject" optional error={errorFor('subject')}>
                <input name="subject" value={form.subject ?? ''} onChange={onChange} onBlur={onBlur} className={field.input} maxLength={150} />
              </FormField>
              <FormField label="Message" error={errorFor('message')} hint={`${form.message.trim().length} / 5000 characters (at least 10)`}>
                <textarea name="message" rows={6} value={form.message} onChange={onChange} onBlur={onBlur} className={`${field.input} resize-y`} maxLength={5000} />
              </FormField>
              <button type="submit" disabled={sending} className={`${button.primary} ${button.large} w-full sm:w-auto`}>
                {sending ? (
                  <>
                    <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send message
                    <Icon name="arrowRight" className="size-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </Section>
  )
}
