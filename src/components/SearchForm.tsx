import { useSearchParams } from 'react-router'

/** Text search stored in the URL (?q=). Submitting resets to page 1. */
export function SearchForm({ placeholder }: { placeholder: string }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const current = searchParams.get('q') ?? ''

  return (
    <form
      role="search"
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        const q = String(new FormData(event.currentTarget).get('q') ?? '').trim()
        const next = new URLSearchParams(searchParams)
        if (q) next.set('q', q)
        else next.delete('q')
        next.delete('page')
        setSearchParams(next)
      }}
    >
      <input
        key={current}
        name="q"
        type="search"
        defaultValue={current}
        placeholder={placeholder}
        className="w-64 rounded-xl border border-brand-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-muted/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
      <button type="submit" className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
        Buscar
      </button>
    </form>
  )
}
