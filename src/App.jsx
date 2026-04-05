import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { DashboardOverview } from './components/DashboardOverview/DashboardOverview'
import { Header } from './components/Header/Header'
import { Insights } from './components/Insights/Insights'
import { TransactionsSection } from './components/Transactions/TransactionsSection'
import { applyTheme, getPreferredTheme, THEME_STORAGE_KEY } from './lib/theme'

export default function App() {
  const transactions = useSelector((state) => state.finance.transactions)
  const [theme, setTheme] = useState(() => getPreferredTheme())

  const balance = useMemo(() => {
    return transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0)
  }, [transactions])

  const income = useMemo(() => {
    return transactions.filter((t) => t.type === 'income').reduce((acc, t) => acc + t.amount, 0)
  }, [transactions])

  const expenses = useMemo(() => {
    return transactions.filter((t) => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
  }, [transactions])

  useEffect(() => {
    applyTheme(theme)
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-violet-100 via-sky-50 to-amber-100 text-zinc-900 transition-colors dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 dark:text-slate-100">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="mx-auto w-full max-w-6xl px-3 pb-10 sm:px-4 sm:pb-12">
        <div className="grid gap-8">
          <DashboardOverview balance={balance} income={income} expenses={expenses} theme={theme} />
          <TransactionsSection />
          <Insights />
        </div>
      </main>
    </div>
  )
}
