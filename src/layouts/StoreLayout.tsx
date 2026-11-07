import { Link, NavLink, Outlet } from 'react-router'
import { useLogout, useMe } from '../features/auth/queries'

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'font-semibold text-brand-600' : 'text-muted hover:text-brand-600'

function AccountMenu() {
  const { data: me, isPending } = useMe()
  const logout = useLogout()

  if (isPending) return null

  if (!me) {
    return (
      <div className="flex items-center gap-3">
        <NavLink to="/entrar" className={navClass}>Entrar</NavLink>
        <Link to="/cadastro" className="rounded-xl bg-brand-500 px-3 py-1.5 font-medium text-white hover:bg-brand-600">
          Criar conta
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      {me.role === 'admin' && (
        <Link to="/admin" className="rounded-xl bg-brand-500 px-3 py-1.5 font-medium text-white hover:bg-brand-600">
          Painel administrativo
        </Link>
      )}
      <span className="hidden text-muted sm:inline">Olá, {me.name.split(' ')[0]}</span>
      <button type="button" onClick={logout} className="text-muted hover:text-brand-600">Sair</button>
    </div>
  )
}

export function StoreLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-white text-ink">
      <header className="border-b border-brand-100 bg-brand-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <NavLink to="/" className="text-xl font-bold text-brand-600">🍬 Doces da Lurdes</NavLink>
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <NavLink to="/doces" className={navClass}>Doces</NavLink>
            <AccountMenu />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-brand-100 bg-brand-50 py-4 text-center text-sm text-muted">
        © {new Date().getFullYear()} Doces da Lurdes
      </footer>
    </div>
  )
}
