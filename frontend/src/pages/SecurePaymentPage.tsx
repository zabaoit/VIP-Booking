import { useState, type FormEvent } from 'react'
import { BookingSummary } from '../components/booking/BookingSummary'
import { Icon } from '../components/icons/Icon'
import { PageIntro } from '../components/ui/PageIntro'
import type { Navigate } from '../types'
import { getSelectedRoom } from '../utils/bookingSelections'
import { updateActiveBookingStatus } from '../utils/appStorage'

const paymentMethods = [
  {
    id: 'vietqr',
    label: 'VietQR',
    icon: 'card' as const,
    title: 'Scan VietQR to complete bank transfer',
    detail: 'Account: VIP Booking JSC - 9704 36 123456789',
  },
  {
    id: 'zalopay',
    label: 'ZaloPay',
    icon: 'shield' as const,
    title: 'Pay with ZaloPay wallet',
    detail: 'Use the ZaloPay app to approve this secure booking payment.',
  },
  {
    id: 'momo',
    label: 'MoMo',
    icon: 'lock' as const,
    title: 'Pay with MoMo wallet',
    detail: 'Use the MoMo app to confirm and return to VIP Booking.',
  },
]

export function SecurePaymentPage({ navigate }: { navigate: Navigate }) {
  const room = getSelectedRoom()
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0])
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(true)
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isPaymentConfirmed) {
      setError('Please confirm that payment is completed before continuing.')
      return
    }

    setError('')
    window.localStorage.setItem('vip-booking:preferred-payment', paymentMethod.id)
    updateActiveBookingStatus('Confirmed')
    navigate('success')
  }

  return (
    <main className="page-shell">
      <PageIntro
        eyebrow="Checkout"
        title="Secure Payment"
        copy="A payment form with booking context and invoice summary, ready for backend payment APIs."
      />

      <form
        className="checkout-layout"
        onSubmit={handleSubmit}
      >
        <section className="form-panel">
          <h2>Payment Method</h2>
          <div className="payment-tabs">
            {paymentMethods.map((method) => (
              <button
                className={paymentMethod.id === method.id ? 'active' : ''}
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method)}
              >
                <Icon name={method.icon} />
                {method.label}
              </button>
            ))}
          </div>
          <div className="wallet-panel">
            <div className="qr-box">
              <span>QR</span>
            </div>
            <div>
              <h3>{paymentMethod.title}</h3>
              <p>{paymentMethod.detail}</p>
              <small>Payment status will come from the payment gateway when backend APIs are connected.</small>
            </div>
          </div>
          <label className="check-row consent-row">
            <input
              checked={isPaymentConfirmed}
              type="checkbox"
              onChange={(event) => {
                setIsPaymentConfirmed(event.target.checked)
                if (event.target.checked) {
                  setError('')
                }
              }}
            />
            <span>I have completed the payment in {paymentMethod.label}.</span>
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button full-width" type="submit">
            <Icon name="lock" />
            Confirm Payment
          </button>
        </section>
        <BookingSummary room={room} buttonLabel="Confirm Payment" />
      </form>
    </main>
  )
}
