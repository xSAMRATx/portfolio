import { useId, type ReactElement, cloneElement } from 'react'
import Icon from './Icon'
import { field } from './styles'

export interface ControlProps {
  id?: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

interface Props {
  label: string
  error?: string
  hint?: string
  optional?: boolean
  children: ReactElement<ControlProps>
}

/** Label + control + hint/error, wired together with ids so screen readers read the error. */
export default function FormField({ label, error, hint, optional, children }: Props) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div>
      <label htmlFor={id} className={field.label}>
        {label}
        {optional && <span className="ml-1 font-normal text-subtle">(optional)</span>}
      </label>
      {cloneElement(children, { id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy })}
      {error ? (
        <p id={`${id}-error`} className={field.error}>
          <Icon name="alert" className="size-4 shrink-0" />
          {error}
        </p>
      ) : (
        hint && <p id={`${id}-hint`} className={field.hint}>{hint}</p>
      )}
    </div>
  )
}
