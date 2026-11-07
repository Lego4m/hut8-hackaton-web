import { Navigate, Route, Routes } from 'react-router'
import { StoreLayout } from './layouts/StoreLayout'
import { CandyDetailPage } from './pages/CandyDetailPage'
import { CandyListPage } from './pages/CandyListPage'
import { NotFoundPage } from './pages/NotFoundPage'

/**
 * All web pages live here. To add a new section (e.g. admin), create its
 * layout and nest its pages under a new <Route path="admin" element={<AdminLayout />}>.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route index element={<Navigate to="/candies" replace />} />
        <Route path="candies">
          <Route index element={<CandyListPage />} />
          <Route path=":id" element={<CandyDetailPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
