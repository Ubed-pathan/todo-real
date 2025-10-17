"use client"
import { Pie, PieChart, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts'
import { useTodoStore } from '@/store/todoStore'
import { motion } from 'framer-motion'
import { ClientOnly } from './ClientOnly'

const COLORS = ['#22c55e', '#ef4444']

export function ProgressDashboard() {
  const completedVsPending = useTodoStore(s => s.completedVsPending)
  const progressForThisWeek = useTodoStore(s => s.progressForThisWeek)
  const monthlySummary = useTodoStore(s => s.monthlySummary)
  const overallProgress = useTodoStore(s => s.overallProgress)
  const cvp = completedVsPending()
  const week = progressForThisWeek()
  const month = monthlySummary()
  const overall = overallProgress()

  const pieData = [
    { name: 'Completed', value: cvp.completed },
    { name: 'Pending', value: cvp.pending },
  ]
  const lineData = week.labels.map((label, i) => ({ name: label, percent: week.values[i], completed: week.completedCounts[i], total: week.totalCounts[i] }))
  const monthData = [
    { name: 'Completed (mo)', value: month.completedThisMonth },
    { name: 'Created (mo)', value: month.createdThisMonth },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass p-4">
        <h3 className="font-semibold mb-2">All-time Snapshot</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPI label="Total" value={overall.total} />
          <KPI label="Done" value={overall.completed} />
          <KPI label="Percent" value={`${overall.percent}%`} />
          <KPI label="Created (mo)" value={month.createdThisMonth} />
        </div>
      </motion.div>
      <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass p-4">
        <h3 className="font-semibold mb-2">Completed vs Pending</h3>
        <ClientOnly fallback={<div className="h-64" />}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={4}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ClientOnly>
      </motion.div>
      <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass p-4">
        <h3 className="font-semibold mb-2">Weekly Progress</h3>
        <ClientOnly fallback={<div className="h-64" />}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Line type="monotone" dataKey="percent" stroke="#6366f1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ClientOnly>
        <ClientOnly fallback={<div className="h-64 mt-4" />}>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lineData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#22c55e" />
                <Bar dataKey="total" fill="#a78bfa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ClientOnly>
      </motion.div>
      <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass p-4">
        <h3 className="font-semibold mb-2">Monthly Totals</h3>
        <ClientOnly fallback={<div className="h-64" />}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ClientOnly>
      </motion.div>
    </div>
  )
}

function KPI({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-3">
      <div className="text-xs opacity-70">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  )
}
