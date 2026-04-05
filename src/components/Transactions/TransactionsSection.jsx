
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowDownUp, Pencil, Plus } from 'lucide-react'
import { Card } from '../ui/Card'
import {
  addTransaction,
  setCategoryFilter,
  setQuery,
  setSort,
  setTypeFilter,
  updateTransaction,
} from '../../state/financeSlice'
import { formatDateISO } from '../../lib/dates'
import { formatMoney } from '../../lib/money'
import { TransactionForm } from './TransactionForm'
import { matchesQuery, sortTransactions } from './transactionSelectors'

export function TransactionsSection() {
  const dispatch = useDispatch()
  const role = useSelector((state) => state.finance.role)
  const currency = useSelector((state) => state.finance.currency)
  const transactions = useSelector((state) => state.finance.transactions)
  const query = useSelector((state) => state.finance.query)
  const typeFilter = useSelector((state) => state.finance.typeFilter)
  const categoryFilter = useSelector((state) => state.finance.categoryFilter)
  const sortKey = useSelector((state) => state.finance.sortKey)
  const sortDir = useSelector((state) => state.finance.sortDir)

  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount']
    const rows = filtered.map((t) => [
      t.date,
      t.description,
      t.category,
      t.type,
      t.amount,
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'transactions.csv'
    a.click()

    URL.revokeObjectURL(url)
  }

  const exportToJSON = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], {
      type: 'application/json',
    })

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'transactions.json'
    a.click()

    URL.revokeObjectURL(url)
  }

  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category))
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [transactions])

  const filtered = useMemo(() => {
    const rows = transactions
      .filter((t) => (typeFilter === 'all' ? true : t.type === typeFilter))
      .filter((t) => (categoryFilter === 'all' ? true : t.category === categoryFilter))
      .filter((t) => matchesQuery(t, query))
    return sortTransactions(rows, sortKey, sortDir)
  }, [transactions, query, typeFilter, categoryFilter, sortKey, sortDir])

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-xl font-bold text-transparent">
            Transactions
          </h2>
          <p className="text-sm text-violet-900/55 dark:text-slate-300/70">Search, filter, and sort your activity.</p>
        </div>

        {role === 'admin' ? (
          <button
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-violet-500/30 transition hover:brightness-110"
            onClick={() => setShowAdd((v) => !v)}
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        ) : null}
      </div>

      {role === 'admin' && showAdd ? (
        <Card className="border-violet-200/90 bg-gradient-to-r from-violet-50/95 to-fuchsia-50/80 dark:border-violet-900/70 dark:from-slate-900 dark:to-slate-950">
          <div className="text-sm font-semibold text-violet-900 dark:text-violet-300">Add transaction</div>
          <div className="mt-3">
            <TransactionForm
              submitLabel="Add transaction"
              onSubmit={(draft) => {
                dispatch(addTransaction(draft))
                setShowAdd(false)
              }}
            />
          </div>
        </Card>
      ) : null}

      {role === 'admin' && editing ? (
        <Card className="border-cyan-200/90 bg-gradient-to-r from-cyan-50/95 to-sky-50/80 dark:border-cyan-900/70 dark:from-slate-900 dark:to-slate-950">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-cyan-900 dark:text-cyan-300">Edit transaction</div>
            <button className="text-sm font-medium text-cyan-700 hover:text-cyan-950 dark:text-cyan-300 dark:hover:text-cyan-100" onClick={() => setEditing(null)}>
              Close
            </button>
          </div>
          <div className="mt-3">
            <TransactionForm
              submitLabel="Save changes"
              initial={{
                date: editing.date,
                description: editing.description,
                category: editing.category,
                type: editing.type,
                amount: editing.amount,
              }}
              onSubmit={(draft) => {
                dispatch(updateTransaction({ id: editing.id, ...draft }))
                setEditing(null)
              }}
            />
          </div>
        </Card>
      ) : null}

      <Card className="border-indigo-200/70 bg-white/90 dark:border-slate-800 dark:bg-slate-900/80">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
          <label className="grid gap-1 text-sm lg:col-span-2">
            <span className="font-medium text-indigo-900/70 dark:text-slate-300">Search</span>
            <input
              className="rounded-xl border border-indigo-200/80 bg-white px-3 py-2 shadow-inner shadow-indigo-100/50 outline-none ring-violet-300 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:shadow-slate-950/30 dark:placeholder:text-slate-500"
              value={query}
              onChange={(e) => dispatch(setQuery(e.target.value))}
              placeholder="Search description, category, type, date…"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-indigo-900/70 dark:text-slate-300">Type</span>
            <select
              className="rounded-xl border border-teal-200/80 bg-white px-3 py-2 outline-none ring-teal-300 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              value={typeFilter}
              onChange={(e) => dispatch(setTypeFilter(e.target.value))}
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-indigo-900/70 dark:text-slate-300">Category</span>
            <select
              className="rounded-xl border border-fuchsia-200/80 bg-white px-3 py-2 outline-none ring-fuchsia-300 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              value={categoryFilter}
              onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
            >
              <option value="all">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-indigo-900/65 dark:text-slate-300/75">
            Showing <span className="font-semibold text-violet-700 dark:text-violet-300">{filtered.length}</span> of{' '}
            <span className="font-semibold text-violet-700 dark:text-violet-300">{transactions.length}</span>
          </div>

          <div className="flex gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50/80 px-3 py-2 text-sm font-medium text-violet-900 hover:bg-violet-100 dark:border-violet-900/70 dark:bg-violet-950/50 dark:text-violet-200 dark:hover:bg-violet-950/70"
              onClick={() => dispatch(setSort('date'))}
            >
              <ArrowDownUp className="h-4 w-4" />
              Date {sortKey === 'date' ? `(${sortDir})` : ''}
            </button>

            <button
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50/80 px-3 py-2 text-sm font-medium text-cyan-900 hover:bg-cyan-100 dark:border-cyan-900/70 dark:bg-cyan-950/40 dark:text-cyan-200 dark:hover:bg-cyan-950/60"
              onClick={() => dispatch(setSort('amount'))}
            >
              <ArrowDownUp className="h-4 w-4" />
              Amount {sortKey === 'amount' ? `(${sortDir})` : ''}
            </button>

            <button
              className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50/80 px-3 py-2 text-sm font-medium text-violet-900 hover:bg-violet-100 dark:border-violet-900/70 dark:bg-violet-950/50 dark:text-violet-200 dark:hover:bg-violet-950/70"
              onClick={exportToCSV}
            >
              Export CSV
            </button>

            <button
              className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50/80 px-3 py-2 text-sm font-medium text-violet-900 hover:bg-violet-100 dark:border-violet-900/70 dark:bg-violet-950/50 dark:text-violet-200 dark:hover:bg-violet-950/70"
              onClick={exportToJSON}
            >
              Export JSON
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-violet-300 bg-violet-50/50 p-6 text-sm text-violet-800 dark:border-violet-900/70 dark:bg-violet-950/30 dark:text-violet-200">
              No transactions match your filters.
            </div>
          ) : (
            <table className="w-full min-w-[720px] border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-indigo-800/90 dark:text-slate-300/80">
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Description</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">Type</th>
                  <th className="px-3 py-3 text-right">Amount</th>
                  {role === 'admin' && <th className="px-3 py-3 text-right">Edit</th>}
                </tr>
              </thead>

              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="text-sm text-slate-700 dark:text-slate-200">
                    <td className="border-t border-slate-200/80 px-3 py-3 dark:border-slate-800">{formatDateISO(t.date)}</td>
                    <td className="border-t border-slate-200/80 px-3 py-3 dark:border-slate-800">{t.description}</td>
                    <td className="border-t border-slate-200/80 px-3 py-3 dark:border-slate-800">{t.category}</td>
                    <td className="border-t border-slate-200/80 px-3 py-3 capitalize dark:border-slate-800">{t.type}</td>
                    <td className="border-t border-slate-200/80 px-3 py-3 text-right font-medium dark:border-slate-800">
                      {formatMoney(t.amount, currency)}
                    </td>
                    {role === 'admin' && (
                      <td className="border-t border-slate-200/80 px-3 py-3 text-right dark:border-slate-800">
                        <button
                          className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-violet-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-violet-300"
                          onClick={() => setEditing(t)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </section>
  )
}
