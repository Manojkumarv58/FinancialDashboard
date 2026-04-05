import { Shield, Eye, Moon, Sun } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setRole } from '../../state/financeSlice'

export function Header({ theme, toggleTheme }) {
  const dispatch = useDispatch()
  const role = useSelector((state) => state.finance.role)


  return (
    <header className="sticky top-0 z-10 border-b border-violet-200/60 bg-white/75 shadow-sm shadow-violet-200/40 backdrop-blur-md transition-colors dark:border-slate-800/80 dark:bg-slate-950/75 dark:shadow-slate-950/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4 sm:py-4">
        <div className="min-w-0">
          <div className="text-sm font-medium text-violet-600/90 dark:text-violet-300/90">Finance Dashboard</div>
          <div className="truncate bg-gradient-to-r from-violet-700 via-fuchsia-600 to-cyan-600 bg-clip-text text-lg font-bold text-transparent">
            Zorvyn
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-end">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-100 dark:hover:border-violet-400 dark:hover:text-violet-300 sm:w-auto"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
            <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>

          <div className="flex w-full items-center justify-center gap-2 rounded-full border border-violet-200/80 bg-gradient-to-r from-white to-violet-50/90 px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-800/90 dark:shadow-slate-950/30 sm:w-auto">
            {role === 'admin' ? (
              <Shield className="h-4 w-4 text-violet-700 dark:text-violet-300" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4 text-cyan-700 dark:text-cyan-300" aria-hidden="true" />
            )}
            <label className="sr-only" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              className="min-w-0 rounded-md bg-transparent font-medium text-violet-900 outline-none dark:text-slate-100"
              value={role}
              onChange={(e) => dispatch(setRole(e.target.value))}
            >
              <option className="bg-white text-violet-900 dark:bg-slate-900 dark:text-slate-100" value="viewer">
                Viewer
              </option>
              <option className="bg-white text-violet-900 dark:bg-slate-900 dark:text-slate-100" value="admin">
                Admin
              </option>
            </select>
          </div>
        </div>
      </div>
    </header>
  )
}
