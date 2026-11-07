import { Link, useSearchParams } from 'react-router'
import type { Pagination as PaginationData } from '../lib/api'

/** Previous/next links that keep the other URL filters and change only ?page=. */
export function Pagination({ pagination }: { pagination?: PaginationData }) {
  const [searchParams] = useSearchParams()

  if (!pagination || pagination.pages <= 1) return null

  const pageLink = (target: number) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(target))
    return `?${next}`
  }

  const linkClass = 'rounded-lg px-3 py-1.5 text-brand-600 hover:bg-brand-50'
  const disabledClass = 'px-3 py-1.5 text-muted/50'

  return (
    <nav aria-label="Paginação" className="flex items-center justify-center gap-2 text-sm">
      {pagination.previous ? (
        <Link to={pageLink(pagination.previous)} className={linkClass}>← Anterior</Link>
      ) : (
        <span className={disabledClass}>← Anterior</span>
      )}
      <span className="px-2 text-muted">Página {pagination.page} de {pagination.pages}</span>
      {pagination.next ? (
        <Link to={pageLink(pagination.next)} className={linkClass}>Próxima →</Link>
      ) : (
        <span className={disabledClass}>Próxima →</span>
      )}
    </nav>
  )
}
