// Edge runtime instrumentation should avoid DB/mongoose. No-op here.
export const runtime = 'edge'

export async function register() {
  // Intentionally empty to keep Edge / middleware happy
}
