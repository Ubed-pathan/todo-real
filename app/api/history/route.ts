import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { getUserFromCookies } from '@/lib/auth'
import { ensureDefaultUser } from '@/lib/seed'
import { History } from '@/models/History'
import { Todo } from '@/models/Todo'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  await ensureDefaultUser()
  const user = await getUserFromCookies()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await dbConnect()
  const url = new URL(req.url)
  const from = url.searchParams.get('from')
  const to = url.searchParams.get('to')
  const q: any = { userId: user.uid }
  if (from || to) {
    q.timestamp = {}
    if (from) {
      const d = new Date(from)
      // Normalize to start of day (UTC) to avoid timezone truncation
      d.setUTCHours(0, 0, 0, 0)
      q.timestamp.$gte = d
    }
    if (to) {
      const d = new Date(to)
      // Normalize to end of day (UTC)
      d.setUTCHours(23, 59, 59, 999)
      q.timestamp.$lte = d
    }
  }
  const items = await History.find(q).sort({ timestamp: -1 })
  const ids = Array.from(new Set(items.map(i => i.todoId.toString())))
  const todos = await Todo.find({ _id: { $in: ids }, userId: user.uid })
  const titleMap = new Map(todos.map(t => [t.id, t.title]))
  return NextResponse.json({
    items: items.map(i => ({
      id: i.id,
      todoId: i.todoId.toString(),
      type: i.type,
      timestamp: i.timestamp,
      title: titleMap.get(i.todoId.toString()) || 'Todo',
    }))
  })
}
