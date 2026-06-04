import { useEffect, useState, type FormEvent } from 'react'
import { fetchRoom } from '../api/vipBookingApi'
import { BookingSummary } from '../components/booking/BookingSummary'
import { Icon } from '../components/icons/Icon'
import { PageIntro } from '../components/ui/PageIntro'
import { useToast } from '../context/ToastContext'
import { rooms as defaultRooms } from '../data/rooms'
import type { Navigate, Room } from '../types'
import { getSelectedAddOns, getSelectedRoomId } from '../utils/bookingSelections'
import { getActiveBookingId, updateActiveBookingStatus } from '../utils/appStorage'
import { updateBookingWithApi } from '../api/vipBookingApi'

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
  const { showToast } = useToast()
  const [room, setRoom] = useState<Room>(defaultRooms[0])
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0])
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addOnTotal } = getSelectedAddOns()

  useEffect(() => {
    const roomId = getSelectedRoomId()
    if (!roomId) return

    fetchRoom(roomId)
      .then(setRoom)
      .catch((loadError) => {
        const message = loadError instanceof Error ? loadError.message : 'Could not load payment room.'
        showToast({ title: 'Could not load payment room', message, variant: 'error' })
      })
  }, [showToast])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isPaymentConfirmed) {
      const message = 'Please confirm that payment is completed before continuing.'
      showToast({ title: 'Payment confirmation required', message, variant: 'warning' })
      return
    }

    window.localStorage.setItem('vip-booking:preferred-payment', paymentMethod.id)
    const activeBookingId = getActiveBookingId()

    if (!activeBookingId) {
      showToast({
        title: 'Booking is missing',
        message: 'Please create a booking before confirming payment.',
        variant: 'warning',
      })
      return
    }

    setIsSubmitting(true)

    try {
      await updateBookingWithApi(activeBookingId, { status: 'Confirmed' })
      updateActiveBookingStatus('Confirmed')
      navigate('success')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not confirm booking payment.'
      showToast({ title: 'Could not confirm payment', message, variant: 'error' })
    } finally {
      setIsSubmitting(false)
    }
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
              disabled={isSubmitting}
              type="checkbox"
              onChange={(event) => {
                setIsPaymentConfirmed(event.target.checked)
              }}
            />
            <span>I have completed the payment in {paymentMethod.label}.</span>
          </label>
          <button className="primary-button full-width" disabled={isSubmitting} type="submit">
            <Icon name="lock" />
            {isSubmitting ? 'Confirming...' : 'Confirm Payment'}
          </button>
        </section>
        <BookingSummary room={room} buttonLabel="Confirm Payment" addOnTotal={addOnTotal} />
      </form>
    </main>
  )
}
