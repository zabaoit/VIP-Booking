import type { Room } from '../../types'
import { useLanguage } from '../../context/LanguageContext'
import { formatStayRange, getSelectedStay, getStayNights } from '../../utils/bookingSelections'
import { PriceDetails } from './PriceDetails'

export function BookingSummary({
  room,
  buttonLabel,
  onButtonClick,
  addOnTotal = 0,
}: {
  room: Room
  buttonLabel: string
  onButtonClick?: () => void
  addOnTotal?: number
}) {
  const { t } = useLanguage()
  const stay = getSelectedStay()
  const nights = getStayNights(stay)
  const nightLabel = nights === 1 ? t('bookingSummary.night') : t('bookingSummary.nights')

  return (
    <aside className="summary-panel">
      <img src={room.image} alt={room.name} />
      <div className="summary-content">
        <h3>{room.name}</h3>
        <p>{room.location}</p>
        <div className="summary-badges">
          <span>{nights} {nightLabel}</span>
          <span>{stay.guests}</span>
          <span>{formatStayRange(stay)}</span>
        </div>
        <PriceDetails room={room} addOnTotal={addOnTotal} nights={nights} />
        <button className="primary-button full-width" type="submit" onClick={onButtonClick}>
          {buttonLabel}
        </button>
      </div>
    </aside>
  )
}
