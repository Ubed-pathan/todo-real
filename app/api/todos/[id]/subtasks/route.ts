import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { getUserFromCookies } from '@/lib/auth'
import { Todo } from '@/models/Todo'
import { History } from '@/models/History'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromCookies()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await dbConnect()
  const body = await req.json()
  const todo = await Todo.findOne({ _id: params.id, userId: user.uid })
  if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  todo.subtasks.push({ title: body.title, completed: false } as any)
  await todo.save()
  await History.create({ userId: user.uid, todoId: todo._id, type: 'edited' })
  return NextResponse.json({ todo })
}
