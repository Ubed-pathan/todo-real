import type { Metadata } from 'next'
import './globals.css'
import { AppShell } from '@/components/AppShell'
import { initApp } from '@/lib/init'

let initOnce: Promise<void> | null = null
async function ensureInited() {
  if (!initOnce) initOnce = initApp()
  await initOnce
}

export const metadata: Metadata = {
  title: 'Todo Real',
  description: 'Modern Todo/Notes app with Next.js 15',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Ensure initialization (default user seed) completes before first render
  await ensureInited()
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
