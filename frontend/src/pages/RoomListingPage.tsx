import { useEffect, useMemo, useState } from 'react'
import { fetchRooms } from '../api/vipBookingApi'
import { Icon } from '../components/icons/Icon'
import { FilterGroup } from '../components/rooms/FilterGroup'
import { RoomCard } from '../components/rooms/RoomCard'
import { PageIntro } from '../components/ui/PageIntro'
import { useToast } from '../context/ToastContext'
import type { Navigate, Room } from '../types'
import { getRoomSearchQuery, saveRoomSearchQuery } from '../utils/bookingSelections'

const priceOptions = ['Under 1,000,000 VND', '1,000,000 - 2,000,000 VND', 'Over 2,000,000 VND'] as const
const roomClassOptions = ['Suite', 'Business', 'Family', 'Residence'] as const
const amenityOptions = ['Breakfast', 'Balcony', 'Spa access', 'Airport pickup'] as const

export function RoomListingPage({ navigate }: { navigate: Navigate }) {
  const { showToast } = useToast()
  const [rooms, setRooms] = useState<Room[]>([])
  const [, setDataError] = useState('')
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [selectedRoomClasses, setSelectedRoomClasses] = useState<string[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState(() => getRoomSearchQuery())
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'rating'>('recommended')

  useEffect(() => {
    let isMounted = true

    fetchRooms()
      .then((nextRooms) => {
        if (!isMounted) return
        setRooms(nextRooms)
        setDataError('')
      })
      .catch((error) => {
        if (!isMounted) return
        const message = error instanceof Error ? error.message : 'Could not load rooms.'
        setDataError(message)
        showToast({ title: 'Could not load rooms', message, variant: 'error' })
      })

    return () => {
      isMounted = false
    }
  }, [])

  const toggleOption = (
    option: string,
    setItems: (value: string[] | ((previous: string[]) => string[])) => void,
  ) => {
    setItems((previous) =>
      previous.includes(option) ? previous.filter((item) => item !== option) : [...previous, option],
    )
  }

  const filteredRooms = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase()
    const result = rooms.filter((room) => {
      const searchableText = [
        room.name,
        room.category,
        room.location,
        room.description,
        ...room.amenities,
        ...room.highlights,
      ]
        .join(' ')
        .toLowerCase()

      const matchSearchQuery =
        normalizedSearchQuery.length === 0 || searchableText.includes(normalizedSearchQuery)

      const matchPrice =
        selectedPrices.length === 0 ||
        selectedPrices.some((price) => {
          if (price === 'Under 1,000,000 VND') {
            return room.price < 1_000_000
          }
          if (price === '1,000,000 - 2,000,000 VND') {
            return room.price >= 1_000_000 && room.price <= 2_000_000
          }
          return room.price > 2_000_000
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

      return matchSearchQuery && matchPrice && matchRoomClass && matchAmenities
    })

    if (sortBy === 'price-low') {
      return [...result].sort((a, b) => a.price - b.price)
    }
    if (sortBy === 'rating') {
      return [...result].sort((a, b) => b.rating - a.rating)
    }
    return result
  }, [rooms, searchQuery, selectedAmenities, selectedPrices, selectedRoomClasses, sortBy])

  return (
    <main className="w-full px-4 py-12 sm:px-6 lg:px-8">
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
            <div className="grid w-full gap-3 md:grid-cols-[minmax(220px,1fr)_auto] md:items-center">
              <div className="flex items-center gap-2">
                <input
                  className="h-10 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 text-sm text-slate-100 outline-none transition focus:border-blue-400"
                  value={searchQuery}
                  placeholder="Search destination, room, or amenity..."
                  aria-label="Search rooms"
                  onChange={(event) => {
                    const nextQuery = event.target.value
                    setSearchQuery(nextQuery)
                    saveRoomSearchQuery(nextQuery)
                  }}
                />
                {searchQuery.trim() && (
                  <button
                    className="ghost-button compact"
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      saveRoomSearchQuery('')
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>

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

            <p className="w-full text-slate-300">
              <strong className="text-white">{filteredRooms.length}</strong> curated rooms found
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
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


