import content from '../content/portfolio.json'
import type { Education, Experience, Profile, Project, Skill } from './types'

/*
 | Built-in copy of the portfolio content.
 | - Laravel site: shown only when the API can't be reached, so the page never renders empty.
 | - Static site (GitHub Pages): the whole page is built from it.
 | It must match database/seeders/PortfolioSeeder.php — tests/Feature/StaticContentTest.php fails when they drift.
 */
export const fallbackProfile = content.profile as Profile
export const fallbackSkills = content.skills as Skill[]
export const fallbackProjects = content.projects as Project[]
export const fallbackExperiences = content.experiences as Experience[]
export const fallbackEducations = content.educations as Education[]
