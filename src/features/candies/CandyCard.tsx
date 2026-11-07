import { Link } from 'react-router'
import { formatPrice } from '../../lib/format'
import type { Candy } from './types'

export function CandyCard({ candy }: { candy: Candy }) {
  return (
    <Link
      to={`/candies/${candy.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white transition hover:border-brand-200 hover:shadow-md hover:shadow-brand-100"
    >
      <div className="flex aspect-square items-center justify-center bg-brand-50 text-5xl">
        {candy.image ? (
          <img src={candy.image.url} alt={candy.name} className="h-full w-full object-cover" />
        ) : (
          <span aria-hidden>🍬</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        {candy.category && (
          <span className="text-xs uppercase tracking-wide text-muted">{candy.category}</span>
        )}
        <h3 className="font-semibold text-ink group-hover:text-brand-600">{candy.name}</h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-semibold text-brand-600">{formatPrice(candy.price_cents)}</span>
          {!candy.in_stock && (
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-700">Out of stock</span>
          )}
        </div>
      </div>
    </Link>
  )
}
