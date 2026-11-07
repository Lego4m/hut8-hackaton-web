import { percentChange } from '../../lib/format'

/** One headline number with its change against the previous period. */
export function StatTile({ label, value, current, previous, hint }: {
  label: string
  value: string
  current: number
  previous: number
  hint?: string
}) {
  const change = percentChange(current, previous)
  const arrow = change === null || Math.abs(change) < 0.5 ? '•' : change > 0 ? '▲' : '▼'

  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-4" title={hint}>
      <div className="text-sm text-muted">{label}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums text-ink">{value}</div>
      <div className="mt-1 text-xs text-muted">
        {change === null ? 'sem dados no período anterior' : (
          <>
            <span aria-hidden>{arrow}</span>{' '}
            {change > 0 ? '+' : ''}{change.toFixed(0)}% vs. período anterior
          </>
        )}
      </div>
    </div>
  )
}
