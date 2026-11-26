// Literal class names so Tailwind can detect them (no inline styles allowed).
const widths = ['w-0', 'w-1/12', 'w-2/12', 'w-3/12', 'w-4/12', 'w-5/12', 'w-6/12', 'w-7/12', 'w-8/12', 'w-9/12', 'w-10/12', 'w-11/12', 'w-full']

export default function LevelBar({ level }: { level: number }) {
  const step = Math.round((Math.min(Math.max(level, 0), 100) / 100) * 12)
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800" role="meter" aria-valuenow={level} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-full bg-linear-to-r from-cyan-400 to-violet-500 ${widths[step]}`} />
    </div>
  )
}
