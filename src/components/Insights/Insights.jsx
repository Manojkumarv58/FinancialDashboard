import { useMemo } from 'react'
import { ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react'
import { Card } from '../ui/Card'
import { useSelector } from 'react-redux'
import { formatMoney } from '../../lib/money'
import { highestSpendingCategory, monthOverMonth } from './insightSelectors'

export function Insights() {
  const currency = useSelector((state) => state.finance.currency)
  const transactions = useSelector((state) => state.finance.transactions)

  const top = useMemo(() => highestSpendingCategory(transactions), [transactions])
  const mom = useMemo(() => monthOverMonth(transactions), [transactions])

  const expenseDelta = useMemo(() => {
    if (!mom) return null
    const diff = mom.last.expense - mom.prev.expense
    const pct = mom.prev.expense === 0 ? null : (diff / mom.prev.expense) * 100
    return { diff, pct }
  }, [mom])

  return (
    <section className="grid gap-4">
      <div>
        <h2 className="bg-gradient-to-r from-fuchsia-600 to-amber-500 bg-clip-text text-xl font-bold text-transparent">
          Insights
        </h2>
        <p className="text-sm text-violet-900/55 dark:text-slate-300/70">A few observations based on your current data.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border-rose-200/80 bg-gradient-to-br from-rose-50 to-orange-50 dark:border-rose-950/80 dark:from-slate-900 dark:to-slate-950">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-rose-800 dark:text-rose-300">Highest spending category</div>
              <div className="mt-2 break-words text-base font-bold text-rose-950 dark:text-slate-100 sm:text-lg">{top ? top.category : '—'}</div>
              <div className="mt-1 text-sm text-rose-900/75 dark:text-slate-300/75">
                {top ? `${formatMoney(top.amount, currency)} total` : 'Add expenses to see your top category.'}
              </div>
            </div>
            <TrendingDown className="h-5 w-5 text-rose-500 dark:text-rose-300" aria-hidden="true" />
          </div>
        </Card>

        <Card className="border-sky-200/80 bg-gradient-to-br from-sky-50 to-violet-50 dark:border-sky-950/80 dark:from-slate-900 dark:to-slate-950">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-sky-900 dark:text-sky-300">Month over month (expenses)</div>
              {mom ? (
                <>
                  <div className="mt-2 break-words text-base font-bold text-sky-950 tabular-nums dark:text-slate-100 sm:text-lg">{formatMoney(mom.last.expense, currency)}</div>
                  <div className="mt-1 text-sm text-sky-800/80 dark:text-slate-300/75">vs {formatMoney(mom.prev.expense, currency)} last month</div>
                </>
              ) : (
                <div className="mt-2 text-sm text-sky-800/75 dark:text-slate-300/75">Need at least two months of data.</div>
              )}
            </div>
            <ArrowUpRight className="h-5 w-5 text-sky-500 dark:text-sky-300" aria-hidden="true" />
          </div>

          {expenseDelta ? (
            <div className="mt-3 rounded-xl border border-sky-200/90 bg-white/70 p-3 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800/80">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium text-sky-800 dark:text-sky-300">Change</div>
                <div className="break-words text-right font-bold text-sky-950 tabular-nums dark:text-slate-100">
                  {expenseDelta.diff >= 0 ? '+' : ''}
                  {formatMoney(expenseDelta.diff, currency)}
                  {expenseDelta.pct == null ? '' : ` (${expenseDelta.pct >= 0 ? '+' : ''}${expenseDelta.pct.toFixed(1)}%)`}
                </div>
              </div>
            </div>
          ) : null}
        </Card>

        <Card className="border-amber-200/80 bg-gradient-to-br from-amber-50 to-lime-50 dark:border-amber-950/80 dark:from-slate-900 dark:to-slate-950">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-amber-900 dark:text-amber-300">Tip</div>
              <div className="mt-2 text-sm text-amber-950/80 dark:text-slate-300/75">
                Try sorting by amount to quickly spot large transactions, then filter to understand what drives your spending.
              </div>
            </div>
            <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-300" aria-hidden="true" />
          </div>
        </Card>
      </div>
    </section>
  )
}
