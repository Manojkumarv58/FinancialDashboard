import { useMemo, useState } from 'react'

const categories = [
  'Salary',
  'Freelance',
  'Groceries',
  'Rent',
  'Transport',
  'Dining',
  'Utilities',
  'Shopping',
  'Health',
  'Entertainment',
  'Other',
]

export function TransactionForm({ onSubmit, initial, submitLabel }) {
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10))
  const [description, setDescription] = useState(initial?.description ?? '')
  const [category, setCategory] = useState(initial?.category ?? 'Groceries')
  const [type, setType] = useState(initial?.type ?? 'expense')
  const [amount, setAmount] = useState(initial?.amount ?? 0)

  const canSubmit = useMemo(() => {
    return Boolean(date) && description.trim().length > 0 && amount > 0
  }, [date, description, amount])

  return (
    <form
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (!canSubmit) return
        onSubmit({ date, description: description.trim(), category, type, amount })
      }}
    >
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-violet-900/70 dark:text-slate-300">Date</span>
        <input
          className="rounded-xl border border-violet-200 bg-white px-3 py-2 outline-none ring-violet-300 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-medium text-violet-900/70 dark:text-slate-300">Amount</span>
        <input
          className="rounded-xl border border-teal-200 bg-white px-3 py-2 outline-none ring-teal-300 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          value={Number.isFinite(amount) ? amount : 0}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </label>

      <label className="grid gap-1 text-sm sm:col-span-2">
        <span className="font-medium text-violet-900/70 dark:text-slate-300">Description</span>
        <input
          className="rounded-xl border border-indigo-200 bg-white px-3 py-2 outline-none ring-indigo-300 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Grocery store"
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-medium text-violet-900/70 dark:text-slate-300">Type</span>
        <select
          className="rounded-xl border border-fuchsia-200 bg-white px-3 py-2 outline-none ring-fuchsia-300 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-medium text-violet-900/70 dark:text-slate-300">Category</span>
        <select
          className="rounded-xl border border-amber-200 bg-white px-3 py-2 outline-none ring-amber-300 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-500/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
