import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Banknote, TrendingDown, TrendingUp } from 'lucide-react'
import { Card } from '../ui/Card'
import { SummaryCard } from './SummaryCard'
import { useSelector } from 'react-redux'
import { formatMoney } from '../../lib/money'
import { chartColorAt } from '../../lib/chartColors'
import { buildMonthlySeries, buildSpendingByCategory } from './charts'

export function DashboardOverview({ balance, income, expenses, theme }) {
  const currency = useSelector((state) => state.finance.currency)
  const transactions = useSelector((state) => state.finance.transactions)

  const monthly = useMemo(() => buildMonthlySeries(transactions), [transactions])
  const byCategory = useMemo(() => buildSpendingByCategory(transactions).slice(0, 6), [transactions])
  const isDark = theme === 'dark'

  const axisColor = isDark ? '#cbd5e1' : '#5b21b6'
  const gridColor = isDark ? '#334155' : '#ddd6fe'
  const tooltipStyle = {
    borderRadius: 12,
    borderColor: isDark ? '#475569' : '#c4b5fd',
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
    color: isDark ? '#e2e8f0' : '#18181b',
  }

  return (
    <section className="grid gap-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="bg-gradient-to-r from-violet-700 to-cyan-600 bg-clip-text text-xl font-bold text-transparent">
            Dashboard
          </h2>
          <p className="text-sm text-violet-900/60 dark:text-slate-300/70">
            A quick view of your balance, trends, and spending breakdown.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          accent="balance"
          title="Total Balance"
          value={balance}
          currency={currency}
          icon={<Banknote className="h-5 w-5" aria-hidden="true" />}
        />
        <SummaryCard
          accent="income"
          title="Income"
          value={income}
          currency={currency}
          icon={<TrendingUp className="h-5 w-5" aria-hidden="true" />}
        />
        <SummaryCard
          accent="expenses"
          title="Expenses"
          value={expenses}
          currency={currency}
          icon={<TrendingDown className="h-5 w-5" aria-hidden="true" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border-violet-200/80 bg-gradient-to-b from-violet-50/90 to-white dark:border-violet-900/70 dark:from-slate-900 dark:to-slate-950">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-violet-800 dark:text-violet-300">Balance trend</div>
              <div className="text-sm text-violet-700/70 dark:text-slate-300/70">Monthly running balance based on your transactions.</div>
            </div>
          </div>

          <div className="mt-4 h-64">
            {monthly.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-violet-600/80 dark:text-slate-300/75">No data yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <defs>
                    <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.08} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: axisColor }} />
                  <YAxis
                    tick={{ fontSize: 12, fill: axisColor }}
                    tickFormatter={(v) => formatMoney(Number(v), currency)}
                    width={90}
                  />
                  <Tooltip
                    formatter={(v) => formatMoney(Number(v), currency)}
                    contentStyle={tooltipStyle}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#6d28d9"
                    strokeWidth={2}
                    fill="url(#balanceFill)"
                    name="Balance"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="border-cyan-200/80 bg-gradient-to-b from-cyan-50/90 to-white dark:border-cyan-900/70 dark:from-slate-900 dark:to-slate-950">
          <div className="text-sm font-semibold text-cyan-900 dark:text-cyan-300">Spending breakdown</div>
          <div className="text-sm text-cyan-800/70 dark:text-slate-300/70">Top categories (expenses only).</div>

          <div className="mt-4 h-64">
            {byCategory.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-cyan-700/80 dark:text-slate-300/75">No expenses yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(v) => formatMoney(Number(v), currency)}
                    contentStyle={{
                      ...tooltipStyle,
                      borderColor: isDark ? '#155e75' : '#67e8f9',
                    }}
                  />
                  <Pie data={byCategory} dataKey="amount" nameKey="category" innerRadius={55} outerRadius={90} paddingAngle={2}>
                    {byCategory.map((entry, i) => (
                      <Cell key={entry.category} fill={chartColorAt(i)} stroke={isDark ? '#020617' : '#fff'} strokeWidth={2} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {byCategory.length > 0 ? (
            <div className="mt-2 grid gap-2 text-sm">
              {byCategory.map((c, i) => (
                <div key={c.category} className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: chartColorAt(i) }}
                      aria-hidden
                    />
                    <span className="truncate font-medium text-slate-700 dark:text-slate-200">{c.category}</span>
                  </div>
                  <div className="tabular-nums font-semibold text-slate-900 dark:text-slate-100">{formatMoney(c.amount, currency)}</div>
                </div>
              ))}
            </div>
          ) : null}
        </Card>

        <Card className="border-fuchsia-200/80 bg-gradient-to-br from-fuchsia-50 via-violet-50 to-amber-50 dark:border-fuchsia-900/70 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
          <div className="text-sm font-semibold text-fuchsia-900 dark:text-fuchsia-300">Quick notes</div>
          <div className="mt-2 grid gap-2 text-sm text-zinc-700 dark:text-slate-200">
            <div className="rounded-lg bg-white/60 px-2 py-1.5 dark:bg-slate-800/80">
              <span className="text-fuchsia-600">•</span> Your balance is derived from all income minus expenses.
            </div>
            <div className="rounded-lg bg-white/60 px-2 py-1.5 dark:bg-slate-800/80">
              <span className="text-cyan-600">•</span> Charts update instantly when transactions change.
            </div>
            <div className="rounded-lg bg-white/60 px-2 py-1.5 dark:bg-slate-800/80">
              <span className="text-amber-600">•</span> Switch to Admin to add or edit transactions.
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
