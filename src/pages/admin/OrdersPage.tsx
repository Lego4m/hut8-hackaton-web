import { Link, useSearchParams } from 'react-router'
import { Card } from '../../components/Card'
import { Pagination } from '../../components/Pagination'
import { SearchForm } from '../../components/SearchForm'
import { primaryButtonClass } from '../../components/formStyles'
import { ORDER_STATUSES, statusLabels } from '../../features/admin/labels'
import { OrdersTable } from '../../features/admin/OrdersTable'
import { useAdminOrders } from '../../features/admin/queries'
import { formatNumber } from '../../lib/format'

export function OrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const q = searchParams.get('q') ?? undefined
  const status = searchParams.get('status') ?? undefined

  const { data, isPending, isError, isFetching } = useAdminOrders({ page, q, status })

  const setStatus = (value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set('status', value)
    else next.delete('status')
    next.delete('page')
    setSearchParams(next)
  }

  const tabClass = (active: boolean) =>
    `whitespace-nowrap rounded-full px-3 py-1 text-sm ${active ? 'bg-brand-500 font-medium text-white' : 'bg-brand-50 text-ink hover:bg-brand-100'}`

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">
          Pedidos
          {data?.pagination && <span className="ml-2 text-base font-normal text-muted">({formatNumber(data.pagination.count)})</span>}
        </h1>
        <div className="flex flex-wrap gap-2">
          <SearchForm placeholder="Nº do pedido ou cliente" />
          <Link to="/admin/pedidos/novo" className={primaryButtonClass}>+ Novo pedido</Link>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrar por status">
        <button type="button" className={tabClass(!status)} onClick={() => setStatus('')}>Todos</button>
        {ORDER_STATUSES.map((s) => (
          <button key={s} type="button" className={tabClass(status === s)} onClick={() => setStatus(s)}>
            {statusLabels[s]}
          </button>
        ))}
      </div>

      <Card>
        {isPending && <p className="text-muted">Carregando…</p>}
        {isError && <p className="text-brand-700">Não foi possível carregar os pedidos.</p>}
        {data && <div className={isFetching ? 'opacity-60' : ''}><OrdersTable orders={data.data} /></div>}
        <div className="mt-4"><Pagination pagination={data?.pagination} /></div>
      </Card>
    </div>
  )
}
