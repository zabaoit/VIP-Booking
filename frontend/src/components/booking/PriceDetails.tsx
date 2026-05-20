import type { Room } from '../../types'
import { formatCurrency } from '../../utils/currency'

export function PriceDetails({
  addOnTotal = 0,
  nights = 3,
  room,
}: {
  room: Room
  addOnTotal?: number
  nights?: number
}) {
  const subtotal = room.price * nights
  const serviceFee = 145
  const tax = 88
  const total = subtotal + serviceFee + addOnTotal + tax

  return (
    <div className="price-details">
      <div>
        <span>Room subtotal ({nights} {nights === 1 ? 'night' : 'nights'})</span>
        <strong>{formatCurrency(subtotal)}</strong>
      </div>
      <div>
        <span>Service package</span>
        <strong>{formatCurrency(serviceFee)}</strong>
      </div>
      {addOnTotal > 0 && (
        <div>
          <span>Selected add-ons</span>
          <strong>{formatCurrency(addOnTotal)}</strong>
        </div>
      )}
      <div>
        <span>Tax and fees</span>
        <strong>{formatCurrency(tax)}</strong>
      </div>
      <div className="total">
        <span>Total</span>
        <strong>{formatCurrency(total)}</strong>
      </div>
    </div>
  )
}
