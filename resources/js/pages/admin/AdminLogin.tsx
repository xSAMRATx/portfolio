import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi, ApiError, auth } from '../../api/client'
import { btnPrimary, input } from './ui'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const res = await adminApi.login(email, password)
      auth.setToken(res.token)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not reach the server')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
        <h1 className="text-2xl font-bold text-white">Admin login</h1>
        <input className={input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className={input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <button type="submit" className={`${btnPrimary} w-full`} disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
