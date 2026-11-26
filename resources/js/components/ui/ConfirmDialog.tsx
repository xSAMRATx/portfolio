import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { button } from './styles'

interface ConfirmOptions {
  title: string
  message?: string
  confirmLabel?: string
  danger?: boolean
}

type Confirm = (options: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<Confirm | null>(null)

/** Accessible confirm dialog built on the native <dialog> element (focus trap, Escape to cancel). */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const resolver = useRef<((ok: boolean) => void) | null>(null)
  const [options, setOptions] = useState<ConfirmOptions | null>(null)

  const confirm = useCallback<Confirm>((opts) => {
    setOptions(opts)
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve
    })
  }, [])

  useEffect(() => {
    if (options && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal()
  }, [options])

  const close = (ok: boolean) => {
    dialogRef.current?.close()
    resolver.current?.(ok)
    resolver.current = null
    setOptions(null)
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <dialog
        ref={dialogRef}
        onCancel={(e) => {
          e.preventDefault()
          close(false)
        }}
        aria-labelledby="confirm-title"
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-line bg-card p-0 text-fg shadow-2xl"
      >
        {options && (
          <div className="p-6">
            <h2 id="confirm-title" className="text-lg font-semibold">{options.title}</h2>
            {options.message && <p className="mt-2 text-sm leading-relaxed text-muted">{options.message}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" className={button.secondary} onClick={() => close(false)} autoFocus>
                Cancel
              </button>
              <button type="button" className={options.danger ? button.danger : button.primary} onClick={() => close(true)}>
                {options.confirmLabel ?? 'Confirm'}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </ConfirmContext.Provider>
  )
}

export function useConfirm(): Confirm {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used inside <ConfirmProvider>')
  return ctx
}
