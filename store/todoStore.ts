"use client"
import { create } from 'zustand'
import { addDays, isSameDay, startOfWeek } from 'date-fns'
import { api } from '@/lib/axios'
import { type Todo, type SubTask, type HistoryItem } from '@/lib/types'

type State = {
  todos: Todo[]
  history: HistoryItem[]
}

type Actions = {
  fetchTodos: () => Promise<void>
  addTodo: (title: string, note?: string) => Promise<void>
  editTodo: (id: string, payload: Partial<Pick<Todo, 'title' | 'note'>>) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
  toggleTodo: (id: string) => Promise<void>
  addSubTask: (todoId: string, title: string) => Promise<void>
  toggleSubTask: (todoId: string, subId: string) => Promise<void>
  deleteSubTask: (todoId: string, subId: string) => Promise<void>
  clearAll: () => void
}

export type TodoStore = State & Actions & {
  // derived selectors
  progressForDate: (date: Date) => { completed: number; total: number; percent: number }
  progressForThisWeek: () => { labels: string[]; values: number[]; completedCounts: number[]; totalCounts: number[] }
  completedVsPending: () => { completed: number; pending: number }
  filterHistoryByDate: (from: Date, to: Date) => HistoryItem[]
}

const uid = () => Math.random().toString(36).slice(2)

export const useTodoStore = create<TodoStore>()((set, get) => ({
  todos: [],
  history: [],

  fetchTodos: async () => {
    const res = await api.get('/api/todos')
    set({ todos: res.data.todos })
  },

  addTodo: async (title, note) => {
    const res = await api.post('/api/todos', { title, note })
    set(state => ({ todos: [res.data.todo, ...state.todos] }))
  },

  editTodo: async (id, payload) => {
    const res = await api.patch(`/api/todos/${id}`, payload)
    set(state => ({ todos: state.todos.map(t => (t.id === id ? res.data.todo : t)) }))
  },

  deleteTodo: async (id) => {
    await api.delete(`/api/todos/${id}`)
    set(state => ({ todos: state.todos.filter(t => t.id !== id) }))
  },

  toggleTodo: async (id) => {
    const res = await api.post(`/api/todos/${id}/toggle`)
    set(state => ({ todos: state.todos.map(t => (t.id === id ? res.data.todo : t)) }))
  },

  addSubTask: async (todoId, title) => {
    const res = await api.post(`/api/todos/${todoId}/subtasks`, { title })
    set(state => ({ todos: state.todos.map(t => (t.id === todoId ? res.data.todo : t)) }))
  },

  toggleSubTask: async (todoId, subId) => {
    const res = await api.post(`/api/todos/${todoId}/subtasks/${subId}`)
    set(state => ({ todos: state.todos.map(t => (t.id === todoId ? res.data.todo : t)) }))
  },

  deleteSubTask: async (todoId, subId) => {
    const res = await api.delete(`/api/todos/${todoId}/subtasks/${subId}`)
    set(state => ({ todos: state.todos.map(t => (t.id === todoId ? res.data.todo : t)) }))
  },

  clearAll: () => set({ todos: [], history: [] }),

      progressForDate: date => {
        const todos = get().todos.filter(t => isSameDay(new Date(t.createdAt), date))
        const total = todos.length
        const completed = todos.filter(t => t.completedAt).length
        const percent = total ? Math.round((completed / total) * 100) : 0
        return { completed, total, percent }
      },

      progressForThisWeek: () => {
        const start = startOfWeek(new Date(), { weekStartsOn: 1 })
        const labels: string[] = []
        const values: number[] = []
        const completedCounts: number[] = []
        const totalCounts: number[] = []
        for (let i = 0; i < 7; i++) {
          const day = addDays(start, i)
          labels.push(day.toLocaleDateString(undefined, { weekday: 'short' }))
          const p = get().progressForDate(day)
          values.push(p.percent)
          completedCounts.push(p.completed)
          totalCounts.push(p.total)
        }
        return { labels, values, completedCounts, totalCounts }
      },

      completedVsPending: () => {
        const total = get().todos.length
        const completed = get().todos.filter(t => t.completedAt).length
        return { completed, pending: total - completed }
      },

      filterHistoryByDate: (_from, _to) => {
        return []
      },
}))
