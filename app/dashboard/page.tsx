import { ProgressDashboard } from '@/components/ProgressDashboard'

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm opacity-70">See your weekly progress at a glance.</p>
      </div>
      <ProgressDashboard />
    </div>
  )
}
