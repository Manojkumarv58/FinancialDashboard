import { format, startOfMonth } from 'date-fns'

export function highestSpendingCategory(transactions) {
  const totals = new Map()
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount)
  }
  let best = null
  for (const [category, amount] of totals.entries()) {
    if (!best || amount > best.amount) best = { category, amount }
  }
  return best
}

export function monthOverMonth(transactions) {
  const byMonth = new Map()
  for (const t of transactions) {
    const k = format(startOfMonth(new Date(t.date)), 'yyyy-MM')
    const b = byMonth.get(k) ?? { income: 0, expense: 0 }
    if (t.type === 'income') b.income += t.amount
    else b.expense += t.amount
    byMonth.set(k, b)
  }

  const months = [...byMonth.keys()].sort()
  if (months.length < 2) return null
  const last = months[months.length - 1]
  const prev = months[months.length - 2]
  return { lastMonth: last, prevMonth: prev, last: byMonth.get(last), prev: byMonth.get(prev) }
}
