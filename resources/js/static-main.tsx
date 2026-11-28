// Entry for the static GitHub Pages build (`npm run build:static`). The Laravel site uses main.tsx instead.
import '../css/app.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastProvider } from './components/ui/Toast'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

// Public pages only: no admin, no API. Unknown paths get the React 404 page (GitHub Pages serves 404.html for them).
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
