import { publicApi } from '../api/client'
import { fallbackExperiences, fallbackProfile, fallbackProjects, fallbackSkills } from '../api/fallback'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { useApi } from '../hooks/useApi'
import About from '../sections/About'
import Contact from '../sections/Contact'
import Experience from '../sections/Experience'
import Hero from '../sections/Hero'
import Projects from '../sections/Projects'
import Skills from '../sections/Skills'

export default function HomePage() {
  const profile = useApi(publicApi.profile, fallbackProfile)
  const skills = useApi(publicApi.skills, fallbackSkills)
  const projects = useApi(publicApi.projects, fallbackProjects)
  const experiences = useApi(publicApi.experiences, fallbackExperiences)

  const offline = [profile, skills, projects, experiences].some((s) => s.error)

  return (
    <>
      <Navbar name={profile.data.name} />
      <main>
        {offline && (
          <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs text-amber-300 backdrop-blur">
            Showing cached content — the API is unreachable right now.
          </div>
        )}
        <Hero profile={profile.data} />
        <About profile={profile.data} />
        <Skills skills={skills.data} loading={skills.loading} />
        <Projects projects={projects.data} loading={projects.loading} />
        <Experience experiences={experiences.data} loading={experiences.loading} />
        <Contact email={profile.data.email} />
      </main>
      <Footer name={profile.data.name} />
    </>
  )
}
