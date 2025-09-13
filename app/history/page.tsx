import { HistoryView } from '@/components/HistoryView'

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">History</h1>
        <p className="text-sm opacity-70">Review your task log by date.</p>
      </div>
      <HistoryView />
    </div>
  )
}
