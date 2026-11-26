# Portfolio — MD. ABDUL AZIZ SAMRAT

Personal portfolio: a dark, responsive one-page site with an admin area.

| Part | Stack | Folder |
|------|-------|--------|
| Frontend | React 19 + TypeScript + Tailwind CSS 4 (Vite) | [`frontend/`](frontend) |
| Backend | PHP 8.2+ / Laravel 12 REST API + Sanctum token auth | [`backend/`](backend) |

**Site sections:** Hero · About · Skills · Projects · Experience · Contact form · CV download
**Admin (`/admin`):** login, edit profile, manage projects / skills / experience, read contact messages.

---

## 1. Backend (Laravel API)

Requirements: PHP 8.2+ (with `pdo_sqlite` or `pdo_mysql`), Composer.

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Edit `.env`:

```dotenv
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173      # allowed CORS origin(s), comma separated
ADMIN_EMAIL=you@example.com             # admin login
ADMIN_PASSWORD=choose-a-strong-password # required, otherwise no admin user is seeded

# SQLite is the default. For MySQL instead:
# DB_CONNECTION=mysql
# DB_DATABASE=portfolio
# DB_USERNAME=root
# DB_PASSWORD=
```

```bash
touch database/database.sqlite   # only for SQLite
php artisan migrate --seed
php artisan serve                # http://localhost:8000
```

Re-running `php artisan db:seed` resets the portfolio content to the seed data, and updates the admin password from `.env`.

### API

Public:

| Method | Endpoint | |
|---|---|---|
| GET | `/api/profile` | name, title, bio, email, socials, `cv_url` |
| GET | `/api/skills` | |
| GET | `/api/projects` | featured first, then `order` |
| GET | `/api/experiences` | current role first |
| POST | `/api/contact` | `name, email, subject?, message` — validated, 5/min per IP |

Admin (header `Authorization: Bearer <token>`):

| Method | Endpoint |
|---|---|
| POST | `/api/admin/login` → `{ token, user }` (10/min) |
| GET | `/api/admin/me` · POST `/api/admin/logout` |
| GET / PUT | `/api/admin/profile` |
| CRUD | `/api/admin/projects`, `/api/admin/skills`, `/api/admin/experiences` |
| GET | `/api/admin/messages` · PATCH `/api/admin/messages/{id}/read` · DELETE `/api/admin/messages/{id}` |

### CV download

Put your PDF in `backend/public/` (e.g. `backend/public/cv.pdf`), then in **Admin → Profile** set *CV path* to `/cv.pdf`.
The "Download CV" button appears in the hero once a CV is set. A full URL (e.g. Google Drive) also works.

---

## 2. Frontend (React + TS + Tailwind)

Requirements: Node 20+.

```bash
cd frontend
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:8000
npm run dev              # http://localhost:5173
```

- Admin panel: http://localhost:5173/admin (log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`)
- `npm run typecheck` — TypeScript check
- `npm run build` — production build into `frontend/dist`

If the API is down, the site still renders with built-in fallback content and shows a small notice.

**Styling rule:** no inline `style` attributes — Tailwind classes only.

---

## Project structure

```
backend/
  app/Http/Controllers/Api/          public API (PortfolioController, ContactController)
  app/Http/Controllers/Api/Admin/    admin API (Auth, Profile, Project, Skill, Experience, ContactMessage)
  app/Http/Requests/                 Form Request validation
  app/Http/Resources/                API Resources (JSON shape)
  database/seeders/                  PortfolioSeeder (content), AdminUserSeeder
  routes/api.php
frontend/
  src/api/            typed API client + types + fallback data
  src/sections/       Hero, About, Skills, Projects, Experience, Contact
  src/pages/admin/    login, layout, CRUD pages
```

## Deploying (notes)

- Frontend: any static host (Vercel, Netlify, GitHub Pages). Set `VITE_API_URL` to the live API URL at build time. For client-side routes (`/admin`), configure an SPA fallback to `index.html`.
- Backend: any PHP host / VPS. Set `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL`, and `FRONTEND_URL` to your live frontend domain.
