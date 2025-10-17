import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { getUserFromCookies } from '@/lib/auth'
import { Todo } from '@/models/Todo'
import { History } from '@/models/History'
import mongoose from 'mongoose'

export const runtime = 'nodejs'

export async function POST(_: Request, ctx: any) {
  const params = await ctx?.params
  try {
    const user = await getUserFromCookies()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id, subId } = params || {}
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(subId)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }
    await dbConnect()
    const todo = await Todo.findOne({ _id: id, userId: user.uid })
    if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const s = (todo.subtasks as any).id(subId) as any
    if (!s) return NextResponse.json({ error: 'Subtask not found' }, { status: 404 })
    s.completed = !s.completed
    await todo.save()
    await History.create({ userId: user.uid, todoId: todo._id, type: 'edited' })
    return NextResponse.json({ todo })
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to toggle subtask' }, { status: 500 })
  }
}

export async function DELETE(_: Request, ctx: any) {
  const params = await ctx?.params
  try {
    const user = await getUserFromCookies()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id, subId } = params || {}
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(subId)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }
    await dbConnect()
    const todo = await Todo.findOne({ _id: id, userId: user.uid })
    if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const beforeLen = todo.subtasks.length
    // Avoid deprecated remove(); filter out subtask and save
    todo.subtasks = (todo.subtasks as any).filter((s: any) => s._id?.toString() !== subId)
    if (todo.subtasks.length === beforeLen) {
      return NextResponse.json({ error: 'Subtask not found' }, { status: 404 })
    }
    await todo.save()
    await History.create({ userId: user.uid, todoId: todo._id, type: 'edited' })
    return NextResponse.json({ todo })
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete subtask' }, { status: 500 })
  }
}
