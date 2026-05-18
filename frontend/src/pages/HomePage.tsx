import { SearchPanel } from '../components/search/SearchPanel'
import { Icon } from '../components/icons/Icon'
import { RoomCard } from '../components/rooms/RoomCard'
import { SectionHeading } from '../components/ui/SectionHeading'
import { images } from '../data/images'
import { rooms } from '../data/rooms'
import { services } from '../data/services'
import type { Navigate } from '../types'

export function HomePage({ navigate }: { navigate: Navigate }) {
  return (
    <main>
      <section className="hero-section" style={{ backgroundImage: `url(${images.hero})` }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">VIP hospitality platform</p>
          <h1>Experience Unparalleled Luxury</h1>
          <p>
            Reserve refined rooms, add personal services, and move from search to secure payment
            with the same polished flow shown in the VIP Booking demo.
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => navigate('rooms')}>
              Explore Rooms
            </button>
            <button className="secondary-button" type="button" onClick={() => navigate('contact')}>
              Concierge
            </button>
          </div>
        </div>
        <SearchPanel navigate={navigate} />
      </section>

      <section className="section-shell">
        <SectionHeading
          eyebrow="Featured stays"
          title="Rooms built for premium travel"
          actionLabel="View all"
          onAction={() => navigate('rooms')}
        />
        <div className="room-grid featured-grid">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} navigate={navigate} />
          ))}
        </div>
      </section>

      <section className="section-shell service-band">
        <SectionHeading eyebrow="Services" title="World-class amenities" />
        <div className="service-grid">
          {services.slice(0, 4).map((service) => (
            <article className="service-card" key={service.name}>
              <span className="icon-tile">
                <Icon name={service.icon} />
              </span>
              <h3>{service.name}</h3>
              <p>{service.note}</p>
              <span>{service.price}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell split-story">
        <div>
          <p className="eyebrow">Weekend retreat</p>
          <h2>Private dining, skyline rooms, and arrival support in one flow.</h2>
          <p>
            The interface keeps the guest journey visible: select a room, confirm service add-ons,
            review the invoice, and pay without losing booking context.
          </p>
          <button className="secondary-button" type="button" onClick={() => navigate('booking')}>
            Start Booking
          </button>
        </div>
        <img src={images.dining} alt="Luxury dinner setting" loading="lazy" />
      </section>
    </main>
  )
}
