import { useEffect, useState } from 'react'
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { adminApi, auth } from '../../api/client'
import { btnGhost } from './ui'

const nav = [
  { to: 'profile', label: 'Profile' },
  { to: 'projects', label: 'Projects' },
  { to: 'skills', label: 'Skills' },
  { to: 'experiences', label: 'Experience' },
  { to: 'educations', label: 'Education' },
  { to: 'messages', label: 'Messages' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    adminApi
      .me()
      .then(setUser)
      .catch(() => auth.clear())
      .finally(() => setChecked(true))
  }, [])

  if (!auth.getToken()) return <Navigate to="/admin/login" replace />
  if (!checked) return <p className="p-8 text-slate-400">Loading…</p>
  if (!user) return <Navigate to="/admin/login" replace />

  const logout = async () => {
    await adminApi.logout().catch(() => undefined)
    auth.clear()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800 bg-slate-900/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <span className="font-bold text-white">Portfolio admin</span>
            <nav className="flex flex-wrap gap-1">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-1.5 text-sm ${isActive ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'}`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-slate-400 hover:text-white">View site</a>
            <span className="text-sm text-slate-500">{user.name}</span>
            <button type="button" onClick={logout} className={btnGhost}>Log out</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
