import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminApi, ApiError, auth } from '../../api/client'
import ThemeToggle from '../../components/ThemeToggle'
import FormField from '../../components/ui/FormField'
import Icon from '../../components/ui/Icon'
import { button, card, field } from '../../components/ui/styles'
import { isEmail, type Errors } from '../../lib/validation'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors<'email' | 'password'>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    document.title = 'Sign in | Portfolio admin'
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const next: Errors<'email' | 'password'> = {}
    if (!isEmail(email)) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Enter your password.'
    setErrors(next)
    setFormError(null)
    if (Object.keys(next).length) return

    setBusy(true)
    try {
      const res = await adminApi.login(email, password)
      auth.setToken(res.token)
      navigate('/admin')
    } catch (err) {
      setFormError(err instanceof ApiError ? (err.status === 429 ? 'Too many attempts. Please wait a minute.' : err.message) : 'Could not reach the server.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main id="main" className="relative isolate grid min-h-screen place-items-center px-4 py-12">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[32rem] -translate-x-1/2 rounded-full bg-glow-1 blur-3xl" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent text-sm font-bold text-on-accent">AS</span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-fg">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">Sign in to manage your portfolio.</p>
        </div>
        <form onSubmit={onSubmit} noValidate className={`${card} space-y-5 p-6 shadow-xl shadow-black/5 sm:p-8`}>
          {formError && (
            <p role="alert" className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
              <Icon name="alert" className="mt-0.5 size-4 shrink-0" />
              {formError}
            </p>
          )}
          <FormField label="Email" error={errors.email}>
            <input className={field.input} type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormField>
          <FormField label="Password" error={errors.password}>
            <input className={field.input} type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormField>
          <button type="submit" className={`${button.primary} w-full`} disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link to="/" className="text-muted hover:text-fg">← Back to the site</Link>
        </p>
      </div>
    </main>
  )
}
