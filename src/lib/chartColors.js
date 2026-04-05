/** Palette for pie / category visuals */
export const CHART_PALETTE = ['#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#6366f1', '#f97316', '#14b8a6']

export function chartColorAt(index) {
  return CHART_PALETTE[index % CHART_PALETTE.length]
}
