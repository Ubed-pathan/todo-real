import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { getUserFromCookies } from '@/lib/auth'
import { Todo } from '@/models/Todo'
import { History } from '@/models/History'

export const runtime = 'nodejs'

export async function POST(_: Request, { params }: any) {
  const user = await getUserFromCookies()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await dbConnect()
  const todo = await Todo.findOne({ _id: params.id, userId: user.uid })
  if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const isDone = todo.subtasks.length > 0 ? todo.subtasks.every((s: any) => s.completed) : !!todo.completedAt
  if (todo.subtasks.length > 0) {
    todo.subtasks = todo.subtasks.map((s: any) => ({ ...s, completed: !isDone })) as any
    todo.completedAt = !isDone ? new Date() : null
  } else {
    todo.completedAt = isDone ? null : new Date()
  }
  await todo.save()
  await History.create({ userId: user.uid, todoId: todo._id, type: todo.completedAt ? 'completed' : 'reopened' })
  return NextResponse.json({ todo })
}
