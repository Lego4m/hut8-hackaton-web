import { NavLink, Outlet } from 'react-router'
import { useLogout, useMe } from '../features/auth/queries'

const menu = [
  { to: '/admin', label: 'Visão Geral', icon: '📊', end: true },
  { to: '/admin/usuarios', label: 'Usuários', icon: '👥' },
  { to: '/admin/pedidos', label: 'Pedidos', icon: '🧾' },
  { to: '/admin/configuracoes', label: 'Configurações', icon: '⚙️' },
]

const itemClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
    isActive ? 'bg-white font-semibold text-brand-600 shadow-sm shadow-brand-100' : 'text-ink hover:bg-white/70'
  }`

export function AdminLayout() {
  const { data: me } = useMe()
  const logout = useLogout()

  return (
    <div className="flex min-h-svh flex-col bg-white text-ink md:flex-row">
      <aside className="flex shrink-0 flex-col gap-6 border-b border-brand-100 bg-brand-50 p-4 md:sticky md:top-0 md:h-svh md:w-60 md:border-r md:border-b-0">
        <NavLink to="/admin" end className="-ml-2 flex items-center gap-1">
          <img src="/logo.svg" alt="" width={56} height={56} className="-my-2 h-14 w-14 shrink-0" />
          <span>
            <span className="block text-lg font-bold leading-tight text-brand-600">Doces da Lurdes</span>
            <span className="block text-xs text-muted">Painel administrativo</span>
          </span>
        </NavLink>

        <nav aria-label="Menu administrativo" className="flex gap-1 overflow-x-auto md:flex-col">
          {menu.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={itemClass}>
              <span aria-hidden>{item.icon}</span>
              <span className="whitespace-nowrap">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto hidden flex-col gap-2 text-sm md:flex">
          {me && <div className="truncate text-muted" title={me.email}>{me.name}</div>}
          <NavLink to="/doces" className="text-muted hover:text-brand-600">← Ver a loja</NavLink>
          <button type="button" onClick={logout} className="text-left text-muted hover:text-brand-600">Sair</button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  )
}
