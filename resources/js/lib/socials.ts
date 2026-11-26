import type { SocialLinks } from '../api/types'
import type { IconName } from '../components/ui/Icon'

const meta: Record<string, { label: string; icon: IconName }> = {
  github: { label: 'GitHub', icon: 'github' },
  linkedin: { label: 'LinkedIn', icon: 'linkedin' },
  twitter: { label: 'X / Twitter', icon: 'globe' },
  website: { label: 'Website', icon: 'globe' },
}

export interface SocialItem {
  key: string
  url: string
  label: string
  icon: IconName
}

/** Only the links that are actually filled in, in a stable order. */
export function socialItems(links: SocialLinks | null | undefined): SocialItem[] {
  return Object.entries(links ?? {})
    .filter((e): e is [string, string] => typeof e[1] === 'string' && e[1].trim() !== '')
    .map(([key, url]) => ({ key, url, label: meta[key]?.label ?? key, icon: meta[key]?.icon ?? 'globe' }))
}
