import type {
  ContactMessage,
  ContactPayload,
  Education,
  EducationInput,
  Experience,
  ExperienceInput,
  LoginResponse,
  Profile,
  ProfileInput,
  Project,
  ProjectInput,
  Skill,
  SkillInput,
  ValidationErrorBody,
} from './types'

/** The API is served by this same Laravel app, so every request is same-origin: `/api/...`. */
const API_BASE = '/api'

const TOKEN_KEY = 'portfolio_admin_token'

export const auth = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
}

export class ApiError extends Error {
  status: number
  errors: Record<string, string[]>

  constructor(status: number, body: ValidationErrorBody | null) {
    super(body?.message ?? `Request failed with status ${status}`)
    this.status = status
    this.errors = body?.errors ?? {}
  }
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

async function request<T>(method: Method, path: string, body?: unknown, withAuth = false): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (withAuth) {
    const token = auth.getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return undefined as T

  const data: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    if (res.status === 401 && withAuth) auth.clear()
    throw new ApiError(res.status, data as ValidationErrorBody | null)
  }
  return data as T
}

interface Wrapped<T> {
  data: T
}

const unwrap = async <T>(p: Promise<Wrapped<T>>): Promise<T> => (await p).data

/** Public endpoints */
export const publicApi = {
  profile: () => unwrap(request<Wrapped<Profile>>('GET', '/profile')),
  skills: () => unwrap(request<Wrapped<Skill[]>>('GET', '/skills')),
  projects: () => unwrap(request<Wrapped<Project[]>>('GET', '/projects')),
  experiences: () => unwrap(request<Wrapped<Experience[]>>('GET', '/experiences')),
  educations: () => unwrap(request<Wrapped<Education[]>>('GET', '/educations')),
  contact: (payload: ContactPayload) => request<{ message: string }>('POST', '/contact', payload),
}

function crud<T, I>(resource: string) {
  return {
    list: () => unwrap(request<Wrapped<T[]>>('GET', `/admin/${resource}`, undefined, true)),
    create: (input: I) => unwrap(request<Wrapped<T>>('POST', `/admin/${resource}`, input, true)),
    update: (id: number, input: I) => unwrap(request<Wrapped<T>>('PUT', `/admin/${resource}/${id}`, input, true)),
    remove: (id: number) => request<void>('DELETE', `/admin/${resource}/${id}`, undefined, true),
  }
}

async function uploadCv(file: File): Promise<Profile> {
  const body = new FormData()
  body.append('cv', file)
  const token = auth.getToken()
  const res = await fetch(`${API_BASE}/admin/profile/cv`, {
    method: 'POST',
    headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body,
  })
  const data: unknown = await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(res.status, data as ValidationErrorBody | null)
  return (data as Wrapped<Profile>).data
}

/** Admin endpoints (Sanctum bearer token) */
export const adminApi = {
  login: (email: string, password: string) => request<LoginResponse>('POST', '/admin/login', { email, password }),
  logout: () => request<void>('POST', '/admin/logout', undefined, true),
  me: () => request<LoginResponse['user']>('GET', '/admin/me', undefined, true),
  profile: {
    get: () => unwrap(request<Wrapped<Profile>>('GET', '/admin/profile', undefined, true)),
    update: (input: ProfileInput) => unwrap(request<Wrapped<Profile>>('PUT', '/admin/profile', input, true)),
    uploadCv: (file: File) => uploadCv(file),
    removeCv: () => unwrap(request<Wrapped<Profile>>('DELETE', '/admin/profile/cv', undefined, true)),
  },
  projects: crud<Project, ProjectInput>('projects'),
  skills: crud<Skill, SkillInput>('skills'),
  experiences: crud<Experience, ExperienceInput>('experiences'),
  educations: crud<Education, EducationInput>('educations'),
  messages: {
    list: () => unwrap(request<Wrapped<ContactMessage[]>>('GET', '/admin/messages', undefined, true)),
    markRead: (id: number) => unwrap(request<Wrapped<ContactMessage>>('PATCH', `/admin/messages/${id}/read`, undefined, true)),
    remove: (id: number) => request<void>('DELETE', `/admin/messages/${id}`, undefined, true),
  },
}
