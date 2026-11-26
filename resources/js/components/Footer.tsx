import type { SocialItem } from '../lib/socials'
import Icon from './ui/Icon'

export default function Footer({ name, socials }: { name: string; socials: SocialItem[] }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-subtle sm:flex-row sm:px-8">
        <p>
          © {new Date().getFullYear()} {name}
        </p>
        <div className="flex items-center gap-1">
          {socials.map((s) => (
            <a key={s.key} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label} className="rounded-lg p-2 hover:bg-card-2 hover:text-fg">
              <Icon name={s.icon} />
            </a>
          ))}
          <a href="#top" aria-label="Back to top" className="rounded-lg p-2 hover:bg-card-2 hover:text-fg">
            <Icon name="arrowUp" />
          </a>
        </div>
      </div>
    </footer>
  )
}
