import { BookingSummary } from '../components/booking/BookingSummary'
import { Icon } from '../components/icons/Icon'
import { PageIntro } from '../components/ui/PageIntro'
import { featuredRoom } from '../data/rooms'
import type { Navigate } from '../types'
import { handleRouteSubmit } from '../utils/forms'

export function SecurePaymentPage({ navigate }: { navigate: Navigate }) {
  const room = featuredRoom

  return (
    <main className="page-shell">
      <PageIntro
        eyebrow="Checkout"
        title="Secure Payment"
        copy="A payment form with booking context and invoice summary, ready for backend payment APIs."
      />

      <form
        className="checkout-layout"
        onSubmit={(event) => handleRouteSubmit(event, 'success', navigate)}
      >
        <section className="form-panel">
          <h2>Payment Method</h2>
          <div className="payment-tabs">
            <button className="active" type="button">
              <Icon name="card" />
              Credit Card
            </button>
            <button type="button">
              <Icon name="shield" />
              Bank Transfer
            </button>
            <button type="button">
              <Icon name="lock" />
              Wallet
            </button>
          </div>
          <div className="form-grid">
            <label className="span-2">
              Card number
              <input defaultValue="4242 4242 4242 4242" inputMode="numeric" />
            </label>
            <label>
              Expiry date
              <input defaultValue="10/28" />
            </label>
            <label>
              CVC
              <input defaultValue="123" inputMode="numeric" />
            </label>
            <label className="span-2">
              Cardholder name
              <input defaultValue="ANH NGUYEN" />
            </label>
          </div>
          <label className="check-row consent-row">
            <input defaultChecked type="checkbox" />
            <span>Save payment method for future VIP bookings.</span>
          </label>
          <button className="primary-button full-width" type="submit">
            <Icon name="lock" />
            Pay Securely
          </button>
          <button
            className="ghost-button full-width"
            type="button"
            onClick={() => navigate('failed')}
          >
            Simulate Failed Payment
          </button>
        </section>
        <BookingSummary room={room} buttonLabel="Pay Securely" />
      </form>
    </main>
  )
}
