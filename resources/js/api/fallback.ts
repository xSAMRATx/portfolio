import type { Education, Experience, Profile, Project, Skill } from './types'

// Shown when the API is unreachable, so the page never renders empty.
export const fallbackProfile: Profile = {
  id: 0,
  name: 'Md. Abdul Aziz Samrat',
  title: 'Software Engineer · PHP & Laravel Developer',
  bio: 'PHP & Laravel developer building scalable web applications across e-commerce, ERP, HRM and CRM. I work on RESTful APIs, payment and SMS gateway integrations, MySQL optimisation and production servers, with React, Vue and Tailwind on the front end.',
  email: 'mdabdulazizsamrat@gmail.com',
  location: 'Dhaka, Bangladesh',
  social_links: { github: 'https://github.com/xSAMRATx', linkedin: null, twitter: null, website: null },
  cv_url: null,
}

let id = 0
const group = (category: Skill['category'], names: string[]): Skill[] =>
  names.map((name) => ({ id: ++id, name, category, level: null }))

export const fallbackSkills: Skill[] = [
  ...group('languages', ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'TypeScript', 'PHP', 'SQL']),
  ...group('frameworks', ['Laravel', 'React.js', 'Vue.js / Nuxt', 'Tailwind CSS', 'Bootstrap', 'Inertia.js']),
  ...group('backend', ['REST APIs', 'Eloquent / Query Builder', 'MySQL']),
  ...group('tools', ['Git / GitHub', 'Composer', 'Nginx', 'Postman', 'Linux server management', 'cPanel']),
]

export const fallbackProjects: Project[] = []
export const fallbackExperiences: Experience[] = []
export const fallbackEducations: Education[] = []
