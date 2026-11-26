import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Fades its children up the first time they scroll into view.
 * People who prefer reduced motion get the content immediately, with no animation (motion-safe).
 */
export default function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`${visible ? 'motion-safe:animate-fade-up' : 'motion-safe:opacity-0'} ${className}`}>
      {children}
    </div>
  )
}
