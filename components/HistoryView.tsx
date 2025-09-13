"use client"
import { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/axios'

export function HistoryView() {
  const [from, setFrom] = useState<string>(() => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))
  const [to, setTo] = useState<string>(() => new Date().toISOString().slice(0, 10))
  const [status, setStatus] = useState<'all' | 'completed' | 'pending'>('all')
  const [items, setItems] = useState<Array<{ id: string; todoId: string; title: string; type: string; timestamp: string }>>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        setError(null)
        const res = await api.get('/api/history', { params: { from, to } })
        setItems(res.data.items)
      } catch (e: any) {
        const msg = e?.response?.data?.error || e?.message || 'Failed to load history'
        setError(msg)
        setItems([])
      }
    }
    run()
  }, [from, to])

  const filtered = useMemo(() => {
    if (status === 'completed') return items.filter(i => i.type === 'completed')
    if (status === 'pending') return items.filter(i => i.type === 'reopened' || i.type === 'created')
    return items
  }, [items, status])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 text-sm">
  <label>From <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="ml-1 rounded px-2 py-1 border 
  bg-white text-neutral-900 border-black/10 
  dark:bg-white/5 dark:text-white dark:border-white/10" /></label>
  <label>To <input type="date" value={to} onChange={e => setTo(e.target.value)} className="ml-1 rounded px-2 py-1 border 
  bg-white text-neutral-900 border-black/10 
  dark:bg-white/5 dark:text-white dark:border-white/10" /></label>
        <label className="ml-0 sm:ml-auto">Status
          <select value={status} onChange={e => setStatus(e.target.value as any)} className="ml-1 rounded px-2 py-1 border 
          bg-white text-neutral-900 border-black/10 
          dark:bg-white/5 dark:text-white dark:border-white/10">
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </label>
      </div>
      <div className="flex flex-col divide-y divide-white/10">
        {error && (
          <div className="text-sm text-red-500/80 pb-2">{error}</div>
        )}
        {filtered.length === 0 ? (
          <div className="text-sm opacity-70">No history in this range.</div>
        ) : (
          filtered.map(i => (
            <div key={i.id} className="py-2 text-sm flex flex-wrap items-center gap-x-2 gap-y-1 overflow-hidden">
              <span className="opacity-60 flex-1 min-w-0 truncate">{new Date(i.timestamp).toLocaleString()}</span>
              <span className="uppercase text-xs tracking-wider px-2 py-0.5 rounded bg-white/10 shrink-0 whitespace-nowrap">{i.type}</span>
              <span className="opacity-80 min-w-0 truncate">{i.title}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
