"use client"
import { useHydrated } from '@/lib/hooks'

export function ClientOnly({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const hydrated = useHydrated()
  if (!hydrated) return <>{fallback}</>
  return <>{children}</>
}
