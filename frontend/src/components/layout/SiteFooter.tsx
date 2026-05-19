import type { Navigate } from '../../types'
import { getRouteHref } from '../../utils/router'

export function SiteFooter({ navigate }: { navigate: Navigate }) {
  return (
    <footer className="site-footer">
      <div>
        <a className="brand" href={getRouteHref('home')}>
          <span className="brand-mark">VIP</span>
          <span>VIP Booking</span>
        </a>
        <p>Private hospitality booking for premium rooms, curated services, and fast payment.</p>
      </div>

      <div className="footer-links">
        <button type="button" onClick={() => navigate('rooms')}>
          Rooms
        </button>
        <button type="button" onClick={() => navigate('contact')}>
          Contact
        </button>
        <button type="button" onClick={() => navigate('about')}>
          About
        </button>
        <button type="button" onClick={() => navigate('admin')}>
          Admin
        </button>
      </div>
    </footer>
  )
}