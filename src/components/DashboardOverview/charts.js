import { eachMonthOfInterval, format, startOfMonth } from 'date-fns'

export function buildMonthlySeries(transactions) {
  if (transactions.length === 0) return []

  const dates = transactions.map((t) => new Date(t.date))
  const min = startOfMonth(new Date(Math.min(...dates.map((d) => d.getTime()))))
  const max = startOfMonth(new Date(Math.max(...dates.map((d) => d.getTime()))))

  const months = eachMonthOfInterval({ start: min, end: max })
  const byMonth = new Map()

  for (const m of months) {
    byMonth.set(format(m, 'yyyy-MM'), { income: 0, expense: 0 })
  }

  for (const t of transactions) {
    const k = format(startOfMonth(new Date(t.date)), 'yyyy-MM')
    const bucket = byMonth.get(k)
    if (!bucket) continue
    if (t.type === 'income') bucket.income += t.amount
    else bucket.expense += t.amount
  }

  let running = 0
  return months.map((m) => {
    const k = format(m, 'yyyy-MM')
    const b = byMonth.get(k) ?? { income: 0, expense: 0 }
    running += b.income - b.expense
    return {
      month: format(m, 'MMM yyyy'),
      income: b.income,
      expense: b.expense,
      balance: running,
    }
  })
}

export function buildSpendingByCategory(transactions) {
  const m = new Map()
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    m.set(t.category, (m.get(t.category) ?? 0) + t.amount)
  }
  const rows = [...m.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
  return rows
}
