// Temporarily testing components to isolate a runtime error
import { TodoList } from '@/components/TodoList'
import { ProgressSummary } from '@/components/ProgressSummary'
import { ClientOnly } from '@/components/ClientOnly'

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Todos</h1>
        <p className="text-sm opacity-70">Start managing your day.</p>
      </div>
      <ProgressSummary />
      <ClientOnly>
        <TodoList />
      </ClientOnly>
    </div>
  )
}
