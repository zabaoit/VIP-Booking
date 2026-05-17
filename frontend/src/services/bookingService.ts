import { rooms } from '../data/rooms'
import { services } from '../data/services'

export async function getRooms() {
  return rooms
}

export async function getServices() {
  return services
}
