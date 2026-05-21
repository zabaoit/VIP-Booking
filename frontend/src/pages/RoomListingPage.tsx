import { useMemo, useState } from 'react'
import { Icon } from '../components/icons/Icon'
import { FilterGroup } from '../components/rooms/FilterGroup'
import { RoomCard } from '../components/rooms/RoomCard'
import { PageIntro } from '../components/ui/PageIntro'
import { rooms } from '../data/rooms'
import type { Navigate } from '../types'

const priceOptions = ['$250 - $350', '$350 - $500', '$500+'] as const
const roomClassOptions = ['Suite', 'Business', 'Family', 'Residence'] as const
const amenityOptions = ['Breakfast', 'Balcony', 'Spa access', 'Airport pickup'] as const

export function RoomListingPage({ navigate }: { navigate: Navigate }) {
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [selectedRoomClasses, setSelectedRoomClasses] = useState<string[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'rating'>('recommended')

  const toggleOption = (
    option: string,
    setItems: (value: string[] | ((previous: string[]) => string[])) => void,
  ) => {
    setItems((previous) =>
      previous.includes(option) ? previous.filter((item) => item !== option) : [...previous, option],
    )
  }

  const filteredRooms = useMemo(() => {
    const result = rooms.filter((room) => {
      const matchPrice =
        selectedPrices.length === 0 ||
        selectedPrices.some((price) => {
          if (price === '$250 - $350') {
            return room.price >= 250 && room.price <= 350
          }
          if (price === '$350 - $500') {
            return room.price > 350 && room.price <= 500
          }
          return room.price > 500
        })

      const roomInfo = `${room.category} ${room.name}`.toLowerCase()
      const matchRoomClass =
        selectedRoomClasses.length === 0 ||
        selectedRoomClasses.some((roomClass) => {
          if (roomClass === 'Suite') {
            return roomInfo.includes('suite')
          }
          if (roomClass === 'Business') {
            return roomInfo.includes('business')
          }
          if (roomClass === 'Family') {
            return roomInfo.includes('family')
          }
          return roomInfo.includes('residence')
        })

      const roomFeatures = [...room.amenities, ...room.highlights].join(' ').toLowerCase()
      const matchAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((amenity) => {
          if (amenity === 'Breakfast') {
            return roomFeatures.includes('breakfast')
          }
          if (amenity === 'Balcony') {
            return roomFeatures.includes('balcony') || roomFeatures.includes('terrace')
          }
          if (amenity === 'Spa access') {
            return roomFeatures.includes('spa')
          }
          return roomFeatures.includes('airport') || roomFeatures.includes('limousine')
        })

      return matchPrice && matchRoomClass && matchAmenities
    })

    if (sortBy === 'price-low') {
      return [...result].sort((a, b) => a.price - b.price)
    }
    if (sortBy === 'rating') {
      return [...result].sort((a, b) => b.rating - a.rating)
    }
    return result
  }, [selectedAmenities, selectedPrices, selectedRoomClasses, sortBy])

  return (
    <main className="mx-auto w-full max-w-[1180px] px-5 py-12">
      <PageIntro
        eyebrow="Room listing"
        title="Available Rooms"
        copy="Filter premium room types by stay style, amenities, price and guest count."
      />

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside
          className="grid gap-5 rounded-xl border border-slate-700 bg-slate-900/80 p-4 lg:sticky lg:top-24"
          aria-label="Room filters"
        >
          <div className="inline-flex items-center gap-2 text-lg font-semibold text-white">
            <Icon name="filter" size={18} />
            <span>Filters</span>
          </div>
          <FilterGroup
            title="Price range"
            options={[...priceOptions]}
            selectedOptions={selectedPrices}
            onToggle={(option) => toggleOption(option, setSelectedPrices)}
          />
          <FilterGroup
            title="Room class"
            options={[...roomClassOptions]}
            selectedOptions={selectedRoomClasses}
            onToggle={(option) => toggleOption(option, setSelectedRoomClasses)}
          />
          <FilterGroup
            title="Amenities"
            options={[...amenityOptions]}
            selectedOptions={selectedAmenities}
            onToggle={(option) => toggleOption(option, setSelectedAmenities)}
          />
        </aside>

        <section className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-900/75 p-3">
            <p className="text-slate-300">
              <strong className="text-white">{filteredRooms.length}</strong> curated rooms found
            </p>
            <select
              className="h-10 min-w-[190px] rounded-lg border border-slate-600 bg-slate-950 px-3 text-sm text-slate-100 outline-none transition focus:border-blue-400"
              value={sortBy}
              aria-label="Sort rooms"
              onChange={(event) =>
                setSortBy(event.target.value as 'recommended' | 'price-low' | 'rating')
              }
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: low to high</option>
              <option value="rating">Highest rating</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} navigate={navigate} />
            ))}
          </div>
          {filteredRooms.length === 0 && (
            <p className="rounded-lg border border-slate-700 bg-slate-900/70 p-4 text-sm text-slate-300">
              No rooms match the current filter set. Try removing one or more filters.
            </p>
          )}
        </section>
      </div>
    </main>
  )
}
