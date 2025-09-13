"use client"
import { useMemo } from 'react'
import { useTodoStore } from '@/store/todoStore'
import { useHydrated } from '@/lib/hooks'

export function ProgressSummary() {
  const hydrated = useHydrated()
  const progressForDate = useTodoStore(s => s.progressForDate)
  const week = useTodoStore(s => s.progressForThisWeek())
  const today = useMemo(() => (hydrated ? progressForDate(new Date()) : { completed: 0, total: 0, percent: 0 }), [hydrated, progressForDate])
  const weekAvg = hydrated ? Math.round(week.values.reduce((a, b) => a + b, 0) / (week.values.length || 1)) : 0

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Today" value={`—`} sub={`—`} />
        <Stat label="Week Avg" value={`—`} sub={`—`} />
        <Stat label="Completed" value={`—`} sub={`—`} />
        <Stat label="Total" value={`—`} sub={`—`} />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Stat label="Today" value={`${today.percent}%`} sub={`${today.completed}/${today.total} done`} />
      <Stat label="Week Avg" value={`${weekAvg}%`} sub={`7-day average`} />
      <Stat label="Completed" value={`${week.completedCounts.reduce((a,b)=>a+b,0)}`} sub={`this week`} />
      <Stat label="Total" value={`${week.totalCounts.reduce((a,b)=>a+b,0)}`} sub={`this week`} />
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="glass p-3">
      <div className="text-xs opacity-70">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-xs opacity-60">{sub}</div>
    </div>
  )
}
