import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { adminApi, ApiError } from '../../api/client'
import type { ProfileInput } from '../../api/types'
import { useConfirm } from '../../components/ui/ConfirmDialog'
import FormField from '../../components/ui/FormField'
import Icon from '../../components/ui/Icon'
import { button, card, field } from '../../components/ui/styles'
import { useToast } from '../../components/ui/Toast'
import { firstErrors, isEmail, type Errors } from '../../lib/validation'
import PageHeader from './PageHeader'

const socialKeys = [
  { key: 'github', label: 'GitHub' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'twitter', label: 'X / Twitter' },
  { key: 'website', label: 'Website' },
] as const

const MAX_CV_BYTES = 5 * 1024 * 1024

function validateProfile(form: ProfileInput): Errors {
  const errors: Errors = {}
  if (!form.name.trim()) errors.name = 'Name is required.'
  if (!form.title.trim()) errors.title = 'Title is required.'
  if (!form.bio.trim()) errors.bio = 'Bio is required.'
  if (!isEmail(form.email)) errors.email = 'Enter a valid email address.'
  for (const { key } of socialKeys) {
    const v = form.social_links[key]
    if (v && !/^https?:\/\/\S+$/.test(v)) errors[`social_links.${key}`] = 'Enter a full URL starting with https://'
  }
  return errors
}

export default function AdminProfile() {
  const toast = useToast()
  const confirm = useConfirm()
  const [form, setForm] = useState<ProfileInput | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    adminApi.profile
      .get()
      .then(({ id: _id, cv_url, ...rest }) => setForm({ ...rest, cv_path: cv_url }))
      .catch(() => setLoadError(true))
  }, [])

  if (loadError) return <p className="text-danger">Could not load the profile. Please refresh the page.</p>
  if (!form)
    return (
      <div className="space-y-3" role="status" aria-label="Loading">
        {[0, 1, 2].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-card-2" />)}
      </div>
    )

  const set = <K extends keyof ProfileInput>(k: K, v: ProfileInput[K]) => {
    setForm((f) => (f ? { ...f, [k]: v } : f))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const onCvChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const file = input.files?.[0]
    input.value = ''
    if (!file) return
    if (file.type !== 'application/pdf') return toast.error('The CV must be a PDF file.')
    if (file.size > MAX_CV_BYTES) return toast.error('The CV must be 5 MB or smaller.')
    setUploading(true)
    try {
      const p = await adminApi.profile.uploadCv(file)
      set('cv_path', p.cv_url)
      toast.success('CV uploaded')
    } catch (ex) {
      toast.error(ex instanceof ApiError ? (ex.errors.cv?.[0] ?? ex.message) : 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const onCvRemove = async () => {
    const ok = await confirm({ title: 'Remove your CV?', message: 'The "Download CV" button will be hidden from the site until you upload a new one.', confirmLabel: 'Remove', danger: true })
    if (!ok) return
    try {
      await adminApi.profile.removeCv()
      set('cv_path', null)
      toast.success('CV removed')
    } catch {
      toast.error('Could not remove the CV.')
    }
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const clientErrors = validateProfile(form)
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors)
      toast.error('Please fix the highlighted fields.')
      return
    }
    setSaving(true)
    try {
      await adminApi.profile.update(form)
      toast.success('Profile saved')
    } catch (ex) {
      if (ex instanceof ApiError) {
        setErrors(firstErrors(ex.errors))
        toast.error(ex.message)
      } else toast.error('Could not reach the server.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title="Profile" description="Your name, intro and links shown at the top of the site." />
      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <section className={`${card} p-6 sm:p-8`} aria-labelledby="basics">
          <h2 id="basics" className="mb-5 font-semibold text-fg">Basics</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Name" error={errors.name}>
              <input className={field.input} value={form.name} onChange={(e) => set('name', e.target.value)} />
            </FormField>
            <FormField label="Title" error={errors.title} hint="e.g. Software Engineer · PHP & Laravel">
              <input className={field.input} value={form.title} onChange={(e) => set('title', e.target.value)} />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Bio" error={errors.bio} hint="Shown in the About section. Use a blank line for a new paragraph.">
                <textarea className={`${field.input} resize-y`} rows={7} value={form.bio} onChange={(e) => set('bio', e.target.value)} />
              </FormField>
            </div>
            <FormField label="Public email" error={errors.email}>
              <input className={field.input} type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
            </FormField>
            <FormField label="Location" optional error={errors.location} hint="City and country only.">
              <input className={field.input} value={form.location ?? ''} onChange={(e) => set('location', e.target.value || null)} />
            </FormField>
          </div>
        </section>

        <section className={`${card} p-6 sm:p-8`} aria-labelledby="links">
          <h2 id="links" className="mb-5 font-semibold text-fg">Links</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {socialKeys.map(({ key, label }) => (
              <FormField key={key} label={label} optional error={errors[`social_links.${key}`]}>
                <input
                  className={field.input}
                  type="url"
                  placeholder="https://"
                  value={form.social_links[key] ?? ''}
                  onChange={(e) => {
                    set('social_links', { ...form.social_links, [key]: e.target.value || null })
                    setErrors((er) => ({ ...er, [`social_links.${key}`]: undefined }))
                  }}
                />
              </FormField>
            ))}
          </div>
        </section>

        <section className={`${card} p-6 sm:p-8`} aria-labelledby="cv">
          <h2 id="cv" className="font-semibold text-fg">CV</h2>
          <p className="mt-1 text-sm text-muted">PDF, up to 5 MB. Use a public version without your phone number or home address.</p>
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-line p-4">
            <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent"><Icon name="download" /></span>
            <div className="min-w-0 flex-1">
              {form.cv_path ? (
                <a href={form.cv_path} target="_blank" rel="noreferrer" className="block truncate text-sm font-medium text-accent hover:underline">{form.cv_path}</a>
              ) : (
                <p className="text-sm text-muted">No CV uploaded. The "Download CV" button is hidden.</p>
              )}
            </div>
            <label className={`${button.secondary} cursor-pointer focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent`}>
              {uploading ? 'Uploading…' : form.cv_path ? 'Replace PDF' : 'Upload PDF'}
              <input type="file" accept="application/pdf" className="sr-only" onChange={onCvChange} disabled={uploading} />
            </label>
            {form.cv_path && (
              <button type="button" className={`${button.ghost} hover:text-danger`} onClick={onCvRemove}>
                Remove
              </button>
            )}
          </div>
        </section>

        <div className="sticky bottom-4 z-10 flex justify-end">
          <button type="submit" className={`${button.primary} shadow-lg`} disabled={saving}>
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </form>
    </div>
  )
}
