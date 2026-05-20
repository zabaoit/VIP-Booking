import { services as defaultServices } from '../data/services'
import type { BookingRecord, RegisteredUser, Service } from '../types'

export const registeredUsersStorageKey = 'vip-booking-registered-users'
export const servicesStorageKey = 'vip-booking-services'
export const bookingsStorageKey = 'vip-booking-bookings'

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
