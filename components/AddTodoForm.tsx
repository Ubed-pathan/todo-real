"use client"
import { useState } from 'react'
import { useTodoStore } from '@/store/todoStore'

export function AddTodoForm() {
  const addTodo = useTodoStore(s => s.addTodo)
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    await addTodo(title.trim(), note.trim() || undefined)
    setTitle('')
    setNote('')
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <input
        className="w-full rounded-lg px-3 py-2 outline-none border 
        bg-white text-neutral-900 placeholder:text-neutral-500 border-black/10 
        dark:bg-white/5 dark:text-white dark:placeholder:text-white/50 dark:border-white/10"
        placeholder="Add a new todo..."
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <input
          className="flex-1 rounded-lg px-3 py-2 outline-none border 
          bg-white text-neutral-900 placeholder:text-neutral-500 border-black/10 
          dark:bg-white/5 dark:text-white dark:placeholder:text-white/50 dark:border-white/10"
          placeholder="Optional note"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        <button className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">Add</button>
      </div>
    </form>
  )
}
