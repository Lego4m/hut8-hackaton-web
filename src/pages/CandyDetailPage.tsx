import { Link, useParams } from 'react-router'
import { useCandy } from '../features/candies/queries'
import { formatPrice } from '../lib/format'

export function CandyDetailPage() {
  const { id } = useParams()
  const { data: candy, isPending, isError } = useCandy(id)

  if (isPending) return <p className="text-muted">Carregando…</p>
  if (isError) return <p className="text-brand-700">Doce não encontrado.</p>

  return (
    <article className="flex flex-col gap-6">
      <Link to="/doces" className="text-sm text-brand-600 hover:underline">← Voltar para os doces</Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-brand-100 bg-brand-50 text-8xl">
          {candy.image ? (
            <img src={candy.image.url} alt={candy.name} className="h-full w-full object-cover" />
          ) : (
            <span aria-hidden>🍬</span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {candy.category && (
            <Link
              to={`/doces?categoria=${encodeURIComponent(candy.category)}`}
              className="w-fit rounded-full bg-brand-100 px-3 py-1 text-xs uppercase tracking-wide text-brand-700 hover:bg-brand-200"
            >
              {candy.category}
            </Link>
          )}
          <h1 className="text-3xl font-bold text-ink">{candy.name}</h1>
          <p className="text-2xl font-semibold text-brand-600">{formatPrice(candy.price_cents)}</p>
          {candy.description && <p className="text-muted">{candy.description}</p>}
          <p className={candy.in_stock ? 'text-emerald-700' : 'text-brand-700'}>
            {candy.in_stock ? `${candy.stock} em estoque` : 'Esgotado'}
          </p>
        </div>
      </div>
    </article>
  )
}
