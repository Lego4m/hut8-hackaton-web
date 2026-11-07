import type { ReactNode } from 'react'
import { Link, Navigate, useLocation } from 'react-router'
import { useLogout, useMe } from './queries'

/** Shows children only to admins; sends visitors to the login page. */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { data: me, isPending, isError } = useMe()
  const logout = useLogout()

  if (isPending) return <p className="p-8 text-muted">Carregando…</p>
  if (isError) return <p className="p-8 text-brand-700">Não foi possível conectar ao servidor.</p>

  if (!me) {
    const voltar = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/entrar?voltar=${voltar}`} replace />
  }

  if (me.role !== 'admin') {
    return (
      <div className="mx-auto flex max-w-md flex-col items-start gap-3 p-8">
        <h1 className="text-2xl font-bold">Acesso restrito</h1>
        <p className="text-muted">O painel administrativo é só para administradores. Você entrou como {me.name}.</p>
        <div className="flex gap-4 text-sm">
          <Link to="/doces" className="text-brand-600 hover:underline">Voltar para a loja</Link>
          <button type="button" onClick={logout} className="text-brand-600 hover:underline">Entrar com outra conta</button>
        </div>
      </div>
    )
  }

  return children
}
