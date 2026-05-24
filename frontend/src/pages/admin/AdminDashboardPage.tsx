import { Icon } from '../../components/icons/Icon'
import { DataTable } from '../../components/ui/DataTable'
import type { IconName } from '../../types'
<<<<<<< HEAD
import { readBookings, readRegisteredUsers } from '../../utils/appStorage'
=======
import { readBookings, readRegisteredUsers, readRooms, readServices } from '../../utils/appStorage'
>>>>>>> main

export function AdminDashboardPage() {
  const registeredUsers = readRegisteredUsers()
  const bookings = readBookings()
  const guestCount = registeredUsers.filter((user) => user.role === 'guest').length
  const confirmedBookings = bookings.filter((booking) => booking.status === 'Confirmed').length
  const pendingBookings = bookings.filter((booking) => booking.status === 'Pending').length
<<<<<<< HEAD
  const bookingRevenue = bookings.reduce((total, booking) => {
    return total + Number(booking.amount.replace(/[^0-9.]/g, ''))
  }, 0)
=======
  const roomCount = readRooms().length
  const activeServices = readServices().filter((service) => service.status === 'Active').length
  const bookingRevenue = bookings.reduce((total, booking) => {
    return total + Number(booking.amount.replace(/[^0-9.]/g, ''))
  }, 0)
  const unpaidBookings = bookings.filter((booking) => booking.status === 'Pending').length
>>>>>>> main
  const recentBookings =
    bookings.length > 0
      ? bookings.slice(0, 6).map((booking) => [
          booking.guest,
          booking.room,
          booking.checkIn,
          booking.amount,
          booking.status,
        ])
      : [['No bookings yet', '-', '-', '$0', 'Pending']]

  return (
    <div className="admin-stack">
      <div className="metric-grid">
        {[
          ['Revenue', `$${bookingRevenue.toLocaleString()}`, `${bookings.length} bookings`, 'spark'],
<<<<<<< HEAD
          ['Occupancy', `${confirmedBookings}`, 'confirmed bookings', 'bed'],
          ['Pending Requests', `${pendingBookings}`, 'waiting review', 'service'],
          ['VIP Guests', `${guestCount}`, 'registered guests', 'users'],
=======
          ['Check-in Queue', `${confirmedBookings}`, 'confirmed bookings', 'bed'],
          ['Unpaid Invoices', `${unpaidBookings}`, 'payment follow-up', 'card'],
          ['Guest Accounts', `${guestCount}`, 'registered guests', 'users'],
>>>>>>> main
        ].map(([label, value, delta, icon]) => (
          <article className="metric-card" key={label}>
            <span className="icon-tile">
              <Icon name={icon as IconName} />
            </span>
            <p>{label}</p>
            <strong>{value}</strong>
            <small>{delta}</small>
          </article>
        ))}
      </div>

      <div className="admin-grid">
        <section className="admin-panel">
          <div className="panel-title">
            <Icon name="dashboard" />
            <span>Reservation Flow</span>
          </div>
          <svg
            className="chart"
            viewBox="0 0 620 260"
            role="img"
            aria-label="Reservation line chart"
          >
            <path
              d="M30 210 C110 180 160 220 230 160 C300 90 360 130 420 80 C480 38 540 70 590 34"
              fill="none"
              stroke="url(#chartGradient)"
              strokeLinecap="round"
              strokeWidth="8"
            />
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="1">
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#e4b96b" />
              </linearGradient>
            </defs>
          </svg>
        </section>

        <section className="admin-panel">
          <div className="panel-title">
            <Icon name="bed" />
            <span>Operations Coverage</span>
          </div>
          <div className="grid gap-3">
            {[
              ['Rooms configured', roomCount, 'room inventory and type setup'],
              ['Active services', activeServices, 'hotel service catalog'],
              ['Pending bookings', pendingBookings, 'confirmation and check-in queue'],
            ].map(([label, value, note]) => (
              <div className="rounded-lg border border-slate-700 bg-slate-950/45 p-3" key={label}>
                <p className="m-0 text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
                <strong className="mt-1 block text-xl text-white">{value}</strong>
                <small className="text-slate-400">{note}</small>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="admin-panel">
        <div className="panel-title">
          <Icon name="shield" />
          <span>Admin Scope From Requirement File</span>
        </div>
        <div className="service-grid">
          {[
            ['Bookings & Check-in/out', 'Confirm reservations and track arrival/departure operations.'],
            ['Invoices & Payments', 'Review generated invoices and payment status by booking.'],
            ['Rooms, Types & Pricing', 'Maintain room inventory, room categories, rates, and price rules.'],
            ['Customers & Roles', 'Manage customer profiles and role-based access control.'],
          ].map(([title, description]) => (
            <article className="service-card" key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel">
        <div className="panel-title">
          <Icon name="calendar" />
          <span>Recent Bookings</span>
        </div>
        <DataTable
          headers={['Guest', 'Room', 'Check in', 'Amount', 'Status']}
          rows={recentBookings}
        />
      </section>
    </div>
  )
}
