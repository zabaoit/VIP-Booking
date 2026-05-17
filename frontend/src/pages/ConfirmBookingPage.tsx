import { BookingSummary } from '../components/booking/BookingSummary'
import { PriceDetails } from '../components/booking/PriceDetails'
import { Icon } from '../components/icons/Icon'
import { PageIntro } from '../components/ui/PageIntro'
import { featuredRoom } from '../data/rooms'
import { services } from '../data/services'
import type { Navigate } from '../types'
import { formatCurrency } from '../utils/currency'

export function ConfirmBookingPage({ navigate }: { navigate: Navigate }) {
  const room = featuredRoom

  return (
    <main className="page-shell">
      <PageIntro
        eyebrow="Review booking"
        title="Confirm Your Booking"
        copy="Confirm the room, included services, add-ons, and final payment amount."
      />

      <div className="checkout-layout">
        <section className="form-panel">
          <h2>Room Summary</h2>
          <div className="summary-row strong">
            <span>{room.name}</span>
            <strong>{formatCurrency(room.price * 3)}</strong>
          </div>
          <div className="mini-room">
            <img src={room.image} alt={room.name} />
            <div>
              <p>{room.location}</p>
              <span>Oct 10 - Oct 13, 2026</span>
              <span>2 adults, 3 nights</span>
            </div>
          </div>

          <h2>Included Services</h2>
          <div className="add-on-grid">
            {services.slice(0, 3).map((service) => (
              <label className="add-on-card" key={service.name}>
                <input defaultChecked type="checkbox" />
                <span className="icon-tile">
                  <Icon name={service.icon} />
                </span>
                <strong>{service.name}</strong>
                <small>{service.price}</small>
              </label>
            ))}
          </div>

          <h2>Price Details</h2>
          <PriceDetails room={room} />
          <button
            className="primary-button full-width"
            type="button"
            onClick={() => navigate('payment')}
          >
            Proceed to Payment
          </button>
        </section>
        <BookingSummary
          room={room}
          buttonLabel="Proceed to Payment"
          onButtonClick={() => navigate('payment')}
        />
      </div>
    </main>
  )
}
