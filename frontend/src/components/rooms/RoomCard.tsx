import type { Navigate, Room } from '../../types'
import { saveSelectedRoom } from '../../utils/bookingSelections'
import { formatCurrency } from '../../utils/currency'
import { useAuth } from '../../hooks/useAuth'
import { Icon } from '../icons/Icon'

export function RoomCard({ room, navigate }: { room: Room; navigate: Navigate }) {
  const { isAuthenticated } = useAuth()

  const handleBook = () => {
    saveSelectedRoom(room.id)

    if (!isAuthenticated) {
      window.sessionStorage.setItem('vip-booking:pending-route', 'booking')
      navigate('login')
      return
    }

    navigate('booking')
  }

  return (
    <article className="room-card">
      <div className="room-image">
        <img src={room.image} alt={room.name} loading="lazy" />
        <span>{room.category}</span>
      </div>
      <div className="room-card-body">
        <div className="room-card-title">
          <div>
            <h3>{room.name}</h3>
            <p>
              <Icon name="mapPin" size={14} />
              {room.location}
            </p>
          </div>
          <div className="rating-pill">
            <Icon name="star" size={14} />
            {room.rating}
          </div>
        </div>
        <div className="room-meta">
          <span>
            <Icon name="users" size={15} />
            {room.guests}
          </span>
          <span>
            <Icon name="bed" size={15} />
            {room.bed}
          </span>
          <span>{room.size}</span>
        </div>
        <p>{room.description}</p>
        <div className="card-footer">
          <strong>
            {formatCurrency(room.price)}
            <small>/night</small>
          </strong>
          <div>
            <button
              className="ghost-button compact"
              type="button"
              onClick={() => {
                saveSelectedRoom(room.id)
                navigate('roomDetail', { path: `rooms/${room.id}` })
              }}
            >
              Details
            </button>
            <button
              className="primary-button compact"
              type="button"
              onClick={handleBook}
            >
              Book
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
