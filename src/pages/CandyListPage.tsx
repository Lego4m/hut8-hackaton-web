import { Link, useSearchParams } from 'react-router'
import { Pagination } from '../components/Pagination'
import { CandyCard } from '../features/candies/CandyCard'
import { useCandies } from '../features/candies/queries'
import { formatNumber } from '../lib/format'

export function CandyListPage() {
  const [searchParams] = useSearchParams()
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const category = searchParams.get('categoria') ?? undefined

  const { data, isPending, isError, isFetching } = useCandies({ page, category })

  if (isPending) return <p className="text-muted">Carregando doces…</p>
  if (isError) return <p className="text-brand-700">Não foi possível carregar os doces.</p>

  const pagination = data.pagination

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-bold text-ink">
          {category ? <span className="capitalize">{category}</span> : 'Nossos doces'}
        </h1>
        <div className="flex items-baseline gap-3 text-sm text-muted">
          {pagination && <span>{formatNumber(pagination.count)} itens</span>}
          {category && <Link to="/doces" className="text-brand-600 hover:underline">Ver todos</Link>}
        </div>
      </div>

      {data.data.length === 0 ? (
        <p className="text-muted">Nenhum doce encontrado.</p>
      ) : (
        <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 ${isFetching ? 'opacity-60' : ''}`}>
          {data.data.map((candy) => (
            <CandyCard key={candy.id} candy={candy} />
          ))}
        </div>
      )}

      <Pagination pagination={pagination} />
    </section>
  )
}
