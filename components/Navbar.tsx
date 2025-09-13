"use client"
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const pathname = usePathname()
  if (pathname?.startsWith('/signin')) return null
  const [dark, setDark] = useState(false)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const sheetRef = useRef<HTMLDivElement | null>(null)

  // initialize from localStorage or system preference
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial = stored ? stored === 'dark' : prefersDark
    setDark(initial)
    setMounted(true)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  // lock body scroll when menu is open
  useEffect(() => {
    const body = document.body
    if (open) {
      const prev = body.style.overflow
      body.style.overflow = 'hidden'
      return () => { body.style.overflow = prev }
    }
  }, [open])

  // close on Escape and trap focus within the sheet when open
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key === 'Tab' && sheetRef.current) {
        const focusables = sheetRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const active = document.activeElement as HTMLElement | null
        if (e.shiftKey) {
          if (active === first || !active) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (active === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }
    window.addEventListener('keydown', onKey)
    // focus first focusable
    requestAnimationFrame(() => {
      const el = sheetRef.current?.querySelector<HTMLElement>('a, button')
      el?.focus()
    })
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500" />
          <span className="font-semibold">Todo Real</span>
        </div>
        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-4 text-sm text-neutral-700 dark:text-neutral-200">
          <Link href="/">Todos</Link>
          <Link href="/history">History</Link>
          <Link href="/dashboard">Dashboard</Link>
          <button
            className="px-3 py-1 rounded-lg border 
            bg-white text-neutral-900 border-black/10 
            dark:bg-white/10 dark:text-white dark:border-white/10"
            onClick={() => setDark(v => !v)}
            aria-label="Toggle dark mode"
          >
            {dark ? 'Light' : 'Dark'}
          </button>
        </div>
        {/* Mobile actions */}
        <div className="sm:hidden flex items-center gap-2">
          <IconButton ariaLabel="Toggle dark mode" onClick={() => setDark(v => !v)}>
            {dark ? <SunIcon /> : <MoonIcon />}
          </IconButton>
          <button
            className="px-3 py-1 rounded-lg border 
            bg-white text-neutral-900 border-black/10 
            dark:bg-white/10 dark:text-white dark:border-white/10"
            aria-label="Open menu"
            onClick={() => setOpen(o => !o)}
          >
            ☰
          </button>
        </div>
      </div>
      {/* Mobile menu overlay (fixed sheet via portal to body for reliable backdrop blur) */}
      {mounted && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="sm:hidden fixed inset-0 z-[1000]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-2xl" onClick={() => setOpen(false)} />
              <motion.div
                ref={sheetRef}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                className="absolute right-0 top-0 h-full w-full sm:w-[80vw] sm:max-w-xs glass p-3 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-2xl outline-none"
                initial={{ x: 64, opacity: 1 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 64, opacity: 1 }}
                drag="x"
                dragElastic={0.06}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 80) setOpen(false)
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500" />
                    <span className="font-medium">Menu</span>
                  </div>
                  <IconButton ariaLabel="Close menu" onClick={() => setOpen(false)}>
                    <CloseIcon />
                  </IconButton>
                </div>
                <nav className="flex flex-col text-sm space-y-2">
                  <Link className="flex items-center gap-3 px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 active:scale-[0.99]" href="/" onClick={() => setOpen(false)}>
                    <HomeIcon /> <span>Todos</span>
                  </Link>
                  <Link className="flex items-center gap-3 px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 active:scale-[0.99]" href="/history" onClick={() => setOpen(false)}>
                    <HistoryIcon /> <span>History</span>
                  </Link>
                  <Link className="flex items-center gap-3 px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 active:scale-[0.99]" href="/dashboard" onClick={() => setOpen(false)}>
                    <DashboardIcon /> <span>Dashboard</span>
                  </Link>
                </nav>
                {/* removed shortcuts/theme toggle per request */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}

function IconButton({ children, ariaLabel, onClick }: { children: React.ReactNode; ariaLabel: string; onClick: () => void }) {
  return (
    <button
      className="inline-flex items-center justify-center size-9 rounded-lg border 
      bg-white text-neutral-900 border-black/10 
      dark:bg-white/10 dark:text-white dark:border-white/10"
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4V2M12 22v-2M4.93 4.93L3.52 3.52M20.48 20.48l-1.41-1.41M4 12H2M22 12h-2M4.93 19.07l-1.41 1.41M20.48 3.52l-1.41 1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 10.5l9-7 9 7V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12a9 9 0 109-9v2a7 7 0 11-7 7H3zm9-5v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h5v8H3v-8zm7 5h11v3H10v-3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
