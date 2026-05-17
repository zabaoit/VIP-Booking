import type { Room } from '../../types'
import { PriceDetails } from './PriceDetails'

export function BookingSummary({
  room,
  buttonLabel,
  onButtonClick,
}: {
  room: Room
  buttonLabel: string
  onButtonClick?: () => void
}) {
  return (
    <aside className="summary-panel">
      <img src={room.image} alt={room.name} />
      <div className="summary-content">
        <h3>{room.name}</h3>
        <p>{room.location}</p>
        <div className="summary-badges">
          <span>3 nights</span>
          <span>2 guests</span>
          <span>Oct 2026</span>
        </div>
        <PriceDetails room={room} />
        <button className="primary-button full-width" type="submit" onClick={onButtonClick}>
          {buttonLabel}
        </button>
      </div>
    </aside>
  )
}
