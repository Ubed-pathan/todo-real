"use client"
import { motion } from 'framer-motion'
import { type Todo } from '@/lib/types'
import { useTodoStore } from '@/store/todoStore'
import { useMemo, useState } from 'react'
import { SubTaskItem } from './SubTaskItem'

export function TodoCard({ todo }: { todo: Todo }) {
  const { editTodo, deleteTodo, toggleTodo, addSubTask, toggleSubTask, deleteSubTask } = useTodoStore(s => ({
    editTodo: s.editTodo,
    deleteTodo: s.deleteTodo,
    toggleTodo: s.toggleTodo,
    addSubTask: s.addSubTask,
    toggleSubTask: s.toggleSubTask,
    deleteSubTask: s.deleteSubTask,
  }))

  const [title, setTitle] = useState(todo.title)
  const [note, setNote] = useState(todo.note ?? '')
  const [subTitle, setSubTitle] = useState('')

  const progress = useMemo(() => {
    const total = todo.subtasks.length || 1
    const completed = todo.subtasks.length ? todo.subtasks.filter(s => s.completed).length : todo.completedAt ? 1 : 0
    const percent = Math.round((completed / total) * 100)
    return { completed, total, percent }
  }, [todo])

  const onBlurSave = () => {
    if (title !== todo.title || note !== (todo.note ?? '')) {
      void editTodo(todo.id, { title: title.trim() || todo.title, note: note.trim() || undefined })
    }
  }

  const addSub = () => {
    const t = subTitle.trim()
    if (!t) return
    void addSubTask(todo.id, t)
    setSubTitle('')
  }

  const created = new Date(todo.createdAt).toLocaleString()

  return (
  <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="glass p-4 sm:p-5 card-hover min-h-[180px]">
      <div className="flex items-start gap-3">
        <input
          aria-label="Toggle todo"
          type="checkbox"
          checked={progress.percent === 100}
          onChange={() => void toggleTodo(todo.id)}
          className="mt-1 accent-indigo-600"
        />
        <div className="flex-1 min-w-0">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={onBlurSave}
            className="w-full bg-transparent outline-none text-base font-medium text-neutral-900 dark:text-white"
          />
          <div className="text-xs opacity-60">Created {created}</div>
        </div>
  <button onClick={() => void deleteTodo(todo.id)} className="text-xs opacity-60 hover:opacity-100" aria-label="Delete todo">Delete</button>
      </div>

      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        onBlur={onBlurSave}
        rows={2}
        placeholder="Add a note..."
        className="mt-3 w-full resize-none rounded-lg px-3 py-2 outline-none border 
        bg-white text-neutral-900 placeholder:text-neutral-500 border-black/10 
        dark:bg-white/5 dark:text-white dark:placeholder:text-white/50 dark:border-white/10"
      />

      <div className="mt-3 space-y-2">
        {todo.subtasks.map(sub => (
          <SubTaskItem
            key={sub.id}
            sub={sub}
            onToggle={() => void toggleSubTask(todo.id, sub.id)}
            onDelete={() => void deleteSubTask(todo.id, sub.id)}
          />
        ))}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full">
          <input
            className="flex-1 min-w-0 rounded-lg px-3 py-2 outline-none border 
            bg-white text-neutral-900 placeholder:text-neutral-500 border-black/10 
            dark:bg-white/5 dark:text-white dark:placeholder:text-white/50 dark:border-white/10"
            placeholder="Add subtask"
            value={subTitle}
            onChange={e => setSubTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addSub()
              }
            }}
          />
          <button className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 shrink-0 w-full sm:w-auto" onClick={addSub}>Add</button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs opacity-70 mb-1">
          <span>Progress</span>
          <span>{progress.percent}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-pink-500" style={{ width: `${progress.percent}%` }} />
        </div>
      </div>
    </motion.div>
  )
}
