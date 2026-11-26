import { useCallback, useEffect, useState } from 'react'

export type ThemeChoice = 'light' | 'dark' | 'system'

const KEY = 'portfolio_theme'
const media = () => window.matchMedia('(prefers-color-scheme: dark)')

export function readChoice(): ThemeChoice {
  const saved = localStorage.getItem(KEY)
  return saved === 'light' || saved === 'dark' ? saved : 'system'
}

function apply(choice: ThemeChoice): void {
  const dark = choice === 'dark' || (choice === 'system' && media().matches)
  document.documentElement.classList.toggle('dark', dark)
}

/** Light / dark / system theme. Follows the OS by default and remembers an explicit choice. */
export function useTheme() {
  const [choice, setChoice] = useState<ThemeChoice>(readChoice)
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    apply(choice)
    setIsDark(document.documentElement.classList.contains('dark'))
    if (choice !== 'system') return
    const mq = media()
    const onChange = () => {
      apply('system')
      setIsDark(mq.matches)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [choice])

  const choose = useCallback((next: ThemeChoice) => {
    if (next === 'system') localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, next)
    setChoice(next)
  }, [])

  /** Simple two-state toggle: switches to the opposite of what is shown now. */
  const toggle = useCallback(() => choose(isDark ? 'light' : 'dark'), [choose, isDark])

  return { choice, isDark, choose, toggle }
}
