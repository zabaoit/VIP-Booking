import type { Navigate } from '../../types'
import { getRouteHref } from '../../utils/router'

export function SiteFooter({ navigate }: { navigate: Navigate }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <section className="footer-brand-block">
          <a className="brand" href={getRouteHref('home')}>
            <span className="brand-mark">VIP</span>
            <span>VIP Booking</span>
          </a>
          <p>
            Elevating premium travel with curated suites, private concierge service, and a secure
            booking journey from discovery to payment.
          </p>
          <div className="footer-cta-row">
            <button className="secondary-button compact" type="button" onClick={() => navigate('rooms')}>
              Explore Suites
            </button>
            <button className="ghost-button compact" type="button" onClick={() => navigate('contact')}>
              Contact Concierge
            </button>
          </div>
        </section>

        <div className="footer-grid">
          <section className="footer-column">
            <h4>Quick Links</h4>
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
            <div className="footer-contact-list">
              <p>24/7 Concierge Hotline</p>
              <p>+84 901 123 456</p>
              <p>guest@vipbooking.vn</p>
              <p>12 Nguyen Hue, Ho Chi Minh City</p>
            </div>
          </section>

          <section className="footer-column">
            <h4>Why VIP Booking</h4>
            <div className="footer-badges">
              <span>Luxury Suites</span>
              <span>Secure Checkout</span>
              <span>Elite Service</span>
              <span>Fast Confirmation</span>
            </div>
          </section>
        </div>
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

