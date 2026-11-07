import { useState } from 'react'
import { formatDayMonth, formatPrice } from '../../lib/format'
import type { DailyPoint } from './types'

/** Rounds the axis top up to 1, 2 or 5 × 10^n (in reais) so gridlines read cleanly. */
function niceMaxCents(maxCents: number) {
  const reais = Math.max(maxCents / 100, 1)
  const magnitude = 10 ** Math.floor(Math.log10(reais))
  const step = [1, 2, 5, 10].find((s) => s * magnitude >= reais) ?? 10
  return step * magnitude * 100
}

/** Single-series bar chart of daily revenue, with a hover/focus tooltip and a screen-reader table. */
export function DailyRevenueChart({ data }: { data: DailyPoint[] }) {
  const [active, setActive] = useState<number | null>(null)
  const top = niceMaxCents(Math.max(...data.map((d) => d.earned_cents), 0))
  const ticks = [top, top / 2, 0]
  const labelEvery = data.length <= 10 ? 1 : Math.ceil(data.length / 8)
  const point = active === null ? null : data[active]

  return (
    <div>
      <div className="flex gap-2">
        {/* Y axis */}
        <div className="relative h-48 w-16 shrink-0 text-right text-[11px] tabular-nums text-muted">
          {ticks.map((tick, i) => (
            <span key={tick} className="absolute right-0 -translate-y-1/2" style={{ top: `${i * 50}%` }}>
              {formatPrice(tick).replace(/,00$/, '')}
            </span>
          ))}
        </div>

        <div className="relative h-48 flex-1" onMouseLeave={() => setActive(null)}>
          {/* Gridlines */}
          {ticks.map((tick, i) => (
            <div
              key={tick}
              className={`absolute inset-x-0 border-t ${i === 2 ? 'border-brand-200' : 'border-dashed border-brand-100'}`}
              style={{ top: `${i * 50}%` }}
            />
          ))}

          {/* Bars: each column is the full-height hit target */}
          <div className="absolute inset-0 flex items-end gap-[2px]">
            {data.map((d, i) => (
              <div
                key={d.date}
                tabIndex={0}
                aria-label={`${formatDayMonth(d.date)}: ${formatPrice(d.earned_cents)} em ${d.orders_count} pedidos`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="flex h-full flex-1 cursor-default items-end justify-center outline-none"
              >
                <div
                  className={`w-full max-w-10 rounded-t-[4px] transition-colors ${active === i ? 'bg-brand-600' : 'bg-brand-400'}`}
                  style={{ height: `${(d.earned_cents / top) * 100}%` }}
                />
              </div>
            ))}
          </div>

          {/* Tooltip */}
          {point && active !== null && (
            <div
              className="pointer-events-none absolute z-10 w-max rounded-lg border border-brand-100 bg-white px-3 py-2 text-xs shadow-lg shadow-brand-100"
              style={{
                left: `${((active + 0.5) / data.length) * 100}%`,
                bottom: `${Math.min((point.earned_cents / top) * 100, 80) + 4}%`,
                transform: `translateX(${active < data.length / 4 ? '-10%' : active > (data.length * 3) / 4 ? '-90%' : '-50%'})`,
              }}
            >
              <div className="font-semibold text-ink">{formatDayMonth(point.date)}</div>
              <div className="text-ink">Faturamento: <span className="tabular-nums">{formatPrice(point.earned_cents)}</span></div>
              <div className="text-muted">Líquido: <span className="tabular-nums">{formatPrice(point.net_cents)}</span></div>
              <div className="text-muted">{point.orders_count} pedidos</div>
            </div>
          )}
        </div>
      </div>

      {/* X axis */}
      <div className="ml-18 mt-1 flex gap-[2px] text-[11px] text-muted">
        {data.map((d, i) => (
          <span key={d.date} className="flex-1 text-center">
            {i % labelEvery === 0 ? formatDayMonth(d.date) : ''}
          </span>
        ))}
      </div>

      <table className="sr-only">
        <caption>Faturamento por dia</caption>
        <thead><tr><th>Dia</th><th>Faturamento</th><th>Líquido</th><th>Pedidos</th></tr></thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.date}>
              <td>{formatDayMonth(d.date)}</td>
              <td>{formatPrice(d.earned_cents)}</td>
              <td>{formatPrice(d.net_cents)}</td>
              <td>{d.orders_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
