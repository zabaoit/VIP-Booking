import { services as defaultServices } from '../data/services'
import type { BookingRecord, RegisteredUser, Service } from '../types'

export const registeredUsersStorageKey = 'vip-booking-registered-users'
export const servicesStorageKey = 'vip-booking-services'
export const bookingsStorageKey = 'vip-booking-bookings'
export const activeBookingIdStorageKey = 'vip-booking-active-booking-id'

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function readRegisteredUsers(): RegisteredUser[] {
  const rawUsers = localStorage.getItem(registeredUsersStorageKey)

  if (!rawUsers) {
    return []
  }

  try {
    const users = JSON.parse(rawUsers) as RegisteredUser[]
    return Array.isArray(users) ? users : []
  } catch {
    return []
  }
}

export function readServices(): Service[] {
  const rawServices = localStorage.getItem(servicesStorageKey)

  if (!rawServices) {
    localStorage.setItem(servicesStorageKey, JSON.stringify(defaultServices))
    return defaultServices
  }

  try {
    const serviceItems = JSON.parse(rawServices) as Service[]
    return Array.isArray(serviceItems) ? serviceItems : defaultServices
  } catch {
    localStorage.setItem(servicesStorageKey, JSON.stringify(defaultServices))
    return defaultServices
  }
}

export function saveServices(serviceItems: Service[]) {
  localStorage.setItem(servicesStorageKey, JSON.stringify(serviceItems))
}

export function readBookings(): BookingRecord[] {
  const rawBookings = localStorage.getItem(bookingsStorageKey)

  if (!rawBookings) {
    return []
  }

  try {
    const bookings = JSON.parse(rawBookings) as BookingRecord[]
    return Array.isArray(bookings) ? bookings : []
  } catch {
    return []
  }
}

export function saveBooking(booking: BookingRecord) {
  const bookings = readBookings()
  localStorage.setItem(bookingsStorageKey, JSON.stringify([booking, ...bookings]))
}

export function readBookingsByOwner(userEmail: string): BookingRecord[] {
  const normalizedUserEmail = normalizeEmail(userEmail)
  if (!normalizedUserEmail) {
    return []
  }

  return readBookings().filter((booking) => {
    const bookingOwnerEmail = booking.ownerEmail ?? booking.email
    return normalizeEmail(bookingOwnerEmail) === normalizedUserEmail
  })
}

export function updateBookingStatus(bookingId: string, status: BookingRecord['status']) {
  const bookings = readBookings()
  const normalizedId = bookingId.startsWith('#') ? bookingId.slice(1) : bookingId
  const updatedBookings = bookings.map((booking) =>
    booking.id === normalizedId || booking.id === bookingId ? { ...booking, status } : booking,
  )

  localStorage.setItem(bookingsStorageKey, JSON.stringify(updatedBookings))
}

export function setActiveBookingId(bookingId: string) {
  window.sessionStorage.setItem(activeBookingIdStorageKey, bookingId)
}

export function getActiveBookingId() {
  return window.sessionStorage.getItem(activeBookingIdStorageKey)
}

export function clearActiveBookingId() {
  window.sessionStorage.removeItem(activeBookingIdStorageKey)
}

export function updateActiveBookingStatus(status: BookingRecord['status']) {
  const activeBookingId = getActiveBookingId()
  if (!activeBookingId) {
    return
  }

  updateBookingStatus(activeBookingId, status)
}
