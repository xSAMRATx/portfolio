import type { Experience, Profile, Project, Skill } from './types'

// Shown when the API is unreachable, so the page never renders empty.
export const fallbackProfile: Profile = {
  id: 0,
  name: 'MD. ABDUL AZIZ SAMRAT',
  title: 'Full-Stack Developer (Laravel & JavaScript)',
  bio: 'I build reliable web applications with Laravel on the backend and modern JavaScript on the frontend. I enjoy clean APIs, fast interfaces and shipping features that solve real problems.',
  email: 'you@example.com',
  location: 'Bangladesh',
  social_links: { github: 'https://github.com/xSAMRATx', linkedin: null, twitter: null, website: null },
  cv_url: null,
}

export const fallbackSkills: Skill[] = [
  { id: 1, name: 'PHP', category: 'backend', level: 90 },
  { id: 2, name: 'Laravel', category: 'backend', level: 90 },
  { id: 3, name: 'MySQL', category: 'database', level: 80 },
  { id: 4, name: 'Vue / Nuxt', category: 'frontend', level: 85 },
  { id: 5, name: 'React', category: 'frontend', level: 75 },
  { id: 6, name: 'TypeScript', category: 'frontend', level: 70 },
  { id: 7, name: 'Tailwind CSS', category: 'frontend', level: 80 },
  { id: 8, name: 'Bootstrap', category: 'frontend', level: 85 },
  { id: 9, name: 'Git', category: 'tools', level: 85 },
]

export const fallbackProjects: Project[] = []
export const fallbackExperiences: Experience[] = []
