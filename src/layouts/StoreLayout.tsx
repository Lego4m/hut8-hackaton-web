import { NavLink, Outlet } from 'react-router'

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'font-semibold text-brand-600' : 'text-muted hover:text-brand-600'

export function StoreLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-white text-ink">
      <header className="border-b border-brand-100 bg-brand-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <NavLink to="/" className="text-xl font-bold text-brand-600">🍬 Doces da Lurdes</NavLink>
          <nav className="flex gap-4 text-sm">
            <NavLink to="/candies" className={navClass}>Candies</NavLink>
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
