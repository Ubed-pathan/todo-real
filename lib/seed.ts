import { dbConnect } from './db'
import { User } from '@/models/User'

export async function ensureDefaultUser() {
  await dbConnect()
  const username = process.env.DEFAULT_USERNAME?.trim()
  const pwd = process.env.DEFAULT_PASSWORD
  if (!username || !pwd) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[seed] DEFAULT_USERNAME or DEFAULT_PASSWORD not set; skipping default user creation')
    }
    return
  }
  await User.init()
  await User.updateOne(
    { username },
    { $set: { username, password: pwd }, $unset: { passwordHash: 1 } },
    { upsert: true }
  )
}
