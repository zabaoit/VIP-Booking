import { useEffect, useState, type FormEvent } from 'react'
import { createBooking, fetchRoom } from '../api/vipBookingApi'
import { BookingSummary } from '../components/booking/BookingSummary'
import { PageIntro } from '../components/ui/PageIntro'
import { useToast } from '../context/ToastContext'
import { rooms as defaultRooms } from '../data/rooms'
import { useAuth } from '../hooks/useAuth'
import type { Navigate, Room } from '../types'
import {
  getSelectedRoomId,
  getSelectedStay,
} from '../utils/bookingSelections'
import { setActiveBookingId } from '../utils/appStorage'

export function BookingInformationPage({ navigate }: { navigate: Navigate }) {
  const { showToast } = useToast()
  const [room, setRoom] = useState<Room>(defaultRooms[0])
  const [, setDataError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const stay = getSelectedStay()
  const { user } = useAuth()
  const selectedRoomId = getSelectedRoomId()

  useEffect(() => {
    if (!selectedRoomId) {
      const message = 'Please select a room before continuing.'
      setDataError(message)
      showToast({ title: 'Room selection required', message, variant: 'warning' })
      return
    }

    let isMounted = true
    fetchRoom(selectedRoomId)
      .then((nextRoom) => {
        if (!isMounted) return
        setRoom(nextRoom)
        setDataError('')
      })
      .catch((error) => {
        if (!isMounted) return
        const message = error instanceof Error ? error.message : 'Could not load selected room.'
        setDataError(message)
        showToast({ title: 'Could not load room', message, variant: 'error' })
      })

    return () => {
      isMounted = false
    }
  }, [selectedRoomId])

  const handleBookingSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedRoomId) {
      const message = 'Please select a room before continuing.'
      setDataError(message)
      showToast({ title: 'Room selection required', message, variant: 'warning' })
      return
    }

    const formData = new FormData(event.currentTarget)
    const firstName = String(formData.get('firstName') ?? '').trim()
    const lastName = String(formData.get('lastName') ?? '').trim()
    const email = String(formData.get('email') ?? user?.email ?? '').trim()
    const guestName = `${firstName} ${lastName}`.trim() || email || 'Guest'
    const specialRequest = String(formData.get('specialRequest') ?? '').trim()

    setIsSubmitting(true)
    setDataError('')

    try {
      const booking = await createBooking({
        roomId: selectedRoomId,
        checkInDate: stay.checkIn,
        checkOutDate: stay.checkOut,
        guestCount: Number.parseInt(stay.guests, 10) || 1,
        specialRequest: [guestName, specialRequest].filter(Boolean).join(' - '),
      })
      showToast({ title: 'Booking created', message: booking.apiMessage, variant: 'success' })
      setActiveBookingId(booking.id)
      navigate('confirm')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not create booking.'
      setDataError(message)
      showToast({ title: 'Could not create booking', message, variant: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-shell">
      <PageIntro
        eyebrow="Booking information"
        title="Tell Us About Your Stay"
        copy="Add guest details, arrival preferences, and contact information before reviewing your booking."
      />

      <form
        className="checkout-layout"
        onSubmit={handleBookingSubmit}
      >
        <section className="form-panel">
          <h2>Guest Details</h2>
          <div className="form-grid">
            <label>
              First name
              <input defaultValue="Anh" name="firstName" />
            </label>
            <label>
              Last name
              <input defaultValue="Nguyen" name="lastName" />
            </label>
            <label className="span-2">
              Email address
              <input defaultValue={user?.email ?? 'guest@vipbooking.vn'} name="email" type="email" />
            </label>
            <label>
              Phone number
              <input defaultValue="+84 901 123 456" />
            </label>
            <label>
              Arrival time
              <input defaultValue="15:00" type="time" />
            </label>
          </div>

          <h2>Stay Preferences</h2>
          <textarea
            defaultValue="High floor, quiet room, and champagne on arrival."
            name="specialRequest"
            rows={5}
          />
          <label className="check-row consent-row">
            <input type="checkbox" />
            <span>I require accessible room assistance.</span>
          </label>

          <button className="primary-button full-width" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Creating booking...' : 'Continue to Review'}
          </button>
        </section>

        <BookingSummary room={room} buttonLabel="Continue to Review" />
      </form>
    </main>
  )
}
