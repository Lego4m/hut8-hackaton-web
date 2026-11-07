import { Navigate, Route, Routes } from 'react-router'
import { RequireAdmin } from './features/auth/RequireAdmin'
import { AdminLayout } from './layouts/AdminLayout'
import { StoreLayout } from './layouts/StoreLayout'
import { EditUserPage } from './pages/admin/EditUserPage'
import { NewOrderPage } from './pages/admin/NewOrderPage'
import { NewUserPage } from './pages/admin/NewUserPage'
import { OrderDetailPage } from './pages/admin/OrderDetailPage'
import { OrdersPage } from './pages/admin/OrdersPage'
import { OverviewPage } from './pages/admin/OverviewPage'
import { SettingsPage } from './pages/admin/SettingsPage'
import { UserDetailPage } from './pages/admin/UserDetailPage'
import { UsersPage } from './pages/admin/UsersPage'
import { CandyDetailPage } from './pages/CandyDetailPage'
import { CandyListPage } from './pages/CandyListPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RegisterPage } from './pages/RegisterPage'

/**
 * All web pages live here. Each area has its own layout:
 * the store (customers, plus /entrar and /cadastro) and /admin (left menu, admins only).
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route index element={<Navigate to="/doces" replace />} />
        <Route path="doces">
          <Route index element={<CandyListPage />} />
          <Route path=":id" element={<CandyDetailPage />} />
        </Route>
        <Route path="entrar" element={<LoginPage />} />
        <Route path="cadastro" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
        <Route index element={<OverviewPage />} />
        <Route path="usuarios">
          <Route index element={<UsersPage />} />
          <Route path="novo" element={<NewUserPage />} />
          <Route path=":id" element={<UserDetailPage />} />
          <Route path=":id/editar" element={<EditUserPage />} />
        </Route>
        <Route path="pedidos">
          <Route index element={<OrdersPage />} />
          <Route path="novo" element={<NewOrderPage />} />
          <Route path=":id" element={<OrderDetailPage />} />
        </Route>
        <Route path="configuracoes" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
