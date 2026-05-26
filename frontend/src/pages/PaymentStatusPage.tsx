import { useEffect, useState } from 'react'
import { fetchRoom } from '../api/vipBookingApi'
import { PriceDetails } from '../components/booking/PriceDetails'
import { Icon } from '../components/icons/Icon'
import { rooms as defaultRooms } from '../data/rooms'
import type { Navigate, Room } from '../types'
import { getSelectedRoomId, getSelectedStay, getStayNights } from '../utils/bookingSelections'
import { clearActiveBookingId, updateActiveBookingStatus } from '../utils/appStorage'

export function PaymentStatusPage({
  variant,
  navigate,
}: {
  variant: 'success' | 'failed'
  navigate: Navigate
}) {
  const isSuccess = variant === 'success'
  const [room, setRoom] = useState<Room>(defaultRooms[0])
  const nights = getStayNights(getSelectedStay())

  useEffect(() => {
    const roomId = getSelectedRoomId()
    if (roomId) {
      fetchRoom(roomId).then(setRoom).catch(() => undefined)
    }

    if (isSuccess) {
      updateActiveBookingStatus('Confirmed')
      clearActiveBookingId()
      return
    }

    updateActiveBookingStatus('Pending')
  }, [isSuccess])

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
          <img src={room.image} alt={room.name} />
          <PriceDetails room={room} nights={nights} />
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
