import type { Navigate } from '../../types'
import { readSupportInfo } from '../../utils/appStorage'
import { getRouteHref } from '../../utils/router'

export function SiteFooter({ navigate }: { navigate: Navigate }) {
  const currentYear = new Date().getFullYear()
  const supportInfo = readSupportInfo()

  return (
    <footer className="site-footer">
      <div className="footer-wide">
        <section className="footer-company">
          <a
            className="brand footer-brand"
            href={getRouteHref('home')}
            onClick={(event) => {
              event.preventDefault()
              navigate('home')
            }}
          >
            <span className="brand-mark">VIP</span>
            <span>VIP Booking</span>
          </a>
          <strong>VIP Hospitality Booking Company</strong>
          <p>{supportInfo.address}</p>
          <p>{supportInfo.email}</p>
          <button className="footer-hotline" type="button" onClick={() => navigate('contact')}>
            {supportInfo.hotline}
          </button>
          <small>24/7 concierge and guest assistance</small>
        </section>

        <section className="footer-column">
          <h4>Information</h4>
          <div className="footer-links">
            <button type="button" onClick={() => navigate('about')}>
              About us
            </button>
            <button type="button" onClick={() => navigate('rooms')}>
              Rooms
            </button>
            <button type="button" onClick={() => navigate('booking')}>
              Booking guide
            </button>
            <button type="button" onClick={() => navigate('profile')}>
              Guest profile
            </button>
            <button type="button" onClick={() => navigate('contact')}>
              Help center
            </button>
          </div>
        </section>

        <section className="footer-column">
          <h4>Terms</h4>
          <div className="footer-links">
            <button type="button" onClick={() => navigate('contact')}>
              Privacy policy
            </button>
            <button type="button" onClick={() => navigate('contact')}>
              Terms of use
            </button>
            <button type="button" onClick={() => navigate('contact')}>
              Data protection
            </button>
            <button type="button" onClick={() => navigate('admin')}>
              Admin portal
            </button>
          </div>
        </section>
      </div>

      <div className="footer-legal">
        <p>© {currentYear} VIP Booking. All rights reserved.</p>
        <p>Premium room reservations, curated services, and secure payment for every stay.</p>
      </div>
    </footer>
  )
}

