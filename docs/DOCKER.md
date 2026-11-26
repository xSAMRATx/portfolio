# Docker guide (beginner friendly)

Docker is **optional**, for learning. Your normal daily workflow stays `php artisan serve` + `npm run dev` from the [README](../README.md), and nothing here changes it.
With Docker you don't need PHP, Composer, MySQL or Node on your computer. Docker runs them for you.

---

## 1. The 4 ideas you need

| Word | Simple meaning |
|---|---|
| **Image** | A ready-made "box template", e.g. `mysql:9.7` = Linux + MySQL 9.7 installed. Downloaded once. |
| **Container** | A running copy of an image. Like an app started from an installer. |
| **Dockerfile** | A recipe to build *your own* image (we only need one, for PHP). |
| **Compose** | One file (`compose.yaml`) that starts several containers together and connects them. |

Two more:

- **Bind mount**: a folder on your computer shown inside a container. We mount `backend/` and `frontend/`, so you edit code normally in VS Code and the containers see the changes instantly.
- **Volume**: storage that Docker manages. MySQL's data lives in the volume `db-data`, so your database survives restarts.

## 2. What's in this repo

```
compose.yaml              ← starts everything (read the comments!)
docker/
  php/Dockerfile          ← recipe for the PHP-FPM image (Laravel runs here)
  php/php.ini             ← PHP settings (upload limit for the CV)
  nginx/default.conf      ← web server config (standard Laravel config)
```

The 4 services (containers):

```
browser ──► web       nginx        http://localhost:8000   (Laravel API)
              │
              ▼
            app       PHP 8.5 FPM  runs Laravel code
              │
              ▼
            db        MySQL 9.7    localhost:3307 from your computer

browser ──► frontend  Node 26      http://localhost:5173   (React site, Vite dev server)
```

Containers talk to each other by **service name**. That's why Laravel uses `DB_HOST=db`, not `127.0.0.1`.
Inside a container, `127.0.0.1` means *that container itself*.

All images are official and free: `php`, `composer`, `nginx`, `mysql`, `node`.

## 3. Install Docker (once, free)

Ubuntu/Linux: install **Docker Engine** + the **Compose plugin** from the official docs
(<https://docs.docker.com/engine/install/>). Then let your user run Docker without `sudo`:

```bash
sudo usermod -aG docker $USER   # then log out and back in
docker --version
docker compose version          # note: "docker compose" with a space (Compose v2)
```

## 4. First run

From the repo root (where `compose.yaml` is):

```bash
# 0) Your user id. If both print 1000 you can skip this step.
id -u && id -g
#    Not 1000? Create a file named .env in the repo root (next to compose.yaml):
#    HOST_UID=1001
#    HOST_GID=1001

# 1) Laravel settings
cp backend/.env.example backend/.env
#    Open backend/.env and:
#    - replace DB_CONNECTION=sqlite with the 6 Docker DB lines (they're in the file, commented)
#    - set ADMIN_EMAIL and a strong ADMIN_PASSWORD

# 2) Build the PHP image and start all 4 containers in the background (-d)
docker compose up -d --build

# 3) Install PHP packages and prepare Laravel (runs INSIDE the app container)
docker compose exec app composer install
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate --seed
```

Open:
- Website: <http://localhost:5173>
- API: <http://localhost:8000/api/profile>
- Admin: <http://localhost:5173/admin>

The first `up` downloads the images, so it takes a few minutes. Next time it takes seconds.

## 5. Daily commands

```bash
docker compose up -d                 # start
docker compose ps                    # what's running? (STATUS should be "Up")
docker compose logs -f app           # follow logs of one service (Ctrl+C to stop following)
docker compose logs -f frontend
docker compose stop                  # stop (keeps everything)
docker compose down                  # stop and remove containers (database is KEPT)

# Run any artisan / composer command inside the app container:
docker compose exec app php artisan migrate
docker compose exec app php artisan tinker
docker compose exec app composer require some/package
docker compose exec app sh           # open a shell inside the container (type exit to leave)

# Laravel log:
tail -f backend/storage/logs/laravel.log
```

`exec` = run a command in a container that is **already running**.

## 6. Cleaning up

```bash
docker compose down -v               # ⚠ also deletes the database volume (all DB data!)
docker compose build --no-cache app  # rebuild the PHP image from scratch
docker image prune                   # remove unused images (frees disk space)
```

You changed `docker/php/Dockerfile` or `php.ini`? Run `docker compose up -d --build`.

## 7. Connect to MySQL from a GUI (TablePlus, DBeaver…)

Host `127.0.0.1`, port **3307**, user `portfolio`, password `secret`, database `portfolio`.
These are local-only development passwords. Never use them on a real server.

## 8. Common errors and fixes

| Error | Why | Fix |
|---|---|---|
| `Bind for 0.0.0.0:8000 failed: port is already allocated` | Something else uses that port (e.g. `php artisan serve`) | Stop the other program, or change the left number in `compose.yaml` (`"8001:80"`) |
| `permission denied while trying to connect to the Docker daemon` | Your user isn't in the `docker` group | `sudo usermod -aG docker $USER`, then log out and in |
| `SQLSTATE[HY000] [2002] Connection refused` | `DB_HOST=127.0.0.1` in `backend/.env` | Set `DB_HOST=db` |
| `SQLSTATE[HY000] [1045] Access denied` | DB values in `.env` don't match `compose.yaml` | Use the 6 Docker lines from `.env.example`. If you changed passwords after the first run, run `docker compose down -v` (deletes DB data) and start again |
| `Permission denied` on `storage/logs/laravel.log` | Files were created by another user/root | `sudo chown -R $USER:$USER backend/storage backend/bootstrap/cache`, check step 0 (HOST_UID) |
| `vendor/autoload.php: No such file` | Composer packages not installed | `docker compose exec app composer install` |
| 502 Bad Gateway on :8000 | The `app` container stopped | `docker compose ps` and `docker compose logs app` |
| A container shows `Exited` | It crashed on start | `docker compose logs <service>`. The last lines tell you why |
| Website loads but shows the small "fallback content" notice | Backend not ready or `.env` problem | Open <http://localhost:8000/api/profile> to see the real error |
| CORS error in the browser console | `FRONTEND_URL` in `backend/.env` isn't `http://localhost:5173` | Fix it, then `docker compose exec app php artisan config:clear` |
| Vite doesn't reload after you save a file (Windows/Mac) | File-change events don't cross into the container | Restart: `docker compose restart frontend` |

## 9. Good to know

- `frontend/node_modules` and `backend/vendor` are created inside your project folders, same as without Docker (and git-ignored).
- SQLite still works without Docker. Docker uses MySQL, closer to a real server.
- This setup is for **development**. A production image (no bind mounts, `composer install --no-dev`, built frontend) is a later step.
