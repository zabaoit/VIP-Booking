import { readPricingRules, readRooms, readServices } from '../utils/appStorage'
import { applyPricingToRooms } from '../utils/pricing'

export async function getRooms() {
  return applyPricingToRooms(readRooms(), readPricingRules())
}

export async function getServices() {
  return readServices()
}
