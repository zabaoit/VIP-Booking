import type { Navigate, Room } from '../../types'
import { saveSelectedRoom } from '../../utils/bookingSelections'
import { formatCurrency } from '../../utils/currency'
import { useAuth } from '../../hooks/useAuth'
import { Icon } from '../icons/Icon'

export function RoomCard({ room, navigate }: { room: Room; navigate: Navigate }) {
  const { isAuthenticated } = useAuth()

  const handleBook = () => {
    saveSelectedRoom(room.id)

    if (!isAuthenticated) {
      window.sessionStorage.setItem('vip-booking:pending-route', 'booking')
      navigate('login')
      return
    }

    navigate('booking')
  }

  return (
    <article className="group overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/80 shadow-[0_22px_48px_rgba(2,8,23,0.45)]">
      <div className="relative h-56 overflow-hidden">
        <img
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={room.image}
          alt={room.name}
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-md border border-amber-300/35 bg-slate-950/80 px-2 py-1 text-[11px] font-semibold text-amber-300">
          {room.category}
        </span>
      </div>
      <div className="grid gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">{room.name}</h3>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-300">
              <Icon name="mapPin" size={14} />
              {room.location}
            </p>
          </div>
          <div className="inline-flex items-center gap-1 rounded-md bg-amber-300/15 px-2 py-1 text-sm font-semibold text-amber-300">
            <Icon name="star" size={14} />
            {room.rating}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="users" size={15} />
            {room.guests}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="bed" size={15} />
            {room.bed}
          </span>
          <span>{room.size}</span>
        </div>
        <p className="text-[15px] leading-relaxed text-slate-300">{room.description}</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <strong className="inline-flex items-baseline gap-1 text-2xl font-semibold text-white">
            {formatCurrency(room.price)}
            <small className="text-xs font-medium text-slate-400">/night</small>
          </strong>
          <div className="flex gap-2">
            <button
              className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-600 bg-slate-800/70 px-3 text-sm font-semibold text-slate-200 transition hover:border-slate-400 hover:text-white"
              type="button"
              onClick={() => {
                saveSelectedRoom(room.id)
                navigate('roomDetail', { path: `rooms/${room.id}` })
              }}
            >
              Details
            </button>
            <button
              className="inline-flex h-9 items-center justify-center rounded-lg bg-gradient-to-b from-blue-400 to-blue-600 px-4 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(37,99,235,0.35)] transition hover:brightness-110"
              type="button"
              onClick={handleBook}
            >
              Book
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
