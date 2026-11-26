import { useTheme } from '../lib/theme'
import Icon from './ui/Icon'
import { button } from './ui/styles'

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme()
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'
  return (
    <button type="button" onClick={toggle} className={button.icon} aria-label={label} title={label}>
      <Icon name={isDark ? 'sun' : 'moon'} />
    </button>
  )
}
