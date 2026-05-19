import { featuredRoom, rooms } from '../data/rooms'
import type { Room } from '../types'

const selectedRoomKey = 'vip-booking:selected-room-id'

export function saveSelectedRoom(roomId: string) {
  window.sessionStorage.setItem(selectedRoomKey, roomId)
}

export function getSelectedRoom(): Room {
  const selectedRoomId = window.sessionStorage.getItem(selectedRoomKey)
  return rooms.find((room) => room.id === selectedRoomId) ?? featuredRoom
}