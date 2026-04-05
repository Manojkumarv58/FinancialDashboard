import { formatMoney } from '../../lib/money'

const accents = {
  balance:
    'bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-800 shadow-lg shadow-violet-500/35 ring-1 ring-white/25',
  income:
    'bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 shadow-lg shadow-emerald-500/35 ring-1 ring-white/25',
  expenses:
    'bg-gradient-to-br from-rose-500 via-orange-500 to-amber-600 shadow-lg shadow-rose-500/35 ring-1 ring-white/25',
}

export function SummaryCard({ title, value, icon, currency, accent = 'balance' }) {
  return (
    <div className={`rounded-2xl p-4 text-white sm:p-5 ${accents[accent] ?? accents.balance}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-medium text-white/85">{title}</div>
          <div className="mt-2 break-words text-xl font-bold tracking-tight tabular-nums sm:text-2xl">
            {formatMoney(value, currency)}
          </div>
        </div>
        {icon ? <div className="shrink-0 rounded-xl bg-white/15 p-2 text-white/95 backdrop-blur-sm">{icon}</div> : null}
      </div>
    </div>
  )
}
