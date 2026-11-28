/*
 | Static build for GitHub Pages: `npm run build:static` → dist-static/
 | The public one-page site only (no admin, no API), built from resources/js/content/portfolio.json.
 | The normal Laravel build (`npm run build`, vite.config.ts) is not affected.
 */
import { copyFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import content from './resources/js/content/portfolio.json' with { type: 'json' }

const SITE_URL = 'https://xsamratx.github.io/'
const outDir = resolve(import.meta.dirname, 'dist-static')

/** Extra files GitHub Pages needs next to index.html. */
function pagesFiles(): Plugin {
  return {
    name: 'github-pages-files',
    apply: 'build',
    closeBundle() {
      // GitHub Pages serves 404.html for unknown paths; it boots the same app, which shows the React 404 page.
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
      copyFileSync(resolve(import.meta.dirname, 'public/favicon.svg'), resolve(outDir, 'favicon.svg'))
      writeFileSync(resolve(outDir, '.nojekyll'), '')
      writeFileSync(resolve(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`)
      writeFileSync(
        resolve(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE_URL}</loc></url>\n</urlset>\n`,
      )
    },
  }
}

// Values for index.html (%VITE_...% placeholders) and for the app (import.meta.env.VITE_STATIC_SITE).
const html = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const description = `${content.profile.bio.split(/(?<=\.)\s/)[0]} Based in ${content.profile.location}.`

Object.assign(process.env, {
  VITE_STATIC_SITE: 'true',
  VITE_SITE_NAME: html(content.profile.name),
  VITE_SITE_TITLE: html(content.profile.title),
  VITE_SITE_DESCRIPTION: html(description),
  VITE_SITE_URL: SITE_URL,
})

export default defineConfig({
  root: resolve(import.meta.dirname, 'resources/static'),
  publicDir: resolve(import.meta.dirname, 'resources/static/public'),
  base: '/',
  plugins: [react(), tailwindcss(), pagesFiles()],
  build: {
    outDir,
    emptyOutDir: true,
  },
})
