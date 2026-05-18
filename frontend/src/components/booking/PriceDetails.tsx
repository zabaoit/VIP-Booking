import type { Room } from '../../types'
import { formatCurrency } from '../../utils/currency'

export function PriceDetails({ room }: { room: Room }) {
  const subtotal = room.price * 3
  const serviceFee = 145
  const tax = 88
  const total = subtotal + serviceFee + tax

  return (
    <div className="price-details">
      <div>
        <span>Room subtotal</span>
        <strong>{formatCurrency(subtotal)}</strong>
      </div>
      <div>
        <span>Service package</span>
        <strong>{formatCurrency(serviceFee)}</strong>
      </div>
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
