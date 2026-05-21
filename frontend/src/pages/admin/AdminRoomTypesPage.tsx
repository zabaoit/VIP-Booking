import { useState, type FormEvent } from 'react'
import { Icon } from '../../components/icons/Icon'
import { rooms } from '../../data/rooms'
import type { Room } from '../../types'
import { formatCurrency } from '../../utils/currency'

function createRoomId(name: string) {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `room-${Date.now()}`
  )
}

export function AdminRoomTypesPage() {
  const [roomTypes, setRoomTypes] = useState<Room[]>(rooms)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState<'All' | 'Available' | 'Occupied' | 'Maintenance'>(
    'All',
  )
  const activeRoom = editingRoom
  const isModalOpen = isAddModalOpen || Boolean(editingRoom)

  const closeRoomModal = () => {
    setIsAddModalOpen(false)
    setEditingRoom(null)
  }

  const handleRoomTypeSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const category = String(formData.get('category') ?? '').trim()
    const price = Number(formData.get('price') ?? 0)

    if (!name || !category || price <= 0) {
      return
    }

    const image = String(formData.get('image') ?? '').trim() || activeRoom?.image || rooms[0].image
    const nextRoom: Room = {
      id: activeRoom?.id ?? createRoomId(name),
      name,
      category,
      location:
        String(formData.get('location') ?? '').trim() || activeRoom?.location || 'Main Tower',
      price,
      rating: activeRoom?.rating ?? 4.8,
      reviews: activeRoom?.reviews ?? 0,
      size: String(formData.get('size') ?? '').trim() || activeRoom?.size || '45 m2',
      guests: String(formData.get('guests') ?? '').trim() || activeRoom?.guests || '2 guests',
      bed: String(formData.get('bed') ?? '').trim() || activeRoom?.bed || 'King bed',
      image,
      gallery: activeRoom?.gallery ?? [image, rooms[1].image, rooms[2].image],
      description:
        String(formData.get('description') ?? '').trim() ||
        activeRoom?.description ||
        'A newly added room type ready for booking setup and detailed service configuration.',
      amenities: activeRoom?.amenities ?? ['Smart climate control', 'Premium minibar', 'High speed Wi-Fi'],
      highlights: activeRoom?.highlights ?? ['Flexible hold', 'Guest ready', 'Admin managed'],
      availability: activeRoom?.availability ?? [4, 5, 10, 11, 12, 18, 19, 23, 24],
    }

    setRoomTypes((current) =>
      activeRoom
        ? current.map((room) => (room.id === activeRoom.id ? nextRoom : room))
        : [nextRoom, ...current],
    )
    closeRoomModal()
    event.currentTarget.reset()
  }

  const handleDeleteRoomType = (room: Room) => {
    const shouldDelete = window.confirm(`Delete room type "${room.name}"?`)

    if (shouldDelete) {
      setRoomTypes((current) => current.filter((item) => item.id !== room.id))
    }
  }

  const filteredRooms = roomTypes.filter((room, index) => {
    const searchTerm = search.trim().toLowerCase()
    const textMatch =
      !searchTerm ||
      room.name.toLowerCase().includes(searchTerm) ||
      room.id.toLowerCase().includes(searchTerm) ||
      room.category.toLowerCase().includes(searchTerm) ||
      room.location.toLowerCase().includes(searchTerm)

    const status = index % 4 === 0 ? 'Available' : index % 4 === 1 ? 'Occupied' : index % 4 === 2 ? 'Maintenance' : 'Available'
    const statusMatch = classFilter === 'All' || classFilter === status

    return textMatch && statusMatch
  })

  return (
    <div className="admin-stack">
      <section className="admin-panel">
        <div className="admin-panel-header">
          <div className="panel-title">
            <Icon name="bed" />
            <span>Room Types Management</span>
          </div>
          <button
            className="primary-button compact"
            type="button"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Icon name="plus" />
            Add Room Type
          </button>
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <label className="flex-1 min-w-[240px]">
            <input
              value={search}
              placeholder="Search by room number, type, or guest..."
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          {(['All', 'Available', 'Occupied', 'Maintenance'] as const).map((filter) => (
            <button
              key={filter}
              className={`ghost-button compact ${classFilter === filter ? 'border-slate-500 text-white' : ''}`}
              type="button"
              onClick={() => setClassFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Room</th>
                <th>Type</th>
                <th>Floor</th>
                <th>Status</th>
                <th>Housekeeping</th>
                <th>Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((room, index) => {
                const status = index % 4 === 0 ? 'Available' : index % 4 === 1 ? 'Occupied' : index % 4 === 2 ? 'Maintenance' : 'Reserved'
                const statusClass = status === 'Available' ? 'success' : status === 'Maintenance' ? 'failed' : 'pending'
                const housekeeping = index % 3 === 0 ? 'Clean' : index % 3 === 1 ? 'Dirty' : 'Blocked'

                return (
                  <tr key={room.id}>
                    <td>{room.id.slice(0, 3).toUpperCase()}</td>
                    <td>
                      <strong>{room.name}</strong>
                    </td>
                    <td>{room.location}</td>
                    <td>
                      <span className={`status-chip ${statusClass}`}>{status}</span>
                    </td>
                    <td>{housekeeping}</td>
                    <td>{formatCurrency(room.price)}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="link-button"
                          type="button"
                          onClick={() => setEditingRoom(room)}
                        >
                          Edit
                        </button>
                        <button
                          className="link-button"
                          type="button"
                          onClick={() => handleDeleteRoomType(room)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredRooms.length === 0 && (
                <tr>
                  <td colSpan={7}>No rooms found for this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <div className="admin-modal-backdrop" role="presentation">
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="room-type-form-title"
          >
            <div className="admin-modal-header">
              <div>
                <p className="eyebrow">Room inventory</p>
                <h2 id="room-type-form-title">
                  {activeRoom ? 'Edit Room Type' : 'Add Room Type'}
                </h2>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label="Close room type form"
                onClick={closeRoomModal}
              >
                <Icon name="close" />
              </button>
            </div>
            <form className="admin-room-form" onSubmit={handleRoomTypeSubmit}>
              <label>
                Room name
                <input
                  name="name"
                  defaultValue={activeRoom?.name}
                  placeholder="Presidential Skyline Suite"
                  required
                />
              </label>
              <label>
                Category
                <input
                  name="category"
                  defaultValue={activeRoom?.category}
                  placeholder="Signature Suite"
                  required
                />
              </label>
              <label>
                Price per night
                <input
                  name="price"
                  defaultValue={activeRoom?.price}
                  min="1"
                  placeholder="680"
                  required
                  type="number"
                />
              </label>
              <label>
                Location
                <input
                  name="location"
                  defaultValue={activeRoom?.location}
                  placeholder="East Tower, Level 22"
                />
              </label>
              <label>
                Size
                <input name="size" defaultValue={activeRoom?.size} placeholder="82 m2" />
              </label>
              <label>
                Guests
                <select name="guests" defaultValue={activeRoom?.guests ?? '2 guests'}>
                  <option>1 guest</option>
                  <option>2 guests</option>
                  <option>3 guests</option>
                  <option>4 guests</option>
                  <option>6 guests</option>
                </select>
              </label>
              <label>
                Bed
                <input name="bed" defaultValue={activeRoom?.bed} placeholder="King bed" />
              </label>
              <label>
                Image URL
                <input
                  name="image"
                  defaultValue={activeRoom?.image}
                  placeholder="Leave empty to use default room image"
                />
              </label>
              <label className="span-2">
                Description
                <textarea
                  name="description"
                  defaultValue={activeRoom?.description}
                  placeholder="Short room description shown to guests."
                  rows={4}
                />
              </label>
              <div className="admin-modal-actions span-2">
                <button
                  className="ghost-button"
                  type="button"
                  onClick={closeRoomModal}
                >
                  Cancel
                </button>
                <button className="primary-button" type="submit">
                  <Icon name={activeRoom ? 'check' : 'plus'} />
                  {activeRoom ? 'Update Room Type' : 'Save Room Type'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
