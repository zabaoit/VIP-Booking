import { useMemo, useState, type FormEvent } from 'react'
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

const panelClass = 'profile-panel'
const inputClass = 'profile-input'
const textareaClass = 'profile-input profile-textarea'

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
    <div className="profile-section-header">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  )

  const renderOverview = () => (
    <section className={panelClass}>
      {sectionHeader('Membership Overview', 'Your premium status and next reservation at a glance.')}

      <div className="profile-stat-grid">
        <article className="profile-stat-card">
          <p>Tier</p>
          <strong>{tierName}</strong>
        </article>
        <article className="profile-stat-card success">
          <p>Confirmed Stays</p>
          <strong>{confirmedBookings}</strong>
        </article>
        <article className="profile-stat-card">
          <p>Total Spend</p>
          <strong>{formatCurrency(totalSpent)}</strong>
        </article>
      </div>

      <div className="profile-detail-grid">
        <article className="profile-mini-card">
          <h3>Upcoming Stay</h3>
          {upcomingBooking ? (
            <div>
              <strong>{upcomingBooking.room}</strong>
              <p>{upcomingBooking.stay}</p>
              <small>Booking: {upcomingBooking.id}</small>
            </div>
          ) : (
            <p>No upcoming booking yet.</p>
          )}
        </article>
        <article className="profile-mini-card">
          <h3>Concierge</h3>
          <p>
            Dedicated support is active for airport transfer, late check-out, and in-room arrangements.
          </p>
          <button
            className="secondary-button compact"
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
      <form className="profile-form-grid" onSubmit={handleSaveProfile}>
        <label>
          Full Name
          <input
            className={inputClass}
            value={profileSettings.fullName}
            onChange={(event) =>
              setProfileSettings((previous) => ({ ...previous, fullName: event.target.value }))
            }
          />
        </label>
        <label>
          Phone Number
          <input
            className={inputClass}
            value={profileSettings.phoneNumber}
            onChange={(event) =>
              setProfileSettings((previous) => ({ ...previous, phoneNumber: event.target.value }))
            }
          />
        </label>
        <label>
          Address
          <input
            className={inputClass}
            value={profileSettings.address}
            onChange={(event) =>
              setProfileSettings((previous) => ({ ...previous, address: event.target.value }))
            }
          />
        </label>
        <label>
          City
          <input
            className={inputClass}
            value={profileSettings.city}
            onChange={(event) =>
              setProfileSettings((previous) => ({ ...previous, city: event.target.value }))
            }
          />
        </label>
        <label className="profile-span-2">
          Stay Notes
          <textarea
            className={textareaClass}
            value={profileSettings.stayNotes}
            onChange={(event) =>
              setProfileSettings((previous) => ({ ...previous, stayNotes: event.target.value }))
            }
          />
        </label>
        <div className="profile-notification-card profile-span-2">
          <p>Notifications</p>
          <div className="profile-checkbox-grid">
            <label className="check-row">
              <input
                checked={profileSettings.emailUpdates}
                type="checkbox"
                onChange={(event) =>
                  setProfileSettings((previous) => ({ ...previous, emailUpdates: event.target.checked }))
                }
              />
              Email updates
            </label>
            <label className="check-row">
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
        {profileMessage && <p className="form-success profile-span-2">{profileMessage}</p>}
        <div className="profile-span-2">
          <button
            className="primary-button"
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
      <div className="profile-filter-grid">
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

      <div className="profile-table-shell">
        <div className="profile-booking-table">
          <div className="profile-booking-row profile-booking-head">
            <span>Booking ID</span>
            <span>Room</span>
            <span>Stay</span>
            <span>Total</span>
            <span>Payment</span>
            <span>Status</span>
          </div>
          {filteredBookings.map((booking) => (
            <div
              className="profile-booking-row"
              key={booking.id}
            >
              <span>{booking.id}</span>
              <span>{booking.room}</span>
              <span>{booking.stay}</span>
              <span>{booking.amount}</span>
              <span>{booking.method}</span>
              <span
                className={
                  booking.status === 'Confirmed'
                    ? 'profile-status success'
                    : booking.status === 'Pending'
                      ? 'profile-status pending'
                      : 'profile-status failed'
                }
              >
                {booking.status}
              </span>
            </div>
          ))}
          {filteredBookings.length === 0 && (
            <p className="profile-empty-state">No bookings found for this account yet.</p>
          )}
        </div>
      </div>
    </section>
  )

  const renderPayment = () => (
    <section className={panelClass}>
      {sectionHeader('Payments', 'Control your preferred payment method and billing details.')}
      <div className="profile-stat-grid">
        <article className="profile-stat-card">
          <p>Preferred Method</p>
          <strong>{paymentMethodLabel}</strong>
        </article>
        <article className="profile-stat-card">
          <p>Pending Payments</p>
          <strong>{pendingBookings} booking</strong>
        </article>
        <article className="profile-stat-card">
          <p>Member ID</p>
          <strong>{memberCode}</strong>
        </article>
      </div>

      <label className="profile-field-block">
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

      <div className="profile-actions-row">
        <button
          className="secondary-button"
          type="button"
          onClick={handleSavePaymentMethod}
        >
          Save Preferred Method
        </button>
        <button
          className="primary-button"
          type="button"
          onClick={handlePayCurrentBooking}
        >
          Pay Current Booking
        </button>
      </div>
      {paymentMessage && <p className="form-success">{paymentMessage}</p>}
    </section>
  )

  const renderSecurity = () => (
    <section className={panelClass}>
      {sectionHeader('Security', 'Protect your account credentials and active sessions.')}

      <form className="profile-form-grid" onSubmit={handleChangePassword}>
        <label className="profile-span-2">
          Current Password
          <input className={inputClass} name="currentPassword" type="password" required />
        </label>
        <label>
          New Password
          <input className={inputClass} name="nextPassword" type="password" required />
        </label>
        <label>
          Confirm New Password
          <input className={inputClass} name="confirmPassword" type="password" required />
        </label>
        {passwordError && <p className="form-error profile-span-2">{passwordError}</p>}
        {passwordMessage && <p className="form-success profile-span-2">{passwordMessage}</p>}
        <div className="profile-span-2">
          <button
            className="primary-button"
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
    <main className="profile-page">
      <section className="profile-layout">
        <aside className="profile-sidebar">
          <div className="profile-user-card">
            <div className="profile-avatar">
              <Icon name="user" size={22} />
            </div>
            <strong>{displayName}</strong>
            <p>{userEmail}</p>
            <small>{tierName}</small>
          </div>

          <div className="profile-nav">
            {sidebarSections.map((section) => {
              const isActive = activeSection === section.id
              return (
                <button
                  className={`profile-nav-button ${isActive ? 'active' : ''}`}
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                >
                  <div>
                    <Icon name={section.icon} size={15} />
                    <span>{section.label}</span>
                  </div>
                  <p>{section.hint}</p>
                </button>
              )
            })}
          </div>

          <button
            className="secondary-button full-width"
            type="button"
            onClick={() => navigate('rooms')}
          >
            Book Now
          </button>
          <button
            className="ghost-button full-width"
            type="button"
            onClick={() => {
              logout()
              navigate('home')
            }}
          >
            Logout
          </button>
        </aside>

        <div className="profile-content">
          {renderActiveSection()}
        </div>
      </section>
    </main>
  )
}
