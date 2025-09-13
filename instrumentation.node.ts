// Runs on the server at startup (Node.js runtime only)
export const runtime = 'nodejs'

export async function register() {
  try {
    const { ensureDefaultUser } = await import('./lib/seed')
    await ensureDefaultUser()
    if (process.env.NODE_ENV !== 'production') {
      console.log('[instrumentation] Default user ensured')
    }
  } catch (err) {
    console.error('[instrumentation] Failed to ensure default user', err)
  }
}
