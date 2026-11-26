import { useEffect } from 'react'
import { publicApi } from '../api/client'
import { fallbackEducations, fallbackExperiences, fallbackProfile, fallbackProjects, fallbackSkills } from '../api/fallback'
import Footer from '../components/Footer'
import Navbar, { type NavLinkItem } from '../components/Navbar'
import Icon from '../components/ui/Icon'
import { useApi } from '../hooks/useApi'
import { yearsSince } from '../lib/format'
import { socialItems } from '../lib/socials'
import About from '../sections/About'
import Contact from '../sections/Contact'
import Education from '../sections/Education'
import Experience from '../sections/Experience'
import Hero from '../sections/Hero'
import Projects from '../sections/Projects'
import Skills from '../sections/Skills'

export default function HomePage() {
  const profile = useApi(publicApi.profile, fallbackProfile)
  const skills = useApi(publicApi.skills, fallbackSkills)
  const projects = useApi(publicApi.projects, fallbackProjects)
  const experiences = useApi(publicApi.experiences, fallbackExperiences)
  const educations = useApi(publicApi.educations, fallbackEducations)

  const all = [profile, skills, projects, experiences, educations]
  const offline = all.some((s) => s.error)
  const reloadAll = () => all.forEach((s) => s.reload())

  useEffect(() => {
    if (!profile.loading) document.title = `${profile.data.name} | ${profile.data.title}`
  }, [profile.loading, profile.data.name, profile.data.title])

  const links: NavLinkItem[] = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    ...(educations.data.length > 0 ? [{ id: 'education', label: 'Education' }] : []),
    { id: 'contact', label: 'Contact' },
  ]

  // Only real numbers computed from the data; nothing is shown while it is still loading.
  const years = yearsSince(experiences.data.map((e) => e.start_date))
  const stats = all.some((s) => s.loading)
    ? []
    : [
        ...(years ? [{ value: `${years}+`, label: years === 1 ? 'Year of experience' : 'Years of experience' }] : []),
        ...(projects.data.length ? [{ value: String(projects.data.length), label: 'Projects' }] : []),
        ...(skills.data.length ? [{ value: String(skills.data.length), label: 'Skills' }] : []),
      ]

  return (
    <>
      <Navbar name={profile.data.name} links={links} />
      <main id="main">
        {offline && (
          <div role="status" className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3 text-sm text-fg shadow-lg">
            <Icon name="alert" className="size-5 shrink-0 text-danger" />
            <span className="flex-1">Some content couldn't be loaded.</span>
            <button type="button" onClick={reloadAll} className="font-semibold text-accent hover:underline">Retry</button>
          </div>
        )}
        <Hero profile={profile.data} current={experiences.data.find((e) => e.is_current) ?? null} stats={stats} />
        <About profile={profile.data} />
        <Skills skills={skills.data} loading={skills.loading} />
        <Projects projects={projects.data} loading={projects.loading} />
        <Experience experiences={experiences.data} loading={experiences.loading} />
        <Education items={educations.data} />
        <Contact email={profile.data.email} />
      </main>
      <Footer name={profile.data.name} socials={socialItems(profile.data.social_links)} />
    </>
  )
}
