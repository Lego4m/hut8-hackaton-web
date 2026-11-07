import { Link, useParams, useSearchParams } from 'react-router'
import { Card } from '../../components/Card'
import { Pagination } from '../../components/Pagination'
import { primaryButtonClass, secondaryButtonClass } from '../../components/formStyles'
import { ORDER_STATUSES, roleLabels, statusLabels } from '../../features/admin/labels'
import { OrdersTable } from '../../features/admin/OrdersTable'
import { useAdminOrders, useAdminUser } from '../../features/admin/queries'
import { formatDate, formatNumber, formatPrice } from '../../lib/format'

export function UserDetailPage() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const status = searchParams.get('status') ?? undefined

  const { data: user, isPending, isError } = useAdminUser(id)
  const orders = useAdminOrders({ page, status, user_id: id }, { enabled: !!id })

  if (isPending) return <p className="text-muted">Carregando…</p>
  if (isError) return <p className="text-brand-700">Usuário não encontrado.</p>

  const info = [
    ['E-mail', user.email],
    ['Telefone', user.phone],
    ['Endereço', user.address],
    ['Cidade', user.city ? `${user.city}/${user.state ?? ''}` : null],
    ['Perfil', roleLabels[user.role]],
    ['Cliente desde', formatDate(user.created_at)],
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin/usuarios" className="text-sm text-brand-600 hover:underline">← Voltar para usuários</Link>
        <div className="flex gap-2">
          <Link to={`/admin/usuarios/${user.id}/editar`} className={secondaryButtonClass}>Editar dados</Link>
          <Link to={`/admin/pedidos/novo?usuario=${user.id}`} className={primaryButtonClass}>+ Novo pedido</Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title={user.name} className="lg:col-span-2">
          <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            {info.map(([label, value]) => (
              <div key={label}>
                <dt className="text-muted">{label}</dt>
                <dd className="font-medium">{value || '—'}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card title="Resumo">
          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Pedidos</dt><dd className="font-semibold tabular-nums">{formatNumber(user.orders_count)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Total gasto</dt><dd className="font-semibold tabular-nums">{formatPrice(user.spent_cents)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Último pedido</dt><dd className="font-semibold">{user.last_order_at ? formatDate(user.last_order_at) : '—'}</dd></div>
          </dl>
        </Card>
      </div>

      <Card
        title="Pedidos do cliente"
        actions={
          <select
            aria-label="Filtrar por status"
            value={status ?? ''}
            onChange={(event) => {
              const next = new URLSearchParams(searchParams)
              if (event.target.value) next.set('status', event.target.value)
              else next.delete('status')
              next.delete('page')
              setSearchParams(next)
            }}
            className="rounded-xl border border-brand-200 bg-white px-3 py-1.5 text-sm"
          >
            <option value="">Todos os status</option>
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
          </select>
        }
      >
        {orders.isPending && <p className="text-muted">Carregando pedidos…</p>}
        {orders.isError && <p className="text-brand-700">Não foi possível carregar os pedidos.</p>}
        {orders.data && <OrdersTable orders={orders.data.data} showCustomer={false} />}
        <div className="mt-4"><Pagination pagination={orders.data?.pagination} /></div>
      </Card>
    </div>
  )
}
