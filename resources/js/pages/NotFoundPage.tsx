import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import Icon from '../components/ui/Icon'
import { button } from '../components/ui/styles'

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page not found'
  }, [])

  return (
    <main id="main" className="relative isolate grid min-h-[100svh] place-items-center overflow-hidden px-6">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[36rem] -translate-x-1/2 rounded-full bg-glow-1 blur-3xl" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="text-center motion-safe:animate-fade-up">
        <p className="text-8xl font-extrabold tracking-tighter text-accent sm:text-9xl">404</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-fg sm:text-3xl">This page doesn't exist</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">The link may be old or mistyped. Let's get you back on track.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className={button.primary}>
            <Icon name="home" className="size-4" />
            Back to home
          </Link>
          <a href="/#contact" className={button.secondary}>
            <Icon name="mail" className="size-4" />
            Contact
          </a>
        </div>
      </div>
    </main>
  )
}
