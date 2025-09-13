import Link from 'next/link'

export function Sidebar() {
  return (
  <nav className="flex flex-col gap-2 text-sm text-neutral-700 dark:text-neutral-200">
      <div className="mb-2 text-xs uppercase tracking-wider opacity-60">Navigation</div>
      <Link className="px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5" href="/">Todos</Link>
      <Link className="px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5" href="/history">History</Link>
      <Link className="px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5" href="/dashboard">Dashboard</Link>
    </nav>
  )
}
