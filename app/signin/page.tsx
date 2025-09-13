"use client"
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await axios.post('/api/auth/signin', { username, password }, { withCredentials: true })
      router.replace('/')
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="glass p-6 w-full max-w-sm space-y-4">
        <div>
          <h1 className="text-xl font-semibold">Sign in</h1>
        </div>
        {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
        <div className="space-y-2">
          <label className="block text-sm">Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="w-full rounded-lg px-3 py-2 border bg-white text-neutral-900 border-black/10 dark:bg-white/5 dark:text-white dark:border-white/10" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-lg px-3 py-2 border bg-white text-neutral-900 border-black/10 dark:bg-white/5 dark:text-white dark:border-white/10" />
        </div>
        <button disabled={loading} className="w-full py-2 rounded-lg border bg-white text-neutral-900 border-black/10 dark:bg-white/10 dark:text-white dark:border-white/10">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
