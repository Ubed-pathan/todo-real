import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { getUserFromCookies } from '@/lib/auth'
import { Todo } from '@/models/Todo'
import { History } from '@/models/History'

export async function POST(_: Request, { params }: { params: { id: string; subId: string } }) {
  const user = await getUserFromCookies()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await dbConnect()
  const todo = await Todo.findOne({ _id: params.id, userId: user.uid })
  if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const s = todo.subtasks.id(params.subId) as any
  if (!s) return NextResponse.json({ error: 'Subtask not found' }, { status: 404 })
  s.completed = !s.completed
  await todo.save()
  await History.create({ userId: user.uid, todoId: todo._id, type: 'edited' })
  return NextResponse.json({ todo })
}

export async function DELETE(_: Request, { params }: { params: { id: string; subId: string } }) {
  const user = await getUserFromCookies()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await dbConnect()
  const todo = await Todo.findOne({ _id: params.id, userId: user.uid })
  if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const s = todo.subtasks.id(params.subId) as any
  if (!s) return NextResponse.json({ error: 'Subtask not found' }, { status: 404 })
  s.remove()
  await todo.save()
  await History.create({ userId: user.uid, todoId: todo._id, type: 'edited' })
  return NextResponse.json({ todo })
}
