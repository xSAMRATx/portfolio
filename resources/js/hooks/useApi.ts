import { useCallback, useEffect, useState } from 'react'

export interface ApiState<T> {
  data: T
  loading: boolean
  error: string | null
  reload: () => void
}

/** Fetches data once on mount; keeps `fallback` as data when the request fails. */
export function useApi<T>(fetcher: () => Promise<T>, fallback: T): ApiState<T> {
  const [data, setData] = useState<T>(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const reload = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
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
        if (active) setError(e instanceof Error ? e.message : 'Something went wrong')
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
