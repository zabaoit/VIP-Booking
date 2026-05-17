import { AdminLayout } from '../components/layout/AdminLayout'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminRoomTypesPage } from '../pages/admin/AdminRoomTypesPage'
import { AdminServicesPage } from '../pages/admin/AdminServicesPage'
import type { AppRoute } from '../types'

export const privateRoutes: AppRoute[] = [
  {
    key: 'admin',
    element: () => (
      <AdminLayout currentRoute="admin">
        <AdminDashboardPage />
      </AdminLayout>
    ),
  },
  {
    key: 'adminRooms',
    element: () => (
      <AdminLayout currentRoute="adminRooms">
        <AdminRoomTypesPage />
      </AdminLayout>
    ),
  },
  {
    key: 'adminServices',
    element: () => (
      <AdminLayout currentRoute="adminServices">
        <AdminServicesPage />
      </AdminLayout>
    ),
  },
]
