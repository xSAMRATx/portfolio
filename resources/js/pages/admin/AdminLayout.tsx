import { useEffect, useState } from 'react'
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { adminApi, auth } from '../../api/client'
import ThemeToggle from '../../components/ThemeToggle'
import Icon, { type IconName } from '../../components/ui/Icon'
import { button } from '../../components/ui/styles'

const nav: { to: string; label: string; icon: IconName }[] = [
  { to: 'profile', label: 'Profile', icon: 'user' },
  { to: 'projects', label: 'Projects', icon: 'folder' },
  { to: 'skills', label: 'Skills', icon: 'layers' },
  { to: 'experiences', label: 'Experience', icon: 'briefcase' },
  { to: 'educations', label: 'Education', icon: 'graduation' },
  { to: 'messages', label: 'Messages', icon: 'inbox' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [checked, setChecked] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.title = 'Admin | Portfolio'
    adminApi
      .me()
      .then(setUser)
      .catch(() => auth.clear())
      .finally(() => setChecked(true))
  }, [])

  // Close the mobile drawer after navigating.
  useEffect(() => setMenuOpen(false), [location.pathname])

  if (!auth.getToken()) return <Navigate to="/admin/login" replace />
  if (!checked)
    return (
      <div role="status" className="grid min-h-screen place-items-center">
        <span className="size-8 animate-spin rounded-full border-2 border-accent border-r-transparent" />
        <span className="sr-only">Loading…</span>
      </div>
    )
  if (!user) return <Navigate to="/admin/login" replace />

  const logout = async () => {
    await adminApi.logout().catch(() => undefined)
    auth.clear()
    navigate('/admin/login')
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <span className="grid size-8 place-items-center rounded-lg bg-accent text-xs font-bold text-on-accent">AS</span>
        <span className="font-semibold text-fg">Portfolio admin</span>
      </div>
      <nav aria-label="Admin" className="flex-1 space-y-1 px-3 py-4">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-accent-soft text-accent' : 'text-muted hover:bg-card-2 hover:text-fg'
              }`
            }
          >
            <Icon name={n.icon} className="size-5" />
            {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-line p-3">
        <a href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-card-2 hover:text-fg">
          <Icon name="external" className="size-5" />
          View site
        </a>
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-card-2 text-muted"><Icon name="user" className="size-4" /></span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-fg">{user.name}</p>
            <p className="truncate text-xs text-subtle">{user.email}</p>
          </div>
          <button type="button" onClick={logout} className={button.icon} aria-label="Log out" title="Log out">
            <Icon name="logout" className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen lg:pl-64">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-card lg:block">{sidebar}</aside>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] border-r border-line bg-card shadow-2xl">{sidebar}</aside>
        </div>
      )}

      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-page/80 px-4 backdrop-blur-lg sm:px-6 lg:px-10">
        <button type="button" className={`${button.icon} lg:hidden`} aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
          <Icon name="menu" />
        </button>
        <p className="text-sm text-muted">
          Signed in as <span className="font-medium text-fg">{user.name}</span>
        </p>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>

      <main id="main" className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
        <Outlet />
      </main>
    </div>
  )
}
