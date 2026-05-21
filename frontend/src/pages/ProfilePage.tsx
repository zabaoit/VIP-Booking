import { useMemo, useRef, useState, type FormEvent } from 'react'
import { Icon } from '../components/icons/Icon'
import { useAuth } from '../hooks/useAuth'
import type { Navigate } from '../types'
import { readBookingsByOwner } from '../utils/appStorage'
import { formatCurrency } from '../utils/currency'

const sidebarSections = [
  { id: 'profile-overview', label: 'Overview' },
  { id: 'profile-personal', label: 'Personal Information' },
  { id: 'profile-history', label: 'Booking History' },
  { id: 'profile-payment', label: 'Payments' },
  { id: 'profile-security', label: 'Security' },
] as const

const sectionCardClass =
  'rounded-2xl border border-slate-700/80 bg-slate-900/65 p-4 shadow-[0_24px_54px_rgba(2,8,23,0.45)] backdrop-blur'
const inputClass =
  'mt-1 h-11 w-full rounded-lg border border-slate-700 bg-slate-950/90 px-3 text-sm text-slate-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20'

type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled'

type ProfileBooking = {
  id: string
  room: string
  stay: string
  amount: string
  method: string
  status: BookingStatus
}

export function ProfilePage({ navigate }: { navigate: Navigate }) {
  const { changePassword, logout, user } = useAuth()
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [profileMessage, setProfileMessage] = useState('')
  const [paymentMessage, setPaymentMessage] = useState('')
  const [paymentMethod, setPaymentMethod] = useState(
    () => window.localStorage.getItem('vip-booking:preferred-payment') ?? 'vietqr',
  )
  const [bookingSearch, setBookingSearch] = useState('')
  const [bookingStatusFilter, setBookingStatusFilter] = useState<
    'all' | 'pending' | 'confirmed' | 'cancelled'
  >('all')
  const [bookingSort, setBookingSort] = useState<'latest' | 'oldest'>('latest')
  const profileMainRef = useRef<HTMLDivElement>(null)

  const memberCode = `VIP-${String((user?.email ?? 'guest@vipbooking.vn').length * 173).slice(0, 4)}`

  const handleSaveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setProfileMessage('Personal information saved successfully.')
  }

  const handleChangePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const currentPassword = String(formData.get('currentPassword') ?? '')
    const nextPassword = String(formData.get('nextPassword') ?? '')
    const confirmPassword = String(formData.get('confirmPassword') ?? '')

    if (!currentPassword || !nextPassword || !confirmPassword) {
      setPasswordError('Please complete all required fields.')
      setPasswordMessage('')
      return
    }

    if (nextPassword !== confirmPassword) {
      setPasswordError('Password confirmation does not match.')
      setPasswordMessage('')
      return
    }

    if (!changePassword(currentPassword, nextPassword)) {
      setPasswordError('Current password is incorrect.')
      setPasswordMessage('')
      return
    }

    setPasswordError('')
    setPasswordMessage('Password updated successfully. Please use the new password next time you sign in.')
    event.currentTarget.reset()
  }

  const scrollToProfileSection = (sectionId: string) => {
    const root = profileMainRef.current
    if (!root) {
      return
    }

    const section = root.querySelector<HTMLElement>(`#${sectionId}`)
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const bookings = useMemo<ProfileBooking[]>(() => {
    const storageBookings = readBookingsByOwner(user?.email ?? '')

    return storageBookings.map((booking) => ({
      id: booking.id.startsWith('#') ? booking.id : `#${booking.id}`,
      room: booking.room,
      stay: `${booking.checkIn} - ${booking.checkOut}`,
      amount: booking.amount,
      method: paymentMethod === 'momo' ? 'MoMo' : paymentMethod === 'card' ? 'Credit Card' : 'VietQR',
      status:
        booking.status === 'Cancelled'
          ? 'Cancelled'
          : booking.status === 'Pending'
            ? 'Pending'
            : 'Confirmed',
    }))
  }, [paymentMethod, user?.email])

  const filteredBookings = useMemo<ProfileBooking[]>(() => {
    const query = bookingSearch.trim().toLowerCase()
    const filtered = bookings.filter((booking) => {
      const statusMatch =
        bookingStatusFilter === 'all' ||
        (bookingStatusFilter === 'pending' && booking.status === 'Pending') ||
        (bookingStatusFilter === 'confirmed' && booking.status === 'Confirmed') ||
        (bookingStatusFilter === 'cancelled' && booking.status === 'Cancelled')

      if (!statusMatch) {
        return false
      }

      if (!query) {
        return true
      }

      return (
        booking.id.toLowerCase().includes(query) ||
        booking.room.toLowerCase().includes(query) ||
        booking.stay.toLowerCase().includes(query)
      )
    })

    return [...filtered].sort((a, b) =>
      bookingSort === 'latest' ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id),
    )
  }, [bookingSearch, bookingSort, bookingStatusFilter, bookings])

  const handleSavePaymentMethod = () => {
    window.localStorage.setItem('vip-booking:preferred-payment', paymentMethod)
    setPaymentMessage('Preferred payment method updated successfully.')
  }

  const handlePayCurrentBooking = () => {
    window.localStorage.setItem('vip-booking:preferred-payment', paymentMethod)
    navigate('payment')
  }

  const statusColor: Record<BookingStatus, string> = {
    Pending: 'text-amber-300',
    Confirmed: 'text-emerald-400',
    Cancelled: 'text-rose-400',
  }

  const confirmedBookings = bookings.filter((booking) => booking.status === 'Confirmed').length
  const pendingBookings = bookings.filter((booking) => booking.status === 'Pending').length
  const paymentMethodLabel =
    paymentMethod === 'momo' ? 'MoMo' : paymentMethod === 'card' ? 'Credit Card' : 'VietQR'
  const totalSpent = bookings.reduce((total, booking) => {
    const value = Number(booking.amount.replace(/[^0-9.]/g, '')) || 0
    return total + value
  }, 0)

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute -left-40 top-16 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

      <section className="relative mx-auto grid w-full max-w-[1260px] grid-cols-1 gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-slate-700/80 bg-slate-900/70 p-4 shadow-[0_20px_48px_rgba(2,8,23,0.45)] backdrop-blur lg:sticky lg:top-24">
          <div className="rounded-xl border border-slate-700/80 bg-slate-950/80 p-4">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-blue-300/40 bg-gradient-to-b from-cyan-300 to-blue-600 text-white">
              <Icon name="user" size={22} />
            </div>
            <p className="text-sm font-semibold text-white">VIP Guest</p>
            <p className="mt-1 text-xs text-slate-300">{user?.email ?? 'guest@vipbooking.vn'}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-amber-300">
              Guest Account
            </p>
          </div>

          <div className="mt-4 grid gap-2">
            {sidebarSections.map((section) => (
              <button
                className="h-10 rounded-lg border border-slate-700 bg-slate-900/80 px-3 text-left text-sm font-medium text-slate-200 transition hover:border-blue-400 hover:text-white"
                key={section.id}
                type="button"
                onClick={() => scrollToProfileSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </div>

          <button
            className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg border border-amber-300/35 bg-gradient-to-b from-amber-500/20 to-slate-900 text-sm font-semibold text-amber-200 transition hover:border-amber-300"
            type="button"
            onClick={() => navigate('rooms')}
          >
            Book Now
          </button>
          <button
            className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-lg border border-slate-600 bg-slate-900/80 text-sm font-semibold text-slate-200 transition hover:border-blue-400"
            type="button"
            onClick={() => {
              logout()
              navigate('home')
            }}
          >
            Logout
          </button>
        </aside>

        <div className="space-y-5" ref={profileMainRef}>
          <section className="rounded-2xl border border-slate-700/80 bg-gradient-to-r from-slate-900/85 via-slate-900/70 to-blue-950/55 p-5 shadow-[0_24px_60px_rgba(2,8,23,0.5)] backdrop-blur">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Guest Profile</p>
                <h1 className="mt-1 text-4xl font-semibold text-white sm:text-5xl">Account Profile</h1>
                <p className="mt-2 text-sm text-slate-300">Manage your bookings, payments, and account security in one premium workspace.</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-amber-300/35 bg-amber-300/10 px-4 text-sm font-semibold text-amber-200 transition hover:border-amber-200"
                  type="button"
                  onClick={() => navigate('rooms')}
                >
                  Book Now
                </button>
                <button
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-600 bg-slate-900/80 px-4 text-sm font-semibold text-slate-200 transition hover:border-blue-400"
                  type="button"
                  onClick={() => navigate('home')}
                >
                  Back to Home
                </button>
              </div>
            </div>
          </section>

          <section className={sectionCardClass} id="profile-overview">
            <div className="grid gap-3 xl:grid-cols-[1.5fr_1fr]">
              <div className="rounded-xl border border-slate-700 bg-slate-950/75 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-blue-300/45 bg-gradient-to-b from-cyan-300 to-blue-600 text-white">
                    <Icon name="user" size={24} />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">VIP Guest</p>
                    <p className="text-sm text-slate-300">{user?.email ?? 'guest@vipbooking.vn'}</p>
                    <p className="text-xs font-semibold uppercase text-amber-300">Member: {memberCode}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <article className="rounded-xl border border-slate-700 bg-slate-950/70 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Total Bookings</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{bookings.length}</p>
                </article>
                <article className="rounded-xl border border-slate-700 bg-slate-950/70 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Confirmed</p>
                  <p className="mt-2 text-2xl font-semibold text-emerald-300">{confirmedBookings}</p>
                </article>
                <article className="rounded-xl border border-slate-700 bg-slate-950/70 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Pending</p>
                  <p className="mt-2 text-2xl font-semibold text-amber-300">{pendingBookings}</p>
                </article>
                <article className="rounded-xl border border-slate-700 bg-slate-950/70 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Total Spending</p>
                  <p className="mt-2 text-lg font-semibold text-white">{formatCurrency(totalSpent)}</p>
                </article>
              </div>
            </div>
          </section>

          <section className={sectionCardClass} id="profile-personal">
            <h2 className="mb-3 text-lg font-semibold text-white">Personal Information</h2>
            <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={handleSaveProfile}>
              <label className="text-xs font-medium text-slate-300">
                Full Name
                <input className={inputClass} defaultValue="VIP Guest" />
              </label>
              <label className="text-xs font-medium text-slate-300">
                Phone Number
                <input className={inputClass} defaultValue="+84 901 123 456" />
              </label>
              <label className="text-xs font-medium text-slate-300">
                Address
                <input className={inputClass} defaultValue="12 Nguyen Hue" />
              </label>
              <label className="text-xs font-medium text-slate-300">
                City
                <input className={inputClass} defaultValue="Ho Chi Minh City" />
              </label>
              <label className="text-xs font-medium text-slate-300 md:col-span-2">
                Stay Notes
                <textarea
                  className="mt-1 h-28 w-full rounded-lg border border-slate-700 bg-slate-950/90 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  defaultValue="Yeu cau phong yen tinh, check-in nhanh."
                />
              </label>
              {profileMessage && <p className="text-sm font-medium text-emerald-300 md:col-span-2">{profileMessage}</p>}
              <div className="md:col-span-2">
                <button
                  className="ml-auto inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-b from-blue-400 to-blue-600 px-5 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(37,99,235,0.35)] transition hover:brightness-110"
                  type="submit"
                >
                  Save Information
                </button>
              </div>
            </form>
          </section>

          <section className={sectionCardClass} id="profile-history">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Booking History</h2>
              <button
                className="text-sm font-semibold text-blue-300 transition hover:text-blue-200"
                type="button"
                onClick={() => navigate('rooms')}
              >
                New Booking
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.6fr_1fr_1fr]">
              <input
                className={inputClass}
                value={bookingSearch}
                placeholder="Booking ID, room name, stay dates..."
                onChange={(event) => setBookingSearch(event.target.value)}
              />
              <select
                className={inputClass}
                value={bookingStatusFilter}
                onChange={(event) =>
                  setBookingStatusFilter(event.target.value as 'all' | 'pending' | 'confirmed' | 'cancelled')
                }
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                className={inputClass}
                value={bookingSort}
                onChange={(event) => setBookingSort(event.target.value as 'latest' | 'oldest')}
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-700 bg-slate-950/70">
              <div className="min-w-[780px]">
                <div className="grid grid-cols-[1fr_1.4fr_1.6fr_1fr_1fr_1fr] border-b border-slate-700 bg-slate-900/80 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  <span>Booking ID</span>
                  <span>Room</span>
                  <span>Stay</span>
                  <span>Total</span>
                  <span>Payment</span>
                  <span>Status</span>
                </div>
                {filteredBookings.map((booking) => (
                  <div
                    className="grid grid-cols-[1fr_1.4fr_1.6fr_1fr_1fr_1fr] border-b border-slate-800 px-3 py-2 text-sm text-slate-200 last:border-b-0"
                    key={booking.id}
                  >
                    <span>{booking.id}</span>
                    <span>{booking.room}</span>
                    <span>{booking.stay}</span>
                    <span>{booking.amount}</span>
                    <span>{booking.method}</span>
                    <span className={`font-semibold ${statusColor[booking.status]}`}>{booking.status}</span>
                  </div>
                ))}
                {filteredBookings.length === 0 && (
                  <p className="px-3 py-4 text-sm text-slate-300">No bookings found for this account yet.</p>
                )}
              </div>
            </div>
          </section>

          <section className={sectionCardClass} id="profile-payment">
            <h2 className="mb-3 text-lg font-semibold text-white">Payment Information</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <article className="rounded-xl border border-slate-700 bg-slate-950/70 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Preferred Method</p>
                <p className="mt-2 text-base font-semibold text-white">{paymentMethodLabel}</p>
              </article>
              <article className="rounded-xl border border-slate-700 bg-slate-950/70 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Pending Payments</p>
                <p className="mt-2 text-base font-semibold text-white">{pendingBookings} booking</p>
              </article>
            </div>

            <label className="mt-3 block text-xs font-medium text-slate-300">
              Preferred Method
              <select
                className={inputClass}
                value={paymentMethod}
                onChange={(event) => {
                  setPaymentMethod(event.target.value)
                  setPaymentMessage('')
                }}
              >
                <option value="vietqr">VietQR</option>
                <option value="momo">MoMo</option>
                <option value="card">Credit Card</option>
              </select>
            </label>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="inline-flex h-10 items-center justify-center rounded-lg border border-amber-300/35 bg-amber-300/10 px-4 text-sm font-semibold text-amber-200 transition hover:border-amber-200"
                type="button"
                onClick={handleSavePaymentMethod}
              >
                Save Preferred Method
              </button>
              <button
                className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-b from-blue-400 to-blue-600 px-4 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(37,99,235,0.35)] transition hover:brightness-110"
                type="button"
                onClick={handlePayCurrentBooking}
              >
                Pay Current Booking
              </button>
              <button
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-600 bg-slate-900/80 px-4 text-sm font-semibold text-slate-200 transition hover:border-blue-400"
                type="button"
                onClick={() => navigate('rooms')}
              >
                Book Room
              </button>
            </div>
            {paymentMessage && <p className="mt-2 text-sm font-medium text-emerald-300">{paymentMessage}</p>}
          </section>

          <section className={sectionCardClass} id="profile-security">
            <h2 className="mb-3 text-lg font-semibold text-white">Change Password</h2>
            <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={handleChangePassword}>
              <label className="text-xs font-medium text-slate-300 md:col-span-2">
                Current Password
                <input className={inputClass} name="currentPassword" type="password" required />
              </label>
              <label className="text-xs font-medium text-slate-300">
                New Password
                <input className={inputClass} name="nextPassword" type="password" required />
              </label>
              <label className="text-xs font-medium text-slate-300">
                Confirm New Password
                <input className={inputClass} name="confirmPassword" type="password" required />
              </label>

              {passwordError && <p className="text-sm font-medium text-rose-300 md:col-span-2">{passwordError}</p>}
              {passwordMessage && <p className="text-sm font-medium text-emerald-300 md:col-span-2">{passwordMessage}</p>}

              <div className="md:col-span-2">
                <button
                  className="ml-auto inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-b from-blue-400 to-blue-600 px-5 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(37,99,235,0.35)] transition hover:brightness-110"
                  type="submit"
                >
                  Save Password
                </button>
              </div>
            </form>
          </section>
        </div>
      </section>
    </main>
  )
}
