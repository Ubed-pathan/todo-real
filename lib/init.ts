import { ensureDefaultUser } from '@/lib/seed'

// Called once in the app root to ensure default user exists when env vars are set.
export async function initApp() {
  await ensureDefaultUser()
}
