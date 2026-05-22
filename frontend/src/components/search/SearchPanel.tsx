import { useState, type FormEvent } from 'react'
import type { Navigate } from '../../types'
import {
  type BookingStay,
  getRoomSearchQuery,
  saveRoomSearchQuery,
  saveSelectedStay,
} from '../../utils/bookingSelections'
import { Icon } from '../icons/Icon'

export type SearchPayload = BookingStay & {
  destination: string
}

export function SearchPanel({
  navigate,
  mode = 'navigate',
  onSearch,
}: {
  navigate: Navigate
  mode?: 'navigate' | 'inline'
  onSearch?: (payload: SearchPayload) => void
}) {
  const [destination, setDestination] = useState(() => getRoomSearchQuery() || 'Da Nang Oceanfront')
  const [checkIn, setCheckIn] = useState('2026-10-10')
  const [checkOut, setCheckOut] = useState('2026-10-13')
  const [guests, setGuests] = useState('2 guests')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!destination.trim()) {
      setError('Please enter a destination.')
      return
    }

    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates.')
      return
    }

    const checkInDate = new Date(`${checkIn}T00:00:00`)
    const checkOutDate = new Date(`${checkOut}T00:00:00`)

    if (checkOutDate <= checkInDate) {
      setError('Check-out must be after check-in.')
      return
    }

    setError('')
    saveRoomSearchQuery(destination)
    saveSelectedStay({ checkIn, checkOut, guests })
    onSearch?.({
      destination: destination.trim(),
      checkIn,
      checkOut,
      guests,
    })

    if (mode === 'navigate') {
      navigate('rooms')
    }
  }

  return (
    <form
      className="search-panel"
      onSubmit={handleSubmit}
    >
      <label>
        <span>Destination</span>
        <input value={destination} onChange={(event) => setDestination(event.target.value)} />
      </label>
      <label>
        <span>Check in</span>
        <input value={checkIn} type="date" onChange={(event) => setCheckIn(event.target.value)} />
      </label>
      <label>
        <span>Check out</span>
        <input value={checkOut} type="date" onChange={(event) => setCheckOut(event.target.value)} />
      </label>
      <label>
        <span>Guests</span>
        <select value={guests} onChange={(event) => setGuests(event.target.value)}>
          <option>1 guest</option>
          <option>2 guests</option>
          <option>3 guests</option>
          <option>4 guests</option>
        </select>
      </label>
      <button className="primary-button search-button" type="submit">
        <Icon name="search" />
        Search
      </button>
      {error && <p className="form-error search-form-error">{error}</p>}
    </form>
  )
}
