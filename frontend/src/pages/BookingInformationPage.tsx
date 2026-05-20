import type { FormEvent } from 'react'
import { BookingSummary } from '../components/booking/BookingSummary'
import { PageIntro } from '../components/ui/PageIntro'
import { useAuth } from '../hooks/useAuth'
import type { Navigate } from '../types'
import {
  formatStayRange,
  getSelectedRoom,
  getSelectedStay,
  getStayNights,
} from '../utils/bookingSelections'
import { formatCurrency } from '../utils/currency'
import { saveBooking } from '../utils/appStorage'

export function BookingInformationPage({ navigate }: { navigate: Navigate }) {
  const room = getSelectedRoom()
  const stay = getSelectedStay()
  const nights = getStayNights(stay)
  const { user } = useAuth()

  const handleBookingSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const firstName = String(formData.get('firstName') ?? '').trim()
    const lastName = String(formData.get('lastName') ?? '').trim()
    const email = String(formData.get('email') ?? user?.email ?? '').trim()
    const guestName = `${firstName} ${lastName}`.trim() || email || 'Guest'

    saveBooking({
      id: `${Date.now()}`,
      guest: guestName,
      email,
      room: room.name,
      checkIn: formatStayRange(stay),
      checkOut: stay.checkOut,
      amount: formatCurrency(room.price * nights),
      status: 'Pending',
    })

    navigate('confirm')
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
          <textarea defaultValue="High floor, quiet room, and champagne on arrival." rows={5} />
          <label className="check-row consent-row">
            <input type="checkbox" />
            <span>I require accessible room assistance.</span>
          </label>

          <button className="primary-button full-width" type="submit">
            Continue to Review
          </button>
        </section>

        <BookingSummary room={room} buttonLabel="Continue to Review" />
      </form>
    </main>
  )
}
