import type { Navigate } from '../../types'
import { handleRouteSubmit } from '../../utils/forms'
import { Icon } from '../icons/Icon'

export function SearchPanel({ navigate }: { navigate: Navigate }) {
  return (
    <form
      className="search-panel"
      onSubmit={(event) => handleRouteSubmit(event, 'rooms', navigate)}
    >
      <label>
        <span>Destination</span>
        <input defaultValue="Da Nang Oceanfront" />
      </label>
      <label>
        <span>Check in</span>
        <input defaultValue="2026-10-10" type="date" />
      </label>
      <label>
        <span>Check out</span>
        <input defaultValue="2026-10-13" type="date" />
      </label>
      <label>
        <span>Guests</span>
        <select defaultValue="2 guests">
          <option>1 guest</option>
          <option>2 guests</option>
          <option>3 guests</option>
          <option>4 guests</option>
        </select>
      </label>
      <button className="primary-button search-button" type="submit">
        <Icon name="search" />
        Search
      </button>
    </form>
  )
}