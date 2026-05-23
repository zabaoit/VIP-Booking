import { Icon } from '../../components/icons/Icon'
import { DataTable } from '../../components/ui/DataTable'
import type { IconName } from '../../types'
import { readBookings, readRegisteredUsers } from '../../utils/appStorage'

export function AdminDashboardPage() {
  const registeredUsers = readRegisteredUsers()
  const bookings = readBookings()
  const guestCount = registeredUsers.filter((user) => user.role === 'guest').length
  const confirmedBookings = bookings.filter((booking) => booking.status === 'Confirmed').length
  const pendingBookings = bookings.filter((booking) => booking.status === 'Pending').length
  const bookingRevenue = bookings.reduce((total, booking) => {
    return total + Number(booking.amount.replace(/[^0-9.]/g, ''))
  }, 0)
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
          ['Occupancy', `${confirmedBookings}`, 'confirmed bookings', 'bed'],
          ['Pending Requests', `${pendingBookings}`, 'waiting review', 'service'],
          ['VIP Guests', `${guestCount}`, 'registered guests', 'users'],
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
            <span>Room Mix</span>
          </div>
          <div className="bar-chart">
            <span style={{ height: '42%' }}>Suite</span>
            <span style={{ height: '70%' }}>Sky</span>
            <span style={{ height: '58%' }}>Garden</span>
            <span style={{ height: '86%' }}>Villa</span>
          </div>
        </section>
      </div>

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
