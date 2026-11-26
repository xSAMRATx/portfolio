// Shared Tailwind class strings, so buttons and inputs look the same everywhere.
const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 motion-safe:active:scale-[0.98]'

export const button = {
  primary: `${base} bg-accent px-5 py-2.5 text-sm text-on-accent shadow-sm hover:bg-accent-strong`,
  secondary: `${base} border border-line bg-card px-5 py-2.5 text-sm text-fg hover:border-accent hover:text-accent`,
  ghost: `${base} px-3 py-2 text-sm text-muted hover:bg-card-2 hover:text-fg`,
  danger: `${base} bg-danger px-5 py-2.5 text-sm text-white hover:opacity-90`,
  icon: 'inline-flex size-10 items-center justify-center rounded-xl text-muted transition hover:bg-card-2 hover:text-fg',
  // Bigger buttons from the sm breakpoint up (responsive variants always win over the base size).
  large: 'sm:px-6 sm:py-3 sm:text-base',
}

export const field = {
  label: 'mb-1.5 block text-sm font-medium text-fg',
  input:
    'block w-full rounded-xl border border-line bg-card px-4 py-2.5 text-sm text-fg placeholder:text-subtle shadow-xs transition focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent-soft aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/15',
  error: 'mt-1.5 flex items-center gap-1.5 text-sm text-danger',
  hint: 'mt-1.5 text-xs text-subtle',
}

export const card = 'rounded-2xl border border-line bg-card'
