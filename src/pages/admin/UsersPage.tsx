import { Link, useSearchParams } from 'react-router'
import { Card } from '../../components/Card'
import { Pagination } from '../../components/Pagination'
import { SearchForm } from '../../components/SearchForm'
import { primaryButtonClass } from '../../components/formStyles'
import { roleLabels } from '../../features/admin/labels'
import { useAdminUsers } from '../../features/admin/queries'
import { formatDate, formatNumber, formatPrice } from '../../lib/format'

export function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const q = searchParams.get('q') ?? undefined
  const role = searchParams.get('perfil') ?? undefined

  const { data, isPending, isError, isFetching } = useAdminUsers({ page, q, role })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <div className="flex flex-wrap gap-2">
          <select
            aria-label="Filtrar por perfil"
            value={role ?? ''}
            onChange={(event) => {
              const next = new URLSearchParams(searchParams)
              if (event.target.value) next.set('perfil', event.target.value)
              else next.delete('perfil')
              next.delete('page')
              setSearchParams(next)
            }}
            className="rounded-xl border border-brand-200 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todos os perfis</option>
            <option value="customer">{roleLabels.customer}</option>
            <option value="admin">{roleLabels.admin}</option>
          </select>
          <SearchForm placeholder="Nome, e-mail ou telefone" />
          <Link to="/admin/usuarios/novo" className={primaryButtonClass}>+ Novo usuário</Link>
        </div>
      </div>

      <Card>
        {isPending && <p className="text-muted">Carregando…</p>}
        {isError && <p className="text-brand-700">Não foi possível carregar os usuários.</p>}
        {data && (data.data.length === 0 ? <p className="py-6 text-center text-muted">Nenhum usuário encontrado.</p> : (
          <div className={`overflow-x-auto ${isFetching ? 'opacity-60' : ''}`}>
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-brand-100 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="py-2 pr-4 font-medium">Nome</th>
                  <th className="py-2 pr-4 font-medium">E-mail</th>
                  <th className="py-2 pr-4 font-medium">Telefone</th>
                  <th className="py-2 pr-4 font-medium">Cidade</th>
                  <th className="py-2 pr-4 text-right font-medium">Pedidos</th>
                  <th className="py-2 pr-4 text-right font-medium">Total gasto</th>
                  <th className="py-2 font-medium">Último pedido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {data.data.map((user) => (
                  <tr key={user.id} className="hover:bg-brand-50/50">
                    <td className="py-3 pr-4">
                      <Link to={`/admin/usuarios/${user.id}`} className="font-semibold text-brand-600 hover:underline">{user.name}</Link>
                      {user.role === 'admin' && <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-700">{roleLabels.admin}</span>}
                    </td>
                    <td className="py-3 pr-4 text-muted">{user.email}</td>
                    <td className="whitespace-nowrap py-3 pr-4 text-muted">{user.phone ?? '—'}</td>
                    <td className="py-3 pr-4 text-muted">{user.city ? `${user.city}/${user.state ?? ''}` : '—'}</td>
                    <td className="py-3 pr-4 text-right tabular-nums">{formatNumber(user.orders_count)}</td>
                    <td className="py-3 pr-4 text-right tabular-nums">{formatPrice(user.spent_cents)}</td>
                    <td className="py-3 text-muted">{user.last_order_at ? formatDate(user.last_order_at) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        <div className="mt-4"><Pagination pagination={data?.pagination} /></div>
      </Card>
    </div>
  )
}
