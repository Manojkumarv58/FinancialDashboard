export function matchesQuery(t, query) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    t.description.toLowerCase().includes(q) ||
    t.category.toLowerCase().includes(q) ||
    t.type.toLowerCase().includes(q) ||
    t.date.toLowerCase().includes(q)
  )
}

export function sortTransactions(rows, sortKey, sortDir) {
  const dir = sortDir === 'asc' ? 1 : -1
  const sorted = [...rows].sort((a, b) => {
    if (sortKey === 'amount') return dir * (a.amount - b.amount)
    return dir * (new Date(a.date).getTime() - new Date(b.date).getTime())
  })
  return sorted
}
