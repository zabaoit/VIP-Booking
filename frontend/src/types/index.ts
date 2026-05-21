import type { ReactNode } from 'react'

export type RouteKey =
  | 'home'
  | 'rooms'
  | 'roomDetail'
  | 'booking'
  | 'confirm'
  | 'payment'
  | 'success'
  | 'failed'
  | 'contact'
  | 'about'
  | 'profile'
  | 'login'
  | 'register'
  | 'forgot'
  | 'reset'
  | 'otp'
  | 'admin'
  | 'adminRooms'
  | 'adminServices'
  | 'notFound'

export type IconName =
  | 'award'
  | 'bed'
  | 'calendar'
  | 'card'
  | 'check'
  | 'chevron'
  | 'close'
  | 'dashboard'
  | 'eye'
  | 'eyeOff'
  | 'edit'
  | 'filter'
  | 'home'
  | 'lock'
  | 'mail'
  | 'mapPin'
  | 'menu'
  | 'phone'
  | 'plus'
  | 'search'
  | 'service'
  | 'shield'
  | 'spark'
  | 'star'
  | 'trash'
  | 'user'
  | 'users'
  | 'wifi'

export type Room = {
  id: string
  name: string
  category: string
  location: string
  price: number
  rating: number
  reviews: number
  size: string
  guests: string
  bed: string
  image: string
  gallery: string[]
  description: string
  amenities: string[]
  highlights: string[]
  availability: number[]
}

export type Service = {
  name: string
  icon: IconName
  price: string
  note: string
  status: 'Active' | 'Paused'
}

export type RegisteredUser = {
  email: string
  password: string
  role: 'guest' | 'admin'
}

export type BookingRecord = {
  id: string
  ownerEmail?: string
  guest: string
  email: string
  room: string
  checkIn: string
  checkOut: string
  amount: string
  status: 'Confirmed' | 'Pending' | 'Cancelled'
}

export type NavigateOptions = {
  path?: string
}

export type Navigate = (route: RouteKey, options?: NavigateOptions) => void

export type AppRoute = {
  key: RouteKey
  element: (navigate: Navigate) => ReactNode
}
