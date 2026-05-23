import { rooms as defaultRooms } from '../data/rooms'
import { services as defaultServices } from '../data/services'
import type {
  BookingRecord,
  ContactMessage,
  ContactMessageStatus,
  CustomerProfile,
  PricingRule,
  RegisteredUser,
  Room,
  Service,
  SupportInfo,
} from '../types'

export const registeredUsersStorageKey = 'vip-booking-registered-users'
export const roomsStorageKey = 'vip-booking-rooms'
export const servicesStorageKey = 'vip-booking-services'
export const pricingRulesStorageKey = 'vip-booking-pricing-rules'
export const customerProfilesStorageKey = 'vip-booking-customer-profiles'
export const bookingsStorageKey = 'vip-booking-bookings'
export const activeBookingIdStorageKey = 'vip-booking-active-booking-id'
export const supportInfoStorageKey = 'vip-booking-support-info'
export const contactMessagesStorageKey = 'vip-booking-contact-messages'

const defaultSupportInfo: SupportInfo = {
  hotline: '+84 901 123 456',
  email: 'guest@vipbooking.vn',
  address: '12 Nguyen Hue, Ho Chi Minh City',
  badges: ['Luxury Stays', 'Secure Checkout', 'Priority Service'],
}

const defaultPricingRules: PricingRule[] = [
  {
    id: 'peak-season-weekend',
    name: 'Peak Season Weekend',
    roomType: 'All Room Types',
    trigger: 'Occupancy > 85%',
    adjustment: '+20%',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
  },
  {
    id: 'last-minute-booking',
    name: 'Last Minute Booking',
    roomType: 'Standard King',
    trigger: 'Days to Check in < 3',
    adjustment: '-10%',
    startDate: '2026-05-01',
    endDate: '2026-12-31',
  },
  {
    id: 'corporate-event-surge',
    name: 'Corporate Event Surge',
    roomType: 'Executive Ocean View',
    trigger: 'Manual Override',
    adjustment: '+$50 Flat',
    startDate: '2026-07-10',
    endDate: '2026-07-20',
  },
]

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function parseArrayStorage<T>(key: string): T[] | null {
  const rawValue = localStorage.getItem(key)
  if (!rawValue) {
    return null
  }

  try {
    const value = JSON.parse(rawValue) as T[]
    return Array.isArray(value) ? value : null
  } catch {
    return null
  }
}

export function readRegisteredUsers(): RegisteredUser[] {
  return parseArrayStorage<RegisteredUser>(registeredUsersStorageKey) ?? []
}

export function readRooms(): Room[] {
  const roomItems = parseArrayStorage<Room>(roomsStorageKey)

  if (!roomItems) {
    localStorage.setItem(roomsStorageKey, JSON.stringify(defaultRooms))
    return defaultRooms
  }

  return roomItems
}

export function saveRooms(roomItems: Room[]) {
  localStorage.setItem(roomsStorageKey, JSON.stringify(roomItems))
}

export function readServices(): Service[] {
  const serviceItems = parseArrayStorage<Service>(servicesStorageKey)
  if (!serviceItems) {
    localStorage.setItem(servicesStorageKey, JSON.stringify(defaultServices))
    return defaultServices
  }

  return serviceItems
}

export function saveServices(serviceItems: Service[]) {
  localStorage.setItem(servicesStorageKey, JSON.stringify(serviceItems))
}

export function readPricingRules(): PricingRule[] {
  const pricingRules = parseArrayStorage<PricingRule>(pricingRulesStorageKey)
  if (!pricingRules) {
    localStorage.setItem(pricingRulesStorageKey, JSON.stringify(defaultPricingRules))
    return defaultPricingRules
  }

  return pricingRules
}

export function savePricingRules(rules: PricingRule[]) {
  localStorage.setItem(pricingRulesStorageKey, JSON.stringify(rules))
}

export function readCustomerProfiles(): CustomerProfile[] {
  return parseArrayStorage<CustomerProfile>(customerProfilesStorageKey) ?? []
}

export function saveCustomerProfiles(profiles: CustomerProfile[]) {
  localStorage.setItem(customerProfilesStorageKey, JSON.stringify(profiles))
}

export function readBookings(): BookingRecord[] {
  return parseArrayStorage<BookingRecord>(bookingsStorageKey) ?? []
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

export function readSupportInfo(): SupportInfo {
  const rawSupportInfo = localStorage.getItem(supportInfoStorageKey)
  if (!rawSupportInfo) {
    localStorage.setItem(supportInfoStorageKey, JSON.stringify(defaultSupportInfo))
    return defaultSupportInfo
  }

  try {
    const parsedSupportInfo = JSON.parse(rawSupportInfo) as Partial<SupportInfo>
    return {
      ...defaultSupportInfo,
      ...parsedSupportInfo,
      badges: Array.isArray(parsedSupportInfo.badges)
        ? parsedSupportInfo.badges.filter(Boolean).slice(0, 6)
        : defaultSupportInfo.badges,
    }
  } catch {
    localStorage.setItem(supportInfoStorageKey, JSON.stringify(defaultSupportInfo))
    return defaultSupportInfo
  }
}

export function saveSupportInfo(supportInfo: SupportInfo) {
  localStorage.setItem(
    supportInfoStorageKey,
    JSON.stringify({
      ...supportInfo,
      badges: supportInfo.badges.filter(Boolean).slice(0, 6),
    }),
  )
}

export function readContactMessages(): ContactMessage[] {
  const messages = parseArrayStorage<ContactMessage>(contactMessagesStorageKey)
  return messages ?? []
}

export function saveContactMessage(
  message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>,
) {
  const contactMessages = readContactMessages()
  const nextMessage: ContactMessage = {
    ...message,
    id: `${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'New',
  }
  localStorage.setItem(contactMessagesStorageKey, JSON.stringify([nextMessage, ...contactMessages]))
}

export function updateContactMessageStatus(messageId: string, status: ContactMessageStatus) {
  const contactMessages = readContactMessages()
  const nextMessages = contactMessages.map((message) =>
    message.id === messageId ? { ...message, status } : message,
  )
  localStorage.setItem(contactMessagesStorageKey, JSON.stringify(nextMessages))
}
