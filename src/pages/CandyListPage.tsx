import { Link, useSearchParams } from 'react-router'
import { CandyCard } from '../features/candies/CandyCard'
import { useCandies } from '../features/candies/queries'

export function CandyListPage() {
  const [searchParams] = useSearchParams()
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const category = searchParams.get('category') ?? undefined

  const { data, isPending, isError, isFetching } = useCandies({ page, category })

  const pageLink = (target: number) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(target))
    return `?${next}`
  }

  if (isPending) return <p className="text-muted">Loading candies…</p>
  if (isError) return <p className="text-brand-700">Could not load candies.</p>

  const pagination = data.pagination

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold text-ink">Candies</h1>
        {pagination && <span className="text-sm text-muted">{pagination.count} items</span>}
      </div>

      {data.data.length === 0 ? (
        <p className="text-muted">No candies here.</p>
      ) : (
        <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 ${isFetching ? 'opacity-60' : ''}`}>
          {data.data.map((candy) => (
            <CandyCard key={candy.id} candy={candy} />
          ))}
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <nav className="flex items-center justify-center gap-4 text-sm">
          {pagination.previous ? (
            <Link to={pageLink(pagination.previous)} className="text-brand-600 hover:underline">← Previous</Link>
          ) : (
            <span className="text-brand-200">← Previous</span>
          )}
          <span>Page {pagination.page} of {pagination.pages}</span>
          {pagination.next ? (
            <Link to={pageLink(pagination.next)} className="text-brand-600 hover:underline">Next →</Link>
          ) : (
            <span className="text-brand-200">Next →</span>
          )}
        </nav>
      )}
    </section>
  )
}
