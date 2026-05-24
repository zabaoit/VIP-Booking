<<<<<<< HEAD
import { useMemo, useState } from 'react'
import { Icon } from '../../components/icons/Icon'
import type { BookingRecord } from '../../types'
import { readBookings, updateBookingStatus } from '../../utils/appStorage'
=======
import { useMemo, useState, type FormEvent } from 'react'
import { Icon } from '../../components/icons/Icon'
import type { BookingRecord } from '../../types'
import { readBookings, saveBookings, updateBookingStatus } from '../../utils/appStorage'
>>>>>>> main

const adminBookingsFilterKey = 'vip-booking:admin-bookings-filter'
const adminBookingsSearchKey = 'vip-booking:admin-bookings-search'

function normalizeQuery(value: string) {
  return value.trim().toLowerCase()
}

<<<<<<< HEAD
export function AdminBookingsPage() {
=======
function parseAmount(amount: string) {
  return Number(amount.replace(/[^0-9.]/g, '')) || 0
}

function invoiceStatus(booking: BookingRecord) {
  if (booking.status === 'Cancelled') return 'Cancelled'
  if (booking.status === 'Pending') return 'Unpaid'
  return 'Paid'
}

function invoiceCode(booking: BookingRecord) {
  return `INV-${booking.id.replace(/[^a-z0-9]/gi, '').padStart(5, '0')}`
}

function createBookingId() {
  return `BK${Date.now().toString().slice(-6)}`
}

function getOperationalStatus(booking: BookingRecord) {
  const today = new Date()
  const checkIn = new Date(booking.checkIn)
  const checkOut = new Date(booking.checkOut)

  if (booking.status === 'Cancelled') return 'Cancelled'
  if (booking.status === 'Pending') return 'Confirm booking'
  if (!Number.isNaN(checkOut.getTime()) && today > checkOut) return 'Check-out review'
  if (!Number.isNaN(checkIn.getTime()) && today >= checkIn) return 'Ready for check-in'
  return 'Upcoming stay'
}

export function AdminBookingsPage() {
  const [activeBooking, setActiveBooking] = useState<BookingRecord | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [invoiceSearch, setInvoiceSearch] = useState('')
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<'All' | 'Paid' | 'Unpaid' | 'Cancelled'>('All')
>>>>>>> main
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

<<<<<<< HEAD
=======
  const invoices = useMemo(() => {
    const query = normalizeQuery(invoiceSearch)

    return bookings
      .map((booking) => ({
        ...booking,
        invoiceCode: invoiceCode(booking),
        invoiceStatus: invoiceStatus(booking),
      }))
      .filter((invoice) => {
        const statusMatch = invoiceStatusFilter === 'All' || invoice.invoiceStatus === invoiceStatusFilter
        const textMatch =
          !query ||
          invoice.invoiceCode.toLowerCase().includes(query) ||
          invoice.id.toLowerCase().includes(query) ||
          invoice.guest.toLowerCase().includes(query) ||
          invoice.email.toLowerCase().includes(query) ||
          invoice.room.toLowerCase().includes(query)
        return statusMatch && textMatch
      })
  }, [bookings, invoiceSearch, invoiceStatusFilter])

  const paidTotal = bookings
    .filter((booking) => invoiceStatus(booking) === 'Paid')
    .reduce((total, booking) => total + parseAmount(booking.amount), 0)
  const unpaidTotal = bookings
    .filter((booking) => invoiceStatus(booking) === 'Unpaid')
    .reduce((total, booking) => total + parseAmount(booking.amount), 0)

>>>>>>> main
  const handleStatusChange = (bookingId: string, status: BookingRecord['status']) => {
    updateBookingStatus(bookingId, status)
    setBookings(readBookings())
  }

<<<<<<< HEAD
  return (
    <div className="admin-stack">
=======
  const persistBookings = (nextBookings: BookingRecord[]) => {
    setBookings(nextBookings)
    saveBookings(nextBookings)
  }

  const openAddBookingModal = () => {
    setActiveBooking(null)
    setIsBookingModalOpen(true)
  }

  const openEditBookingModal = (booking: BookingRecord) => {
    setActiveBooking(booking)
    setIsBookingModalOpen(true)
  }

  const closeBookingModal = () => {
    setActiveBooking(null)
    setIsBookingModalOpen(false)
  }

  const handleBookingSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const guest = String(formData.get('guest') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim().toLowerCase()
    const room = String(formData.get('room') ?? '').trim()
    const checkIn = String(formData.get('checkIn') ?? '')
    const checkOut = String(formData.get('checkOut') ?? '')
    const amountValue = Number(formData.get('amount') ?? 0)
    const status = String(formData.get('status') ?? 'Pending') as BookingRecord['status']

    if (!guest || !email || !room || !checkIn || !checkOut || amountValue <= 0) {
      return
    }

    const nextBooking: BookingRecord = {
      id: activeBooking?.id ?? createBookingId(),
      ownerEmail: email,
      guest,
      email,
      room,
      checkIn,
      checkOut,
      amount: `$${amountValue.toLocaleString()}`,
      status,
    }

    persistBookings(
      activeBooking
        ? bookings.map((booking) => (booking.id === activeBooking.id ? nextBooking : booking))
        : [nextBooking, ...bookings],
    )
    closeBookingModal()
  }

  const handleDeleteBooking = (booking: BookingRecord) => {
    const shouldDelete = window.confirm(`Delete booking #${booking.id}?`)
    if (!shouldDelete) {
      return
    }

    persistBookings(bookings.filter((item) => item.id !== booking.id))
  }

  return (
    <div className="admin-stack">
      <div className="metric-grid">
        <article className="metric-card">
          <span className="icon-tile">
            <Icon name="calendar" />
          </span>
          <p>Total Bookings</p>
          <strong>{bookings.length}</strong>
          <small>all reservations</small>
        </article>
        <article className="metric-card">
          <span className="icon-tile">
            <Icon name="check" />
          </span>
          <p>Confirmed</p>
          <strong>{bookings.filter((booking) => booking.status === 'Confirmed').length}</strong>
          <small>paid or approved</small>
        </article>
        <article className="metric-card">
          <span className="icon-tile">
            <Icon name="card" />
          </span>
          <p>Paid Revenue</p>
          <strong>${paidTotal.toLocaleString()}</strong>
          <small>confirmed invoices</small>
        </article>
        <article className="metric-card">
          <span className="icon-tile">
            <Icon name="bell" />
          </span>
          <p>Unpaid Amount</p>
          <strong>${unpaidTotal.toLocaleString()}</strong>
          <small>pending payment</small>
        </article>
      </div>

>>>>>>> main
      <section className="admin-panel">
        <div className="admin-panel-header">
          <div className="panel-title">
            <Icon name="calendar" />
            <span>Booking Management</span>
          </div>
<<<<<<< HEAD
=======
          <button className="primary-button compact" type="button" onClick={openAddBookingModal}>
            <Icon name="plus" />
            Add Booking
          </button>
>>>>>>> main
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
<<<<<<< HEAD
                <th>Amount</th>
                <th>Status</th>
=======
                <th>Check out</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Operation</th>
                <th>Actions</th>
>>>>>>> main
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
<<<<<<< HEAD
=======
                  <td>{booking.checkOut}</td>
>>>>>>> main
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
<<<<<<< HEAD
=======
                  <td>{getOperationalStatus(booking)}</td>
                  <td>
                    <div className="row-actions">
                      <button className="link-button" type="button" onClick={() => openEditBookingModal(booking)}>
                        Edit
                      </button>
                      <button className="link-button" type="button" onClick={() => handleDeleteBooking(booking)}>
                        Delete
                      </button>
                    </div>
                  </td>
>>>>>>> main
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
<<<<<<< HEAD
                  <td colSpan={7}>No bookings found for this filter.</td>
=======
                  <td colSpan={10}>No bookings found for this filter.</td>
>>>>>>> main
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
<<<<<<< HEAD
=======

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div className="panel-title">
            <Icon name="card" />
            <span>Invoice & Payment Management</span>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <label className="flex-1 min-w-[240px]">
            <input
              value={invoiceSearch}
              placeholder="Search invoice, booking, guest, room, or email..."
              onChange={(event) => setInvoiceSearch(event.target.value)}
            />
          </label>
          {(['All', 'Paid', 'Unpaid', 'Cancelled'] as const).map((status) => (
            <button
              key={status}
              className={`ghost-button compact ${invoiceStatusFilter === status ? 'border-slate-500 text-white' : ''}`}
              type="button"
              onClick={() => setInvoiceStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Booking</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => {
                const statusClass =
                  invoice.invoiceStatus === 'Paid'
                    ? 'success'
                    : invoice.invoiceStatus === 'Cancelled'
                      ? 'failed'
                      : 'pending'

                return (
                  <tr key={invoice.invoiceCode}>
                    <td>
                      <strong>{invoice.invoiceCode}</strong>
                    </td>
                    <td>#{invoice.id}</td>
                    <td>{invoice.guest}</td>
                    <td>{invoice.room}</td>
                    <td>{invoice.amount}</td>
                    <td>{invoice.invoiceStatus === 'Paid' ? 'Online / Bank transfer' : 'Awaiting payment'}</td>
                    <td>
                      <span className={`status-chip ${statusClass}`}>{invoice.invoiceStatus}</span>
                    </td>
                  </tr>
                )
              })}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={7}>No invoices found for this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isBookingModalOpen && (
        <div className="admin-modal-backdrop" role="presentation">
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-form-title"
          >
            <div className="admin-modal-header">
              <div>
                <p className="eyebrow">Reservation</p>
                <h2 id="booking-form-title">{activeBooking ? 'Edit Booking' : 'Add Booking'}</h2>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label="Close booking form"
                onClick={closeBookingModal}
              >
                <Icon name="close" />
              </button>
            </div>
            <form className="admin-room-form" onSubmit={handleBookingSubmit}>
              <label>
                Guest name
                <input name="guest" defaultValue={activeBooking?.guest} placeholder="Guest name" required />
              </label>
              <label>
                Email
                <input name="email" defaultValue={activeBooking?.email} placeholder="guest@email.com" required type="email" />
              </label>
              <label>
                Room
                <input name="room" defaultValue={activeBooking?.room} placeholder="Ocean View Suite" required />
              </label>
              <label>
                Amount
                <input
                  name="amount"
                  defaultValue={activeBooking ? parseAmount(activeBooking.amount) : ''}
                  min="1"
                  placeholder="450"
                  required
                  type="number"
                />
              </label>
              <label>
                Check in
                <input name="checkIn" defaultValue={activeBooking?.checkIn} required type="date" />
              </label>
              <label>
                Check out
                <input name="checkOut" defaultValue={activeBooking?.checkOut} required type="date" />
              </label>
              <label className="span-2">
                Status
                <select name="status" defaultValue={activeBooking?.status ?? 'Pending'}>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </label>
              <div className="admin-modal-actions span-2">
                <button className="ghost-button" type="button" onClick={closeBookingModal}>
                  Cancel
                </button>
                <button className="primary-button" type="submit">
                  <Icon name={activeBooking ? 'check' : 'plus'} />
                  {activeBooking ? 'Update Booking' : 'Save Booking'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
>>>>>>> main
    </div>
  )
}
