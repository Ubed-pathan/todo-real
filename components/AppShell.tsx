"use client"
import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideChrome = pathname?.startsWith('/signin')

  return (
    <div className={`min-h-dvh grid gap-4 p-4 ${hideChrome ? 'grid-cols-1' : 'grid-cols-1 2xl:grid-cols-[280px_1fr]'}`}>
      {!hideChrome && (
        <aside className="glass hidden 2xl:block p-4">
          <Sidebar />
        </aside> 
      )}
      <main className="flex flex-col gap-4">
        {!hideChrome && (
          <div className="glass p-4 sticky top-4 z-40">
            <Navbar />
          </div>
        )}
        {hideChrome ? (
          // Render children directly so pages like /signin can control their own full-width/height layout
          <>{children}</>
        ) : (
          <div className="glass p-4">
            {children}
          </div>
        )}
      </main>
    </div>
  )
}
