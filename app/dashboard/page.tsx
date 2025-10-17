import { ProgressDashboard } from '@/components/ProgressDashboard'
import { ProgressSummary } from '@/components/ProgressSummary'

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm opacity-70">See all-time, monthly, and weekly progress at a glance.</p>
      </div>
      <ProgressSummary />
      <ProgressDashboard />
    </div>
  )
}
