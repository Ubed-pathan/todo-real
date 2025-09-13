"use client"
import { useEffect } from 'react'
import { useTodoStore } from '@/store/todoStore'
import { AddTodoForm } from './AddTodoForm'
import { TodoCard } from './TodoCard'
import { AnimatePresence, motion } from 'framer-motion'

export function TodoList() {
  const todos = useTodoStore(s => s.todos)
  const fetchTodos = useTodoStore(s => s.fetchTodos)
  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])
  return (
    <div className="flex flex-col gap-4">
      <AddTodoForm />
      <AnimatePresence>
        {todos.length === 0 ? (
          <div className="text-sm opacity-70">No todos yet. Create your first one above.</div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {todos.map(t => (
              <TodoCard key={t.id} todo={t} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
