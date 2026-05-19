import { BookingSummary } from '../components/booking/BookingSummary'
import { PageIntro } from '../components/ui/PageIntro'
import type { Navigate } from '../types'
import { getSelectedRoom } from '../utils/bookingSelections'
import { handleRouteSubmit } from '../utils/forms'

export function BookingInformationPage({ navigate }: { navigate: Navigate }) {
  const room = getSelectedRoom()

  return (
    <main className="page-shell">
      <PageIntro
        eyebrow="Booking information"
        title="Tell Us About Your Stay"
        copy="Add guest details, arrival preferences, and contact information before reviewing your booking."
      />

      <form
        className="checkout-layout"
        onSubmit={(event) => handleRouteSubmit(event, 'confirm', navigate)}
      >
        <section className="form-panel">
          <h2>Guest Details</h2>
          <div className="form-grid">
            <label>
              First name
              <input defaultValue="Anh" />
            </label>
            <label>
              Last name
              <input defaultValue="Nguyen" />
            </label>
            <label className="span-2">
              Email address
              <input defaultValue="guest@vipbooking.vn" type="email" />
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