import { Link, useSearchParams } from 'react-router'
import { Card } from '../../components/Card'
import { DailyRevenueChart } from '../../features/admin/DailyRevenueChart'
import { ORDER_STATUSES } from '../../features/admin/labels'
import { useOverview } from '../../features/admin/queries'
import { StatTile } from '../../features/admin/StatTile'
import { StatusBadge } from '../../features/admin/StatusBadge'
import { formatDateTime, formatNumber, formatPrice } from '../../lib/format'

const PERIODS = [7, 30, 90]

export function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const days = PERIODS.includes(Number(searchParams.get('dias'))) ? Number(searchParams.get('dias')) : 7
  const { data, isPending, isError, isFetching } = useOverview(days)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Visão Geral</h1>
        <div role="group" aria-label="Período" className="flex rounded-xl border border-brand-200 bg-white p-1 text-sm">
          {PERIODS.map((period) => (
            <button
              key={period}
              type="button"
              aria-pressed={days === period}
              onClick={() => setSearchParams({ dias: String(period) })}
              className={`rounded-lg px-3 py-1 ${days === period ? 'bg-brand-500 font-medium text-white' : 'text-muted hover:text-brand-600'}`}
            >
              Últimos {period} dias
            </button>
          ))}
        </div>
      </div>

      {isPending && <p className="text-muted">Carregando…</p>}
      {isError && <p className="text-brand-700">Não foi possível carregar a visão geral.</p>}

      {data && (
        <div className={`flex flex-col gap-6 ${isFetching ? 'opacity-70' : ''}`}>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
            <StatTile label="Pedidos" value={formatNumber(data.current.orders_count)}
              current={data.current.orders_count} previous={data.previous.orders_count} />
            <StatTile label="Faturamento" value={formatPrice(data.current.earned_cents)}
              current={data.current.earned_cents} previous={data.previous.earned_cents}
              hint="Total pago pelos clientes (sem pedidos cancelados)" />
            <StatTile label="Gastos" value={formatPrice(data.current.spent_cents)}
              current={data.current.spent_cents} previous={data.previous.spent_cents}
              hint="Custo dos produtos + taxas de pagamento" />
            <StatTile label="Lucro líquido" value={formatPrice(data.current.net_cents)}
              current={data.current.net_cents} previous={data.previous.net_cents}
              hint="Faturamento − gastos" />
            <StatTile label="Ticket médio" value={formatPrice(data.current.average_ticket_cents)}
              current={data.current.average_ticket_cents} previous={data.previous.average_ticket_cents} />
            <StatTile label="Cancelados" value={formatNumber(data.current.canceled_count)}
              current={data.current.canceled_count} previous={data.previous.canceled_count} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card title="Faturamento por dia" className="lg:col-span-2">
              <DailyRevenueChart data={data.daily} />
            </Card>

            <Card title="Pedidos por status">
              <ul className="flex flex-col gap-3">
                {ORDER_STATUSES.map((status) => (
                  <li key={status} className="flex items-center justify-between">
                    <Link to={`/admin/pedidos?status=${status}`} className="hover:opacity-80">
                      <StatusBadge status={status} />
                    </Link>
                    <span className="font-medium tabular-nums">{formatNumber(data.orders_by_status[status] ?? 0)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Doces mais vendidos">
              {data.top_candies.length === 0 ? <p className="text-muted">Nenhuma venda no período.</p> : (
                <table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase tracking-wide text-muted">
                    <tr>
                      <th className="pb-2 font-medium">Doce</th>
                      <th className="pb-2 text-right font-medium">Unidades</th>
                      <th className="pb-2 text-right font-medium">Faturamento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-50">
                    {data.top_candies.map((candy) => (
                      <tr key={candy.id}>
                        <td className="py-2">{candy.name}</td>
                        <td className="py-2 text-right tabular-nums">{formatNumber(candy.quantity)}</td>
                        <td className="py-2 text-right tabular-nums">{formatPrice(candy.earned_cents)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>

            <Card title="Pedidos recentes" actions={<Link to="/admin/pedidos" className="text-sm text-brand-600 hover:underline">Ver todos</Link>}>
              <ul className="divide-y divide-brand-50">
                {data.recent_orders.map((order) => (
                  <li key={order.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <div className="min-w-0">
                      <Link to={`/admin/pedidos/${order.id}`} className="font-semibold text-brand-600 hover:underline">#{order.id}</Link>{' '}
                      <span className="text-ink">{order.user.name}</span>
                      <div className="text-xs text-muted">{formatDateTime(order.created_at)}</div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="tabular-nums">{formatPrice(order.total_cents)}</span>
                      <StatusBadge status={order.status} />
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
