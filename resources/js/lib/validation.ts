import type { ContactPayload } from '../api/types'

export type Errors<K extends string = string> = Partial<Record<K, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const isEmail = (value: string): boolean => EMAIL.test(value.trim())

/** Same rules as App\Http\Requests\ContactRequest, so people see problems before sending. */
export function validateContact(form: ContactPayload): Errors<keyof ContactPayload> {
  const errors: Errors<keyof ContactPayload> = {}
  const name = form.name.trim()
  const message = form.message.trim()

  if (!name) errors.name = 'Please enter your name.'
  else if (name.length > 100) errors.name = 'Name must be 100 characters or fewer.'

  if (!form.email.trim()) errors.email = 'Please enter your email.'
  else if (!isEmail(form.email)) errors.email = 'Please enter a valid email address.'
  else if (form.email.length > 150) errors.email = 'Email must be 150 characters or fewer.'

  if ((form.subject ?? '').length > 150) errors.subject = 'Subject must be 150 characters or fewer.'

  if (!message) errors.message = 'Please write a message.'
  else if (message.length < 10) errors.message = 'Message must be at least 10 characters.'
  else if (message.length > 5000) errors.message = 'Message must be 5000 characters or fewer.'

  return errors
}

/** Laravel returns { field: [messages] }; keep the first message per field. */
export const firstErrors = (errors: Record<string, string[]>): Errors =>
  Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, v[0] ?? '']))
