export type SubTask = {
  id: string
  title: string
  completed: boolean
}

export type Todo = {
  id: string
  title: string
  note?: string
  createdAt: string // ISO
  completedAt?: string | null
  subtasks: SubTask[]
}

export type HistoryItem = {
  id: string
  todoId: string
  timestamp: string
  type: 'created' | 'completed' | 'reopened' | 'edited' | 'deleted'
}
