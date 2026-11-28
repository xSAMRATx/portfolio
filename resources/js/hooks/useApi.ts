import { useCallback, useEffect, useState } from 'react'
import { STATIC_SITE } from '../lib/site'

export interface ApiState<T> {
  data: T
  loading: boolean
  error: string | null
  reload: () => void
}

/**
 * Fetches data once on mount.
 * - `initial` is shown while loading (defaults to `fallback`); `fallback` is shown if the request fails.
 * - On the static site there is no API: `fallback` is the data and nothing is fetched.
 */
export function useApi<T>(fetcher: () => Promise<T>, fallback: T, initial: T = fallback): ApiState<T> {
  const [data, setData] = useState<T>(STATIC_SITE ? fallback : initial)
  const [loading, setLoading] = useState(!STATIC_SITE)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const reload = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    if (STATIC_SITE) return
    let active = true
    setLoading(true)
    fetcher()
      .then((result) => {
        if (active) {
          setData(result)
          setError(null)
        }
      })
      .catch((e: unknown) => {
        if (active) {
          setData(fallback)
          setError(e instanceof Error ? e.message : 'Something went wrong')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick])

  return { data, loading, error, reload }
}
