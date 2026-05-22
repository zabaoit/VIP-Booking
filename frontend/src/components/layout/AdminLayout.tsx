import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { adminNavItems } from '../../data/navigation'
import { routeTitles } from '../../data/routes'
import type { BookingRecord, RouteKey } from '../../types'
import {
  readBookings,
  readPricingRules,
  readRegisteredUsers,
  readRooms,
  readServices,
} from '../../utils/appStorage'
import { getRouteHref, setAppRoute } from '../../utils/router'
import { Icon } from '../icons/Icon'

type SearchResult = {
  id: string
  title: string
  meta: string
  route: RouteKey
}

type AdminNotification = {
  id: string
  title: string
  detail: string
  time: string
  route: RouteKey
  bookingStatus?: 'All' | BookingRecord['status']
  bookingSearch?: string
  customerSearch?: string
}

const readNotificationsStorageKey = 'vip-booking:admin-read-notifications'
const adminBookingsFilterKey = 'vip-booking:admin-bookings-filter'
const adminBookingsSearchKey = 'vip-booking:admin-bookings-search'
const adminCustomersSearchKey = 'vip-booking:admin-customers-search'

function readSeenNotifications() {
  try {
    const raw = localStorage.getItem(readNotificationsStorageKey)
    if (!raw) {
      return [] as string[]
    }
    const value = JSON.parse(raw) as string[]
    return Array.isArray(value) ? value : []
  } catch {
    return [] as string[]
  }
}

function saveSeenNotifications(ids: string[]) {
  localStorage.setItem(readNotificationsStorageKey, JSON.stringify(ids))
}

export function AdminLayout({
  currentRoute,
  children,
}: {
  currentRoute: RouteKey
  children: ReactNode
}) {
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [seenNotificationIds, setSeenNotificationIds] = useState<string[]>(() =>
    readSeenNotifications(),
  )
  const topbarActionsRef = useRef<HTMLDivElement>(null)

  const notifications = useMemo<AdminNotification[]>(() => {
    const bookings = readBookings()
    const users = readRegisteredUsers().filter((item) => item.role === 'guest')
    const pendingBookings = bookings.filter((booking) => booking.status === 'Pending').length
    const latestBookings = bookings.slice(0, 4)

    const baseNotifications: AdminNotification[] = [
      {
        id: 'summary-pending',
        title: `${pendingBookings} pending booking${pendingBookings === 1 ? '' : 's'}`,
        detail:
          pendingBookings > 0
            ? 'New reservations are waiting for review.'
            : 'No pending booking requests right now.',
        time: 'Now',
        route: 'adminBookings',
        bookingStatus: 'Pending',
      },
      {
        id: 'summary-users',
        title: `${users.length} registered guests`,
        detail: 'Guest list is synced with customer management.',
        time: 'Now',
        route: 'adminCustomers',
      },
    ]

    const bookingNotifications: AdminNotification[] = latestBookings.map((booking) => {
      const timestamp = Number(booking.id)
      const hasValidTimestamp = Number.isFinite(timestamp) && timestamp > 0
      const time = hasValidTimestamp
        ? new Intl.DateTimeFormat('en', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date(timestamp))
        : 'Recent'

      return {
        id: `booking-${booking.id}`,
        title: `Booking from ${booking.guest}`,
        detail: `${booking.room} - ${booking.status}`,
        time,
        route: 'adminBookings',
        bookingSearch: booking.id,
        bookingStatus: booking.status,
      }
    })

    return [...baseNotifications, ...bookingNotifications]
  }, [currentRoute])

  const unreadNotifications = notifications.filter(
    (notification) => !seenNotificationIds.includes(notification.id),
  )
  const unreadCount = unreadNotifications.length

  const searchResults = useMemo<SearchResult[]>(() => {
    const query = searchQuery.trim().toLowerCase()
    if (query.length < 2) {
      return []
    }

    const roomResults: SearchResult[] = readRooms()
      .filter((room) =>
        `${room.name} ${room.category} ${room.location}`.toLowerCase().includes(query),
      )
      .slice(0, 3)
      .map((room) => ({
        id: `room-${room.id}`,
        title: room.name,
        meta: `${room.category} - ${room.location}`,
        route: 'adminRooms',
      }))

    const bookingResults: SearchResult[] = readBookings()
      .filter((booking) =>
        `${booking.guest} ${booking.room} ${booking.email} ${booking.id}`
          .toLowerCase()
          .includes(query),
      )
      .slice(0, 3)
      .map((booking) => ({
        id: `booking-${booking.id}`,
        title: booking.guest,
        meta: `#${booking.id} - ${booking.room}`,
        route: 'adminBookings',
      }))

    const serviceResults: SearchResult[] = readServices()
      .filter((service) => `${service.name} ${service.note}`.toLowerCase().includes(query))
      .slice(0, 2)
      .map((service) => ({
        id: `service-${service.name}`,
        title: service.name,
        meta: `${service.price} - ${service.status}`,
        route: 'adminServices',
      }))

    const pricingResults: SearchResult[] = readPricingRules()
      .filter((rule) =>
        `${rule.name} ${rule.roomType} ${rule.trigger}`.toLowerCase().includes(query),
      )
      .slice(0, 2)
      .map((rule) => ({
        id: `rule-${rule.id}`,
        title: rule.name,
        meta: `${rule.roomType} - ${rule.adjustment}`,
        route: 'adminPricing',
      }))

    const userResults: SearchResult[] = readRegisteredUsers()
      .filter((item) => item.role === 'guest')
      .filter((item) => item.email.toLowerCase().includes(query))
      .slice(0, 2)
      .map((item) => ({
        id: `user-${item.email}`,
        title: item.email,
        meta: 'Customer account',
        route: 'adminCustomers',
      }))

    return [...roomResults, ...bookingResults, ...serviceResults, ...pricingResults, ...userResults]
      .slice(0, 8)
  }, [searchQuery, currentRoute])

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!topbarActionsRef.current?.contains(event.target as Node)) {
        setIsSearchOpen(false)
        setIsNotificationsOpen(false)
        setIsAccountOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  const markAllNotificationsRead = () => {
    const ids = Array.from(new Set([...seenNotificationIds, ...notifications.map((item) => item.id)]))
    setSeenNotificationIds(ids)
    saveSeenNotifications(ids)
  }

  const markNotificationRead = (notificationId: string) => {
    if (seenNotificationIds.includes(notificationId)) {
      return
    }

    const nextSeenIds = [...seenNotificationIds, notificationId]
    setSeenNotificationIds(nextSeenIds)
    saveSeenNotifications(nextSeenIds)
  }

  const handleLogout = () => {
    logout()
    setAppRoute('login')
  }

  const handleSearchPick = (route: RouteKey) => {
    setSearchQuery('')
    setIsSearchOpen(false)
    setAppRoute(route)
  }

  const handleNotificationClick = (notification: AdminNotification) => {
    markNotificationRead(notification.id)
    setIsNotificationsOpen(false)

    if (notification.bookingStatus) {
      window.sessionStorage.setItem(adminBookingsFilterKey, notification.bookingStatus)
    } else {
      window.sessionStorage.removeItem(adminBookingsFilterKey)
    }

    if (notification.bookingSearch) {
      window.sessionStorage.setItem(adminBookingsSearchKey, notification.bookingSearch)
    } else {
      window.sessionStorage.removeItem(adminBookingsSearchKey)
    }

    if (notification.customerSearch) {
      window.sessionStorage.setItem(adminCustomersSearchKey, notification.customerSearch)
    } else {
      window.sessionStorage.removeItem(adminCustomersSearchKey)
    }

    setAppRoute(notification.route)
  }

  return (
    <main className="admin-layout">
      <aside className="admin-sidebar">
        <a className="brand" href={getRouteHref('home')}>
          <span className="brand-mark">VIP</span>
          <span>VIP Booking</span>
        </a>
        <nav aria-label="Admin navigation">
          {adminNavItems.map((item) => (
            <a
              className={currentRoute === item.route ? 'active' : ''}
              href={getRouteHref(item.route)}
              key={item.route}
            >
              <Icon name={item.icon} />
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
      <section className="admin-content">
        <div className="admin-topbar">
          <div>
            <p className="eyebrow">Control center</p>
            <h1>{routeTitles[currentRoute].replace(' - VIP Booking', '')}</h1>
          </div>
          <div className="admin-topbar-actions" ref={topbarActionsRef}>
            <div className="admin-search-shell">
              <div className="admin-search">
                <span className="admin-search-icon">
                  <Icon name="search" size={16} />
                </span>
                <input
                  className="admin-search-input"
                  value={searchQuery}
                  placeholder="Search bookings, rooms, guests..."
                  onFocus={() => setIsSearchOpen(true)}
                  onChange={(event) => {
                    setSearchQuery(event.target.value)
                    setIsSearchOpen(true)
                  }}
                />
              </div>
              {isSearchOpen && searchQuery.trim().length >= 2 && (
                <div className="admin-quick-search-popover">
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <button
                        key={result.id}
                        className="admin-quick-search-item"
                        type="button"
                        onClick={() => handleSearchPick(result.route)}
                      >
                        <strong>{result.title}</strong>
                        <small>{result.meta}</small>
                      </button>
                    ))
                  ) : (
                    <p className="admin-quick-search-empty">No matching results.</p>
                  )}
                </div>
              )}
            </div>

            <div className="admin-action-buttons">
              <button
                className="admin-icon-button"
                type="button"
                aria-label="Notifications"
                onClick={() => {
                  setIsNotificationsOpen((value) => {
                    const nextValue = !value
                    if (nextValue) {
                      markAllNotificationsRead()
                    }
                    return nextValue
                  })
                  setIsAccountOpen(false)
                }}
              >
                <Icon name="bell" size={15} />
                {unreadCount > 0 && <span className="admin-notification-dot" />}
              </button>
              <button
                className="admin-icon-button"
                type="button"
                aria-label="Admin account"
                onClick={() => {
                  setIsAccountOpen((value) => !value)
                  setIsNotificationsOpen(false)
                }}
              >
                <Icon name="user" size={15} />
              </button>
            </div>

            {isNotificationsOpen && (
              <div className="admin-notification-popover">
                <div className="admin-notification-header">
                  <strong>Notifications</strong>
                  <button className="link-button" type="button" onClick={markAllNotificationsRead}>
                    Mark all read
                  </button>
                </div>
                <div className="admin-notification-list">
                  {notifications.map((notification) => {
                    const isUnread = !seenNotificationIds.includes(notification.id)
                    return (
                      <button
                        className={`admin-notification-item ${isUnread ? 'is-unread' : ''}`}
                        key={notification.id}
                        type="button"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <strong>{notification.title}</strong>
                        <p>{notification.detail}</p>
                        <small>{notification.time}</small>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {isAccountOpen && (
              <div className="admin-account-popover">
                <strong>{user?.email ?? 'admin@vipbooking.vn'}</strong>
                <small>Administrator</small>
                <div>
                  <a className="ghost-button compact" href={getRouteHref('profile')}>
                    View Profile
                  </a>
                  <button className="secondary-button compact" type="button" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {children}
      </section>
    </main>
  )
}
