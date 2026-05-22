import { rooms as defaultRooms } from '../data/rooms'
import type { Room } from '../types'
import { readPricingRules, readRooms } from './appStorage'
import { applyPricingToRooms } from './pricing'

const selectedRoomKey = 'vip-booking:selected-room-id'
const selectedStayKey = 'vip-booking:selected-stay'
const roomSearchQueryKey = 'vip-booking:room-search-query'

export type BookingStay = {
  checkIn: string
  checkOut: string
  guests: string
}

export const defaultBookingStay: BookingStay = {
  checkIn: '2026-10-10',
  checkOut: '2026-10-13',
  guests: '2 guests',
}

function parseStayDate(value: string) {
  return new Date(`${value}T00:00:00`)
}

export function getStayNights(stay: BookingStay = getSelectedStay()) {
  const checkIn = parseStayDate(stay.checkIn)
  const checkOut = parseStayDate(stay.checkOut)
  const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / 86_400_000)

  return Math.max(nights, 1)
}

export function formatStayRange(stay: BookingStay = getSelectedStay()) {
  const formatter = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return `${formatter.format(parseStayDate(stay.checkIn))} - ${formatter.format(
    parseStayDate(stay.checkOut),
  )}`
}

export function saveSelectedStay(stay: BookingStay) {
  window.sessionStorage.setItem(selectedStayKey, JSON.stringify(stay))
}

export function saveSelectedRoom(roomId: string, stay: BookingStay = getSelectedStay()) {
  window.sessionStorage.setItem(selectedRoomKey, roomId)
  saveSelectedStay(stay)
}

export function saveRoomSearchQuery(query: string) {
  const trimmedQuery = query.trim()

  if (!trimmedQuery) {
    window.sessionStorage.removeItem(roomSearchQueryKey)
    return
  }

  window.sessionStorage.setItem(roomSearchQueryKey, trimmedQuery)
}

export function getRoomSearchQuery() {
  return window.sessionStorage.getItem(roomSearchQueryKey) ?? ''
}

export function getSelectedRoom(): Room {
  const rooms = applyPricingToRooms(readRooms(), readPricingRules())
  const selectedRoomId = window.sessionStorage.getItem(selectedRoomKey)
  return rooms.find((room) => room.id === selectedRoomId) ?? defaultRooms[0]
}

export function getSelectedStay(): BookingStay {
  const rawStay = window.sessionStorage.getItem(selectedStayKey)

  if (!rawStay) {
    return defaultBookingStay
  }

  try {
    return { ...defaultBookingStay, ...(JSON.parse(rawStay) as Partial<BookingStay>) }
  } catch {
    window.sessionStorage.removeItem(selectedStayKey)
    return defaultBookingStay
  }
}
