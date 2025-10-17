"use client"
import { type SubTask } from '@/lib/types'

export function SubTaskItem({ sub, onToggle, onDelete }: { sub: SubTask; onToggle: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={sub.completed}
        onChange={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        className="accent-indigo-600"
      />
      <span className={sub.completed ? 'line-through opacity-60' : ''}>{sub.title}</span>
      <button
        type="button"
        className="ml-auto text-xs opacity-60 hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        aria-label="Delete subtask"
      >
        Delete
      </button>
    </div>
  )
}
