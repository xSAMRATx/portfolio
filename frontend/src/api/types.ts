export interface SocialLinks {
  github?: string | null
  linkedin?: string | null
  twitter?: string | null
  website?: string | null
  [key: string]: string | null | undefined
}

export interface Profile {
  id: number
  name: string
  title: string
  bio: string
  email: string
  location: string | null
  social_links: SocialLinks
  cv_url: string | null
}

export type SkillCategory = 'backend' | 'frontend' | 'database' | 'tools' | 'other'

export interface Skill {
  id: number
  name: string
  category: SkillCategory
  level: number
}

export interface Project {
  id: number
  title: string
  description: string
  tech_stack: string[]
  image_url: string | null
  github_url: string | null
  live_url: string | null
  featured: boolean
  order: number
}

export interface Experience {
  id: number
  company: string
  role: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string | null
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  subject: string | null
  message: string
  read_at: string | null
  created_at: string
}

export interface ContactPayload {
  name: string
  email: string
  subject?: string
  message: string
}

export interface LoginResponse {
  token: string
  user: { id: number; name: string; email: string }
}

export type ProjectInput = Omit<Project, 'id' | 'image_url'> & { image_url?: string | null }
export type SkillInput = Omit<Skill, 'id'>
export type ExperienceInput = Omit<Experience, 'id' | 'is_current'>
export type ProfileInput = Omit<Profile, 'id' | 'cv_url'> & { cv_path?: string | null }

export interface ValidationErrorBody {
  message: string
  errors?: Record<string, string[]>
}
