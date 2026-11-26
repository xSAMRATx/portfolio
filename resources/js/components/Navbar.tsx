import { useEffect, useRef, useState } from 'react'
import { useActiveSection } from '../hooks/useActiveSection'
import { initials } from '../lib/format'
import ThemeToggle from './ThemeToggle'
import Icon from './ui/Icon'
import { button } from './ui/styles'

export interface NavLinkItem {
  id: string
  label: string
}

export default function Navbar({ name, links }: { name: string; links: NavLinkItem[] }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(links.map((l) => l.id))
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape closes the mobile menu and returns focus to its button.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const linkClass = (id: string) =>
    `relative rounded-lg px-3 py-2 text-sm font-medium transition ${
      active === id ? 'text-accent' : 'text-muted hover:text-fg'
    }`

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open ? 'border-b border-line bg-page/80 backdrop-blur-lg' : 'border-b border-transparent'
      }`}
    >
      <a href="#main" className="sr-only rounded-lg bg-accent px-4 py-2 text-on-accent focus:not-sr-only focus:absolute focus:top-3 focus:left-3">
        Skip to content
      </a>
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5 font-bold tracking-tight text-fg" aria-label={`${name}, back to top`}>
          <span className="grid size-9 place-items-center rounded-xl bg-accent text-sm text-on-accent">{initials(name)}</span>
          <span className="hidden sm:inline">{name.replace(/^Md\.\s*/, '')}</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} className={linkClass(l.id)} aria-current={active === l.id ? 'true' : undefined}>
                {l.label}
                {active === l.id && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent" />}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <span className="ml-2 hidden md:block">
            <a href="#contact" className={button.primary}>
              Contact me
            </a>
          </span>
          <button
            ref={menuButton}
            type="button"
            className={`${button.icon} md:hidden`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-page px-5 pt-3 pb-6 md:hidden">
          <ul className="space-y-1">
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={active === l.id ? 'true' : undefined}
                  className={`block rounded-xl px-4 py-3 text-base font-medium ${
                    active === l.id ? 'bg-accent-soft text-accent' : 'text-fg hover:bg-card-2'
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
