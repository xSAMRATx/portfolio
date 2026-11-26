import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

// The admin is only for the owner, so its code is split out and never loaded by public visitors.
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'))
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'))
const AdminSkills = lazy(() => import('./pages/admin/AdminSkills'))
const AdminExperiences = lazy(() => import('./pages/admin/AdminExperiences'))
const AdminEducations = lazy(() => import('./pages/admin/AdminEducations'))
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'))

function PageLoader() {
  return (
    <div role="status" className="grid min-h-[50vh] place-items-center">
      <span className="size-8 animate-spin rounded-full border-2 border-accent border-r-transparent" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="projects" replace />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="experiences" element={<AdminExperiences />} />
          <Route path="educations" element={<AdminEducations />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
