import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { getUserFromCookies } from '@/lib/auth'
import { ensureDefaultUser } from '@/lib/seed'
import { Todo } from '@/models/Todo'
import { History } from '@/models/History'

export const runtime = 'nodejs'

export async function GET() {
  await ensureDefaultUser()
  const user = await getUserFromCookies()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await dbConnect()
  const todos = await Todo.find({ userId: user.uid }).sort({ createdAt: -1 })
  return NextResponse.json({ todos })
}

export async function POST(req: Request) {
  await ensureDefaultUser()
  const user = await getUserFromCookies()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await dbConnect()
  const body = await req.json()
  const todo = await Todo.create({ userId: user.uid, title: body.title, note: body.note, subtasks: [] })
  await History.create({ userId: user.uid, todoId: todo._id, type: 'created' })
  return NextResponse.json({ todo })
}
