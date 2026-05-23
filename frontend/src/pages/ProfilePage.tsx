import { useMemo, useState, type FormEvent } from 'react'
import heroImage from '../assets/hero.png'
import { Icon } from '../components/icons/Icon'
import { useAuth } from '../hooks/useAuth'
import type { Navigate } from '../types'
import {
  readBookingsByOwner,
  readCustomerProfiles,
  saveCustomerProfiles,
  setActiveBookingId,
} from '../utils/appStorage'
import { formatCurrency } from '../utils/currency'

const sidebarSections = [
  { id: 'profile-overview', label: 'Overview', hint: 'Membership summary', icon: 'dashboard' },
  { id: 'profile-personal', label: 'Personal Information', hint: 'Profile details', icon: 'user' },
  { id: 'profile-history', label: 'Booking History', hint: 'Reservation timeline', icon: 'calendar' },
  { id: 'profile-payment', label: 'Payments', hint: 'Wallet and billing', icon: 'card' },
  { id: 'profile-security', label: 'Security', hint: 'Password and sessions', icon: 'shield' },
] as const

const panelClass =
  'rounded-2xl border border-slate-700/80 bg-slate-900/75 p-5 shadow-[0_16px_40px_rgba(2,6,23,0.45)] backdrop-blur'
const inputClass =
  'mt-1 h-11 w-full rounded-lg border border-slate-700 bg-slate-950/90 px-3 text-sm text-slate-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20'
const textareaClass =
  'mt-1 h-24 w-full rounded-lg border border-slate-700 bg-slate-950/90 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20'

type ProfileSectionId = (typeof sidebarSections)[number]['id']
type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled'

type ProfileBooking = {
  id: string
  room: string
  stay: string
  amount: string
  method: string
  status: BookingStatus
}

type ProfileSettings = {
  fullName: string
  phoneNumber: string
  address: string
  city: string
  stayNotes: string
  emailUpdates: boolean
  smsAlerts: boolean
}

const profileSettingsStorageKey = 'vip-booking:profile-settings'
const defaultProfileSettings: Omit<ProfileSettings, 'fullName'> = {
  phoneNumber: '+84 901 123 456',
  address: '12 Nguyen Hue',
  city: 'Ho Chi Minh City',
  stayNotes: 'Quiet room, high floor, fast check-in preferred.',
  emailUpdates: true,
  smsAlerts: false,
}

function toDisplayName(email: string) {
  const namePart = email.split('@')[0] || 'VIP Guest'
  return namePart
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ')
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function ProfilePage({ navigate }: { navigate: Navigate }) {
  const { changePassword, logout, user } = useAuth()
  const [activeSection, setActiveSection] = useState<ProfileSectionId>('profile-overview')
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

  const userEmail = user?.email ?? 'guest@vipbooking.vn'
  const [customerProfiles, setCustomerProfiles] = useState(() => readCustomerProfiles())
  const customerProfile = useMemo(
    () => customerProfiles.find((profile) => normalizeEmail(profile.email) === normalizeEmail(userEmail)),
    [customerProfiles, userEmail],
  )

  const [profileSettings, setProfileSettings] = useState<ProfileSettings>(() => {
    const fallbackName = customerProfile?.name || toDisplayName(userEmail)
    const rawStoredSettings = window.localStorage.getItem(profileSettingsStorageKey)
    let savedSettings: Partial<ProfileSettings> = {}

    if (rawStoredSettings) {
      try {
        const parsed = JSON.parse(rawStoredSettings) as Record<string, Partial<ProfileSettings>>
        savedSettings = parsed[normalizeEmail(userEmail)] ?? {}
      } catch {
        savedSettings = {}
      }
    }

    return {
      fullName: fallbackName,
      phoneNumber: customerProfile?.phone ?? defaultProfileSettings.phoneNumber,
      address: customerProfile?.address ?? defaultProfileSettings.address,
      city: defaultProfileSettings.city,
      stayNotes: defaultProfileSettings.stayNotes,
      emailUpdates: defaultProfileSettings.emailUpdates,
      smsAlerts: defaultProfileSettings.smsAlerts,
      ...savedSettings,
    }
  })

  const displayName = profileSettings.fullName || toDisplayName(userEmail)
  const memberCode = `VIP-${String(userEmail.length * 173).slice(0, 4)}`

  const bookings = useMemo<ProfileBooking[]>(() => {
    const storageBookings = readBookingsByOwner(userEmail)
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
  }, [paymentMethod, userEmail])

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

  const confirmedBookings = bookings.filter((booking) => booking.status === 'Confirmed').length
  const pendingBookings = bookings.filter((booking) => booking.status === 'Pending').length
  const paymentMethodLabel =
    paymentMethod === 'momo' ? 'MoMo' : paymentMethod === 'card' ? 'Credit Card' : 'VietQR'
  const totalSpent = bookings.reduce((total, booking) => {
    const value = Number(booking.amount.replace(/[^0-9.]/g, '')) || 0
    return total + value
  }, 0)

  const loyaltyPoints = Math.max(850, confirmedBookings * 500 + pendingBookings * 180)
  const tierName = loyaltyPoints >= 5000 ? 'Diamond Elite' : loyaltyPoints >= 2500 ? 'Platinum' : 'Gold'
  const upcomingBooking = bookings.find((booking) => booking.status !== 'Cancelled')

  const persistProfileSettings = (nextSettings: ProfileSettings) => {
    const rawStoredSettings = window.localStorage.getItem(profileSettingsStorageKey)
    let settingsByUser: Record<string, ProfileSettings> = {}

    if (rawStoredSettings) {
      try {
        settingsByUser = JSON.parse(rawStoredSettings) as Record<string, ProfileSettings>
      } catch {
        settingsByUser = {}
      }
    }

    settingsByUser[normalizeEmail(userEmail)] = nextSettings
    window.localStorage.setItem(profileSettingsStorageKey, JSON.stringify(settingsByUser))
  }

  const handleSaveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    persistProfileSettings(profileSettings)

    const matchedProfile = customerProfiles.find(
      (profile) => normalizeEmail(profile.email) === normalizeEmail(userEmail),
    )
    const nextProfile = {
      id: matchedProfile?.id ?? `CUS-${String(userEmail.length * 173).padStart(4, '0').slice(0, 4)}`,
      email: userEmail,
      name: profileSettings.fullName.trim() || toDisplayName(userEmail),
      phone: profileSettings.phoneNumber.trim() || defaultProfileSettings.phoneNumber,
      address: profileSettings.address.trim() || defaultProfileSettings.address,
      status: matchedProfile?.status ?? 'Active',
      tier: matchedProfile?.tier ?? 'Standard',
    }
    const nextProfiles = matchedProfile
      ? customerProfiles.map((profile) =>
          normalizeEmail(profile.email) === normalizeEmail(userEmail) ? nextProfile : profile,
        )
      : [nextProfile, ...customerProfiles]

    saveCustomerProfiles(nextProfiles)
    setCustomerProfiles(nextProfiles)
    setProfileMessage('Personal information has been saved successfully.')
  }

  const handleSavePaymentMethod = () => {
    window.localStorage.setItem('vip-booking:preferred-payment', paymentMethod)
    setPaymentMessage('Preferred payment method updated successfully.')
  }

  const handlePayCurrentBooking = () => {
    window.localStorage.setItem('vip-booking:preferred-payment', paymentMethod)
    const pendingBooking = bookings.find((booking) => booking.status === 'Pending')
    if (pendingBooking) {
      setActiveBookingId(pendingBooking.id)
      setPaymentMessage('')
      navigate('payment')
      return
    }

    setPaymentMessage('No pending booking found. Please create a booking first.')
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
    setPasswordMessage('Password updated successfully.')
    event.currentTarget.reset()
  }

  const sectionHeader = (title: string, subtitle: string) => (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
    </div>
  )

  const renderOverview = () => (
    <section className={panelClass}>
      {sectionHeader('Membership Overview', 'Your premium status and next reservation at a glance.')}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-xl border border-slate-700 bg-slate-950/75 p-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Tier</p>
          <p className="mt-2 text-lg font-semibold text-amber-200">{tierName}</p>
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-950/75 p-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Confirmed Stays</p>
          <p className="mt-2 text-lg font-semibold text-emerald-300">{confirmedBookings}</p>
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-950/75 p-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Total Spend</p>
          <p className="mt-2 text-lg font-semibold text-white">{formatCurrency(totalSpent)}</p>
        </article>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-700 bg-slate-950/75 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">Upcoming Stay</h3>
          {upcomingBooking ? (
            <div className="mt-3">
              <p className="text-base font-semibold text-white">{upcomingBooking.room}</p>
              <p className="mt-1 text-sm text-slate-300">{upcomingBooking.stay}</p>
              <p className="mt-1 text-xs text-slate-400">Booking: {upcomingBooking.id}</p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-300">No upcoming booking yet.</p>
          )}
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-950/75 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">Concierge</h3>
          <p className="mt-3 text-sm text-slate-300">
            Dedicated support is active for airport transfer, late check-out, and in-room arrangements.
          </p>
          <button
            className="mt-3 inline-flex h-9 items-center justify-center rounded-lg border border-amber-300/35 bg-amber-300/10 px-4 text-sm font-semibold text-amber-200 transition hover:border-amber-200"
            type="button"
            onClick={() => navigate('contact')}
          >
            Contact Concierge
          </button>
        </article>
      </div>
    </section>
  )

  const renderPersonal = () => (
    <section className={panelClass}>
      {sectionHeader('Personal Information', 'Manage identity details and in-stay preferences.')}
      <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={handleSaveProfile}>
        <label className="text-xs font-medium text-slate-300">
          Full Name
          <input
            className={inputClass}
            value={profileSettings.fullName}
            onChange={(event) =>
              setProfileSettings((previous) => ({ ...previous, fullName: event.target.value }))
            }
          />
        </label>
        <label className="text-xs font-medium text-slate-300">
          Phone Number
          <input
            className={inputClass}
            value={profileSettings.phoneNumber}
            onChange={(event) =>
              setProfileSettings((previous) => ({ ...previous, phoneNumber: event.target.value }))
            }
          />
        </label>
        <label className="text-xs font-medium text-slate-300">
          Address
          <input
            className={inputClass}
            value={profileSettings.address}
            onChange={(event) =>
              setProfileSettings((previous) => ({ ...previous, address: event.target.value }))
            }
          />
        </label>
        <label className="text-xs font-medium text-slate-300">
          City
          <input
            className={inputClass}
            value={profileSettings.city}
            onChange={(event) =>
              setProfileSettings((previous) => ({ ...previous, city: event.target.value }))
            }
          />
        </label>
        <label className="text-xs font-medium text-slate-300 md:col-span-2">
          Stay Notes
          <textarea
            className={textareaClass}
            value={profileSettings.stayNotes}
            onChange={(event) =>
              setProfileSettings((previous) => ({ ...previous, stayNotes: event.target.value }))
            }
          />
        </label>
        <div className="rounded-xl border border-slate-700 bg-slate-950/75 p-3 md:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Notifications</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input
                checked={profileSettings.emailUpdates}
                type="checkbox"
                onChange={(event) =>
                  setProfileSettings((previous) => ({ ...previous, emailUpdates: event.target.checked }))
                }
              />
              Email updates
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input
                checked={profileSettings.smsAlerts}
                type="checkbox"
                onChange={(event) =>
                  setProfileSettings((previous) => ({ ...previous, smsAlerts: event.target.checked }))
                }
              />
              SMS reminders
            </label>
          </div>
        </div>
        {profileMessage && <p className="text-sm font-medium text-emerald-300 md:col-span-2">{profileMessage}</p>}
        <div className="md:col-span-2">
          <button
            className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 px-5 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(37,99,235,0.35)] transition hover:brightness-110"
            type="submit"
          >
            Save Information
          </button>
        </div>
      </form>
    </section>
  )

  const renderHistory = () => (
    <section className={panelClass}>
      {sectionHeader('Booking History', 'Search and review all your reservations.')}
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
          <option value="all">All status</option>
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

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-700 bg-slate-950/75">
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
              <span className={booking.status === 'Confirmed' ? 'text-emerald-300' : booking.status === 'Pending' ? 'text-amber-300' : 'text-rose-300'}>
                {booking.status}
              </span>
            </div>
          ))}
          {filteredBookings.length === 0 && (
            <p className="px-3 py-4 text-sm text-slate-300">No bookings found for this account yet.</p>
          )}
        </div>
      </div>
    </section>
  )

  const renderPayment = () => (
    <section className={panelClass}>
      {sectionHeader('Payments', 'Control your preferred payment method and billing details.')}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <article className="rounded-xl border border-slate-700 bg-slate-950/75 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-400">Preferred Method</p>
          <p className="mt-2 text-base font-semibold text-white">{paymentMethodLabel}</p>
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-950/75 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-400">Pending Payments</p>
          <p className="mt-2 text-base font-semibold text-white">{pendingBookings} booking</p>
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-950/75 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-400">Member ID</p>
          <p className="mt-2 text-base font-semibold text-amber-200">{memberCode}</p>
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
          className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 px-4 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(37,99,235,0.35)] transition hover:brightness-110"
          type="button"
          onClick={handlePayCurrentBooking}
        >
          Pay Current Booking
        </button>
      </div>
      {paymentMessage && <p className="mt-2 text-sm font-medium text-emerald-300">{paymentMessage}</p>}
    </section>
  )

  const renderSecurity = () => (
    <section className={panelClass}>
      {sectionHeader('Security', 'Protect your account credentials and active sessions.')}

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
            className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 px-5 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(37,99,235,0.35)] transition hover:brightness-110"
            type="submit"
          >
            Update Password
          </button>
        </div>
      </form>
    </section>
  )

  const renderActiveSection = () => {
    if (activeSection === 'profile-overview') return renderOverview()
    if (activeSection === 'profile-personal') return renderPersonal()
    if (activeSection === 'profile-history') return renderHistory()
    if (activeSection === 'profile-payment') return renderPayment()
    return renderSecurity()
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060e1f] px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.22),transparent_35%),radial-gradient(circle_at_85%_75%,rgba(245,158,11,0.1),transparent_35%)]" />

      <section className="relative mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-slate-700/80 bg-slate-900/80 p-4 shadow-[0_20px_48px_rgba(2,8,23,0.45)] backdrop-blur lg:sticky lg:top-24">
          <div className="rounded-xl border border-slate-700 bg-slate-950/80 p-4">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-blue-300/45 bg-gradient-to-b from-cyan-300 to-blue-600 text-white">
              <Icon name="user" size={22} />
            </div>
            <p className="text-sm font-semibold text-white">{displayName}</p>
            <p className="mt-1 text-xs text-slate-300">{userEmail}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-amber-300">{tierName}</p>
          </div>

          <div className="mt-4 grid gap-2">
            {sidebarSections.map((section) => {
              const isActive = activeSection === section.id
              return (
                <button
                  className={`rounded-lg border px-3 py-2 text-left transition ${
                    isActive
                      ? 'border-blue-400 bg-blue-500/15 text-white'
                      : 'border-slate-700 bg-slate-900/80 text-slate-200 hover:border-blue-400 hover:text-white'
                  }`}
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                >
                  <div className="flex items-center gap-2">
                    <Icon name={section.icon} size={15} />
                    <span className="text-sm font-medium">{section.label}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">{section.hint}</p>
                </button>
              )
            })}
          </div>

          <button
            className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg border border-amber-300/35 bg-gradient-to-r from-amber-400/20 to-slate-900 text-sm font-semibold text-amber-200 transition hover:border-amber-300"
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

        <div className="space-y-5">
          <section className="overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/75 shadow-[0_24px_60px_rgba(2,8,23,0.5)] backdrop-blur">
            <div className="relative h-52 sm:h-60">
              <img className="h-full w-full object-cover" src={heroImage} alt="Luxury profile header" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/55" />
              <div className="absolute inset-0 p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">VIP Booking</p>
                <h1 className="mt-2 max-w-[520px] text-3xl font-semibold leading-tight text-white sm:text-4xl">
                  Experience Premium Hospitality
                </h1>
                <p className="mt-2 max-w-[580px] text-sm text-slate-200">
                  Manage your bookings, profile, payments, and account protection in one elite workspace.
                </p>
              </div>
            </div>
            <div className="grid gap-2 border-t border-slate-700/70 bg-slate-900/90 p-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-300">
                <span className="block text-[11px] uppercase tracking-wide text-slate-500">Member</span>
                <span className="mt-1 block font-semibold text-white">{memberCode}</span>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-300">
                <span className="block text-[11px] uppercase tracking-wide text-slate-500">Preferred Payment</span>
                <span className="mt-1 block font-semibold text-white">{paymentMethodLabel}</span>
              </div>
            </div>
          </section>

          {renderActiveSection()}
        </div>
      </section>
    </main>
  )
}
