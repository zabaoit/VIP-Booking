import { Icon } from '../components/icons/Icon'
import { FilterGroup } from '../components/rooms/FilterGroup'
import { RoomCard } from '../components/rooms/RoomCard'
import { PageIntro } from '../components/ui/PageIntro'
import { rooms } from '../data/rooms'
import type { Navigate } from '../types'

export function RoomListingPage({ navigate }: { navigate: Navigate }) {
  return (
    <main className="page-shell">
      <PageIntro
        eyebrow="Room listing"
        title="Available Rooms"
        copy="Filter premium room types by stay style, amenities, price and guest count."
      />

      <div className="listing-layout">
        <aside className="filter-panel" aria-label="Room filters">
          <div className="panel-title">
            <Icon name="filter" />
            <span>Filters</span>
          </div>
          <FilterGroup title="Price range" options={['$250 - $350', '$350 - $500', '$500+']} />
          <FilterGroup title="Room class" options={['Suite', 'Business', 'Family', 'Residence']} />
          <FilterGroup
            title="Amenities"
            options={['Breakfast', 'Balcony', 'Spa access', 'Airport pickup']}
          />
        </aside>

        <section className="listing-results">
          <div className="results-toolbar">
            <p>
              <strong>{rooms.length}</strong> curated rooms found
            </p>
            <select defaultValue="recommended" aria-label="Sort rooms">
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: low to high</option>
              <option value="rating">Highest rating</option>
            </select>
          </div>

          <div className="room-grid">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} navigate={navigate} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
