export function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-zinc-200/90 bg-white/95 p-4 shadow-md shadow-zinc-200/50 backdrop-blur-sm transition-colors dark:border-slate-800/90 dark:bg-slate-900/80 dark:shadow-slate-950/40 ${className}`}
    >
      {children}
    </div>
  )
}
