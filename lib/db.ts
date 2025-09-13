import mongoose from 'mongoose'

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/todo-real'

let cached = (global as any)._mongooseConn as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
if (!cached) {
  cached = (global as any)._mongooseConn = { conn: null, promise: null }
}

export async function dbConnect() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URL)
  }
  cached.conn = await cached.promise
  return cached.conn
}
