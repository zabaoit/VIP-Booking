import { BookingSummary } from '../components/booking/BookingSummary'
import { PageIntro } from '../components/ui/PageIntro'
import { featuredRoom } from '../data/rooms'
import type { Navigate } from '../types'
import { handleRouteSubmit } from '../utils/forms'

export function BookingInformationPage({ navigate }: { navigate: Navigate }) {
  const room = featuredRoom

  return (
    <main className="page-shell">
      <PageIntro
        eyebrow="Complete your booking"
        title="Booking Information"
        copy="Guest details, stay preferences, and booking summary are shown together for review."
      />

      <form
        className="checkout-layout"
        onSubmit={(event) => handleRouteSubmit(event, 'confirm', navigate)}
      >
        <section className="form-panel">
          <h2>Guest Information</h2>
          <div className="form-grid">
            <label>
              First name
              <input defaultValue="Anh" />
            </label>
            <label>
              Last name
              <input defaultValue="Nguyen" />
            </label>
            <label>
              Email
              <input defaultValue="anh.nguyen@example.com" type="email" />
            </label>
            <label>
              Phone
              <input defaultValue="+84 901 123 456" />
            </label>
          </div>
          <h2>Special Requests</h2>
          <textarea defaultValue="High floor, quiet room, and champagne on arrival." rows={5} />
          <label className="check-row consent-row">
            <input type="checkbox" />
            <span>I require accessible room assistance.</span>
          </label>
        </section>

        <BookingSummary room={room} buttonLabel="Continue to Review" />
      </form>
    </main>
  )
}
