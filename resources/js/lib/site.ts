/**
 * True only in the static GitHub Pages build (`npm run build:static`).
 * There is no Laravel API there: the page uses the built-in content, and the contact form becomes contact links.
 */
export const STATIC_SITE = import.meta.env.VITE_STATIC_SITE === 'true'
