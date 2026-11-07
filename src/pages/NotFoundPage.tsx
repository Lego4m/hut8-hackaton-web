import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-start gap-2">
      <h1 className="text-2xl font-bold text-ink">Página não encontrada</h1>
      <Link to="/" className="text-brand-600 hover:underline">Ir para a loja</Link>
    </div>
  )
}
