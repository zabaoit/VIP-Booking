import { AdminLayout } from '../components/layout/AdminLayout'
import { AdminBookingsPage } from '../pages/admin/AdminBookingsPage'
import { AdminCustomersPage } from '../pages/admin/AdminCustomersPage'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminPricingPage } from '../pages/admin/AdminPricingPage'
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
    key: 'adminBookings',
    element: () => (
      <AdminLayout currentRoute="adminBookings">
        <AdminBookingsPage />
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
  {
    key: 'adminPricing',
    element: () => (
      <AdminLayout currentRoute="adminPricing">
        <AdminPricingPage />
      </AdminLayout>
    ),
  },
  {
    key: 'adminCustomers',
    element: () => (
      <AdminLayout currentRoute="adminCustomers">
        <AdminCustomersPage />
      </AdminLayout>
    ),
  },
]
