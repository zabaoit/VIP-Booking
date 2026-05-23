import type { Navigate } from '../../types'
import { readSupportInfo } from '../../utils/appStorage'
import { getRouteHref } from '../../utils/router'

export function SiteFooter({ navigate }: { navigate: Navigate }) {
  const currentYear = new Date().getFullYear()
  const supportInfo = readSupportInfo()

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <section className="footer-intro">
          <a className="brand" href={getRouteHref('home')}>
            <span className="brand-mark">VIP</span>
            <span>VIP Booking</span>
          </a>
          <p>
            Private hospitality booking for premium rooms, curated services, and fast payment.
            Designed for guests who expect precision and comfort in every step.
          </p>
          <div className="footer-cta">
            <button className="secondary-button compact" type="button" onClick={() => navigate('rooms')}>
              Explore Suites
            </button>
            <button className="ghost-button compact" type="button" onClick={() => navigate('contact')}>
              Contact Concierge
            </button>
          </div>
        </section>

        <section className="footer-column">
          <h4>Quick Access</h4>
          <div className="footer-links">
            <button type="button" onClick={() => navigate('rooms')}>
              Rooms
            </button>
            <button type="button" onClick={() => navigate('booking')}>
              Booking
            </button>
            <button type="button" onClick={() => navigate('profile')}>
              Profile
            </button>
            <button type="button" onClick={() => navigate('about')}>
              About
            </button>
          </div>
        </section>

        <section className="footer-column">
          <h4>Guest Support</h4>
          <div className="footer-contact">
            <p>24/7 Hotline: {supportInfo.hotline}</p>
            <p>Email: {supportInfo.email}</p>
            <p>Address: {supportInfo.address}</p>
          </div>
          <div className="footer-badges">
            {supportInfo.badges.map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
          </div>
        </section>
      </div>

      <div className="footer-bottom">
        <p>(c) {currentYear} VIP Booking. All rights reserved.</p>
        <div className="footer-bottom-links">
          <button type="button" onClick={() => navigate('contact')}>
            Support
          </button>
          <button type="button" onClick={() => navigate('admin')}>
            Admin
          </button>
        </div>
      </div>
    </footer>
  )
}

