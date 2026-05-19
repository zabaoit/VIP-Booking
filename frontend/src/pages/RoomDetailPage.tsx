import { Icon } from '../components/icons/Icon'
import { PageIntro } from '../components/ui/PageIntro'
import { featuredRoom, rooms } from '../data/rooms'
import type { Navigate } from '../types'
import { saveSelectedRoom } from '../utils/bookingSelections'
import { formatCurrency } from '../utils/currency'
import { getCurrentRoomSlug } from '../utils/router'

export function RoomDetailPage({ navigate }: { navigate: Navigate }) {
  const calendarDays = Array.from({ length: 31 }, (_, index) => index + 1)
  const room = rooms.find((item) => item.id === getCurrentRoomSlug()) ?? featuredRoom

  return (
    <main className="page-shell room-detail-page">
      <PageIntro
        eyebrow={room.category}
        title={room.name}
        copy="A detailed room view with gallery, amenities, price summary, and availability picker."
      />

      <section className="detail-grid">
        <div>
          <div className="gallery-layout">
            <img className="gallery-main" src={room.gallery[0]} alt={room.name} />
            <div className="gallery-side">
              {room.gallery.slice(1).map((image) => (
                <img src={image} alt={`${room.name} preview`} key={image} loading="lazy" />
              ))}
            </div>
          </div>

          <div className="detail-panel">
            <div className="rating-line">
              <span>
                <Icon name="star" />
                {room.rating} rating
              </span>
              <span>{room.reviews} verified reviews</span>
              <span>{room.location}</span>
            </div>
            <p>{room.description}</p>
            <div className="amenity-grid">
              {room.amenities.map((amenity) => (
                <span key={amenity}>
                  <Icon name={amenity.includes('Wi') ? 'wifi' : 'check'} size={15} />
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <div className="detail-panel">
            <div className="panel-title">
              <Icon name="calendar" />
              <span>Availability</span>
            </div>
            <div className="calendar-card">
              <div className="calendar-header">
                <button type="button" aria-label="Previous month">
                  <Icon name="chevron" />
                </button>
                <strong>October 2026</strong>
                <button type="button" aria-label="Next month">
                  <Icon name="chevron" />
                </button>
              </div>
              <div className="calendar-weekdays">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <span key={`${day}-${index}`}>{day}</span>
                ))}
              </div>
              <div className="calendar-grid">
                {calendarDays.map((day) => {
                  const available = room.availability.includes(day)
                  const selected = [10, 11, 12].includes(day)

                  return (
                    <button
                      className={`${available ? 'available' : ''} ${selected ? 'selected' : ''}`}
                      disabled={!available}
                      key={day}
                      type="button"
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <aside className="booking-panel">
          <div className="price-block">
            <span>Starting from</span>
            <strong>{formatCurrency(room.price)}</strong>
            <small>per night</small>
          </div>
          <div className="booking-fields">
            <label>
              Check in
              <input defaultValue="2026-10-10" type="date" />
            </label>
            <label>
              Check out
              <input defaultValue="2026-10-13" type="date" />
            </label>
            <label>
              Guests
              <select defaultValue={room.guests}>
                <option>2 guests</option>
                <option>3 guests</option>
                <option>4 guests</option>
              </select>
            </label>
          </div>
          <ul className="highlight-list">
            {room.highlights.map((item) => (
              <li key={item}>
                <Icon name="check" />
                {item}
              </li>
            ))}
          </ul>
          <button
            className="primary-button full-width"
            type="button"
            onClick={() => {
              saveSelectedRoom(room.id)
              navigate('booking')
            }}
          >
            Reserve Room
          </button>
        </aside>
      </section>
    </main>
  )
}