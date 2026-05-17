import { PriceDetails } from '../components/booking/PriceDetails'
import { Icon } from '../components/icons/Icon'
import { images } from '../data/images'
import { featuredRoom } from '../data/rooms'
import type { Navigate } from '../types'

export function PaymentStatusPage({
  variant,
  navigate,
}: {
  variant: 'success' | 'failed'
  navigate: Navigate
}) {
  const isSuccess = variant === 'success'

  return (
    <main className="status-page">
      <section className="status-panel">
        <span className={`status-icon ${isSuccess ? 'success' : 'failed'}`}>
          <Icon name={isSuccess ? 'check' : 'close'} size={28} />
        </span>
        <h1>{isSuccess ? 'Payment Successful' : 'Payment Failed'}</h1>
        <p>
          {isSuccess
            ? 'Your VIP Booking reservation is confirmed. A receipt has been prepared for the guest profile.'
            : 'The payment could not be authorized. Review the details or try another payment method.'}
        </p>
        <div className="receipt-card">
          <img src={images.exterior} alt="VIP Booking hotel exterior" />
          <PriceDetails room={featuredRoom} />
        </div>
        <div className="status-actions">
          <button
            className="primary-button"
            type="button"
            onClick={() => navigate(isSuccess ? 'home' : 'payment')}
          >
            {isSuccess ? 'Back to Home' : 'Try Again'}
          </button>
          <button className="ghost-button" type="button" onClick={() => navigate('rooms')}>
            View Rooms
          </button>
        </div>
      </section>
    </main>
  )
}
