import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { getUserFromCookies } from '@/lib/auth'
import { Todo } from '@/models/Todo'
import { History } from '@/models/History'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromCookies()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await dbConnect()
  const body = await req.json()
  const todo = await Todo.findOneAndUpdate({ _id: params.id, userId: user.uid }, { $set: { title: body.title, note: body.note } }, { new: true })
  if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await History.create({ userId: user.uid, todoId: todo._id, type: 'edited' })
  return NextResponse.json({ todo })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromCookies()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await dbConnect()
  const todo = await Todo.findOneAndDelete({ _id: params.id, userId: user.uid })
  if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await History.create({ userId: user.uid, todoId: todo._id, type: 'deleted' })
  return NextResponse.json({ ok: true })
}
