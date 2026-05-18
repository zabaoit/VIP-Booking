import { Icon } from '../../components/icons/Icon'
import { rooms } from '../../data/rooms'
import { formatCurrency } from '../../utils/currency'

export function AdminRoomTypesPage() {
  return (
    <div className="admin-stack">
      <section className="admin-panel">
        <div className="admin-panel-header">
          <div className="panel-title">
            <Icon name="bed" />
            <span>Room Types Management</span>
          </div>
          <button className="primary-button compact" type="button">
            <Icon name="plus" />
            Add Room Type
          </button>
        </div>
        <div className="room-grid admin-room-grid">
          {rooms.map((room) => (
            <article className="admin-room-card" key={room.id}>
              <img src={room.image} alt={room.name} loading="lazy" />
              <div>
                <span>{room.category}</span>
                <h3>{room.name}</h3>
                <p>
                  {room.size} - {room.guests} - {room.bed}
                </p>
                <strong>{formatCurrency(room.price)}/night</strong>
              </div>
              <div className="row-actions">
                <button className="icon-button" type="button" aria-label={`Edit ${room.name}`}>
                  <Icon name="edit" />
                </button>
                <button
                  className="icon-button danger"
                  type="button"
                  aria-label={`Delete ${room.name}`}
                >
                  <Icon name="trash" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
