import type { IconName, RouteKey } from '../types'

export const navItems: Array<{ label: string; route: RouteKey }> = [
  { label: 'Home', route: 'home' },
  { label: 'Rooms', route: 'rooms' },
  { label: 'Contact', route: 'contact' },
  { label: 'About', route: 'about' },
]

export const adminNavItems: Array<{ label: string; route: RouteKey; icon: IconName }> = [
  { label: 'Overview', route: 'admin', icon: 'dashboard' },
  { label: 'Bookings', route: 'adminBookings', icon: 'calendar' },
  { label: 'Room Types', route: 'adminRooms', icon: 'bed' },
  { label: 'Services', route: 'adminServices', icon: 'service' },
  { label: 'Pricing', route: 'adminPricing', icon: 'card' },
  { label: 'Customers', route: 'adminCustomers', icon: 'users' },
]
