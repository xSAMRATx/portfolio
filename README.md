# Portfolio — Md. Abdul Aziz Samrat

Personal portfolio: a dark, responsive one-page site with an admin area.

**One plain Laravel 12 project** (no starter kit). The React 19 + TypeScript + Tailwind CSS 4 app lives in
`resources/js` and is served by Laravel through Vite (`laravel-vite-plugin`). The same app serves the REST API at `/api`,
so there is no separate frontend, no CORS setup and no API URL to configure.

**Site sections:** Hero · About · Skills · Projects · Experience · Education & training · Contact form · CV download
**Admin (`/admin`):** login, edit profile, manage projects / skills / experience / education, upload CV, read contact messages.

---

## Getting started

Requirements: PHP 8.2+ (with `pdo_sqlite` or `pdo_mysql`), Composer, Node 20.19+ or 22.12+.

```bash
composer install
cp .env.example .env            # Windows PowerShell: copy .env.example .env
php artisan key:generate
```

Edit `.env`:

```dotenv
APP_URL=http://localhost:8000
ADMIN_EMAIL=you@example.com             # admin login
ADMIN_PASSWORD=choose-a-strong-password

# SQLite is the default. For MySQL instead:
# DB_CONNECTION=mysql
# DB_DATABASE=portfolio
# DB_USERNAME=root
# DB_PASSWORD=
```

```bash
php artisan migrate --seed      # SQLite: answer "yes" if it offers to create database/database.sqlite
npm install
```

Then run these two in **two terminals**:

```bash
php artisan serve               # http://localhost:8000  ← open this one
npm run dev                     # Vite: hot reload for React + Tailwind
```

- Site: http://localhost:8000 · Admin: http://localhost:8000/admin (log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`)
- Always open port **8000** (Laravel). Port 5173 is only Vite's asset server.
- Shortcut: `composer run dev` starts the server, queue worker, logs and Vite together.

Re-running `php artisan db:seed` resets the portfolio content to the seed data, and updates the admin password from `.env`.

### Useful commands

| Command | What it does |
|---|---|
| `npm run typecheck` | TypeScript check |
| `npm run build` | production build into `public/build` (type-checks first) |
| `php artisan test` | PHP feature tests |
| `vendor/bin/pint` | PHP code style |

If the API is down, the site still renders with built-in fallback content and shows a small notice.

**Styling rule:** no inline `style` attributes — Tailwind classes only.

---

### API

Public:

| Method | Endpoint | |
|---|---|---|
| GET | `/api/profile` | name, title, bio, email, socials, `cv_url` |
| GET | `/api/skills` | |
| GET | `/api/projects` | featured first, then `order` |
| GET | `/api/experiences` | current role first |
| GET | `/api/educations` | degrees and trainings |
| POST | `/api/contact` | `name, email, subject?, message` — validated, 5/min per IP |

Admin (header `Authorization: Bearer <token>`):

| Method | Endpoint |
|---|---|
| POST | `/api/admin/login` → `{ token, user }` (10/min) |
| GET | `/api/admin/me` · POST `/api/admin/logout` |
| GET / PUT | `/api/admin/profile` |
| POST / DELETE | `/api/admin/profile/cv` (multipart field `cv`, PDF ≤ 5 MB) |
| CRUD | `/api/admin/projects`, `/api/admin/skills`, `/api/admin/experiences`, `/api/admin/educations` |
| GET | `/api/admin/messages` · PATCH `/api/admin/messages/{id}/read` · DELETE `/api/admin/messages/{id}` |

### CV download

Upload the PDF from **Admin → Profile → CV**. It is saved as `public/uploads/cv.pdf` (git-ignored) and the
"Download CV" button appears in the hero. Use a public version of the CV without phone number or home address.

Skills with an empty `level` are shown as tags; give a skill a 0–100 level to show it as a progress bar instead.

---

## How it fits together

- `routes/web.php` has one catch-all route that returns `resources/views/app.blade.php` for every page (`/`, `/admin`,
  `/admin/projects`...). React Router then shows the right page, so refreshing or opening a deep link works.
  `api/*`, `storage/*`, `uploads/*`, `build/*` and `/up` are excluded and keep their normal behaviour.
- `app.blade.php` loads the app with `@viteReactRefresh` and `@vite([...])`: in development the files come from the Vite
  dev server (hot reload), after `npm run build` from `public/build`.
- The React API client calls `/api/...` on the same origin. Admin auth is a Sanctum bearer token (stored in the browser).
- `config/cors.php` allows no other origins by default. Set `CORS_ALLOWED_ORIGINS` only if another site must call the API.

## Project structure

```
app/Http/Controllers/Api/          public API (PortfolioController, ContactController)
app/Http/Controllers/Api/Admin/    admin API (Auth, Profile, Project, Skill, Experience, Education, ContactMessage)
app/Http/Requests/                 Form Request validation
app/Http/Resources/                API Resources (JSON shape)
database/seeders/                  PortfolioSeeder (content), AdminUserSeeder
routes/api.php                     API routes
routes/web.php                     catch-all route for the React app
resources/views/app.blade.php      the HTML shell
resources/css/app.css              Tailwind entry
resources/js/                      React app
  main.tsx, App.tsx                entry + routes
  api/                             typed API client + types + fallback data
  sections/                        Hero, About, Skills, Projects, Experience, Education, Contact
  pages/admin/                     login, layout, CRUD pages
```

## Deploying (notes)

1. On the server: `composer install --no-dev --optimize-autoloader`, set `.env` (`APP_ENV=production`, `APP_DEBUG=false`,
   `APP_URL`, database, `ADMIN_EMAIL` / `ADMIN_PASSWORD`), `php artisan key:generate`, `php artisan migrate --seed --force`.
2. Build the assets: `npm ci && npm run build` (or build locally and upload `public/build`).
3. Point the web server's document root at `public/`. `php artisan config:cache route:cache view:cache` for speed.

One PHP host serves everything: pages, API, CV file and built assets.
