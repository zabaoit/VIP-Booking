import { useState } from 'react'
import { BookingSummary } from '../components/booking/BookingSummary'
import { PriceDetails } from '../components/booking/PriceDetails'
import { Icon } from '../components/icons/Icon'
import { PageIntro } from '../components/ui/PageIntro'
import { services } from '../data/services'
import type { Navigate } from '../types'
import { getSelectedRoom } from '../utils/bookingSelections'
import { formatCurrency } from '../utils/currency'

function parseServicePrice(price: string) {
  return Number(price.replace(/[^0-9.]/g, '')) || 0
}

export function ConfirmBookingPage({ navigate }: { navigate: Navigate }) {
  const room = getSelectedRoom()
  const availableServices = services.slice(0, 3)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const addOnTotal = selectedServices.reduce((total, serviceName) => {
    const service = services.find((item) => item.name === serviceName)
    return total + (service ? parseServicePrice(service.price) : 0)
  }, 0)

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
              <span>{room.guests}, 3 nights</span>
            </div>
          </div>

          <h2>Additional Services</h2>
          <div className="add-on-grid">
            {availableServices.map((service) => {
              const isSelected = selectedServices.includes(service.name)

              return (
              <label className={`add-on-card ${isSelected ? 'selected' : ''}`} key={service.name}>
                <input
                  checked={isSelected}
                  type="checkbox"
                  onChange={(event) => {
                    setSelectedServices((current) =>
                      event.target.checked
                        ? [...current, service.name]
                        : current.filter((item) => item !== service.name),
                    )
                  }}
                />
                <span className="icon-tile">
                  <Icon name={service.icon} />
                </span>
                <strong>{service.name}</strong>
                <small>{service.price}</small>
              </label>
              )
            })}
          </div>

          <h2>Price Details</h2>
          <PriceDetails room={room} addOnTotal={addOnTotal} />
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
          addOnTotal={addOnTotal}
          onButtonClick={() => navigate('payment')}
        />
      </div>
    </main>
  )
}
