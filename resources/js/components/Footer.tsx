export default function Footer({ name }: { name: string }) {
  return (
    <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
      © {new Date().getFullYear()} {name}. Built with React, TypeScript, Tailwind & Laravel.
    </footer>
  )
}
