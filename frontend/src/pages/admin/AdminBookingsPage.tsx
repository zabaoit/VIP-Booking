import { useMemo, useState } from 'react'
import { Icon } from '../../components/icons/Icon'
import type { BookingRecord } from '../../types'
import { readBookings, updateBookingStatus } from '../../utils/appStorage'

const adminBookingsFilterKey = 'vip-booking:admin-bookings-filter'
const adminBookingsSearchKey = 'vip-booking:admin-bookings-search'

function normalizeQuery(value: string) {
  return value.trim().toLowerCase()
}

export function AdminBookingsPage() {
  const [search, setSearch] = useState(() => {
    const value = window.sessionStorage.getItem(adminBookingsSearchKey) ?? ''
    window.sessionStorage.removeItem(adminBookingsSearchKey)
    return value
  })
  const [statusFilter, setStatusFilter] = useState<'All' | BookingRecord['status']>(() => {
    const value = window.sessionStorage.getItem(adminBookingsFilterKey)
    window.sessionStorage.removeItem(adminBookingsFilterKey)

    if (value === 'Pending' || value === 'Confirmed' || value === 'Cancelled' || value === 'All') {
      return value
    }

    return 'All'
  })
  const [bookings, setBookings] = useState(() => readBookings())

  const filteredBookings = useMemo(() => {
    const query = normalizeQuery(search)
    return bookings.filter((booking) => {
      const statusMatch = statusFilter === 'All' || booking.status === statusFilter
      const textMatch =
        !query ||
        booking.id.toLowerCase().includes(query) ||
        booking.guest.toLowerCase().includes(query) ||
        booking.email.toLowerCase().includes(query) ||
        booking.room.toLowerCase().includes(query)
      return statusMatch && textMatch
    })
  }, [bookings, search, statusFilter])

  const handleStatusChange = (bookingId: string, status: BookingRecord['status']) => {
    updateBookingStatus(bookingId, status)
    setBookings(readBookings())
  }

  return (
    <div className="admin-stack">
      <section className="admin-panel">
        <div className="admin-panel-header">
          <div className="panel-title">
            <Icon name="calendar" />
            <span>Booking Management</span>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <label className="flex-1 min-w-[240px]">
            <input
              value={search}
              placeholder="Search by booking ID, guest, room, or email..."
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          {(['All', 'Pending', 'Confirmed', 'Cancelled'] as const).map((status) => (
            <button
              key={status}
              className={`ghost-button compact ${statusFilter === status ? 'border-slate-500 text-white' : ''}`}
              type="button"
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Guest</th>
                <th>Email</th>
                <th>Room</th>
                <th>Check in</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>#{booking.id}</td>
                  <td>{booking.guest}</td>
                  <td>{booking.email}</td>
                  <td>{booking.room}</td>
                  <td>{booking.checkIn}</td>
                  <td>{booking.amount}</td>
                  <td>
                    <select
                      value={booking.status}
                      onChange={(event) =>
                        handleStatusChange(booking.id, event.target.value as BookingRecord['status'])
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={7}>No bookings found for this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
