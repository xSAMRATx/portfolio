import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminProjects from './pages/admin/AdminProjects'
import AdminSkills from './pages/admin/AdminSkills'
import AdminEducations from './pages/admin/AdminEducations'
import AdminExperiences from './pages/admin/AdminExperiences'
import AdminMessages from './pages/admin/AdminMessages'
import AdminProfile from './pages/admin/AdminProfile'

export default function App() {
  return (
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
