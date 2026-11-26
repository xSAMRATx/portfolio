const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' })

export const formatMonthYear = (iso: string): string => monthYear.format(new Date(iso))

/** "1 yr 4 mos" style duration between two dates (end defaults to today). */
export function formatDuration(startIso: string, endIso: string | null): string {
  const start = new Date(startIso)
  const end = endIso ? new Date(endIso) : new Date()
  const months = Math.max(1, (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth() + 1)
  const years = Math.floor(months / 12)
  const rest = months % 12
  const parts: string[] = []
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`)
  if (rest) parts.push(`${rest} mo${rest > 1 ? 's' : ''}`)
  return parts.join(' ')
}

/** Whole years since the earliest date in the list, or null when the list is empty. */
export function yearsSince(isoDates: string[]): number | null {
  if (isoDates.length === 0) return null
  const earliest = Math.min(...isoDates.map((d) => new Date(d).getTime()))
  return Math.floor((Date.now() - earliest) / (365.25 * 24 * 3600 * 1000))
}

export const initials = (name: string): string =>
  name
    .replace(/[^A-Za-z ]/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0])
    .join('')
