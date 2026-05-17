import { routePaths } from '../../data/routes'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <a className="brand" href={`#/${routePaths.home}`}>
          <span className="brand-mark">VIP</span>
          <span>VIP Booking</span>
        </a>
        <p>Private hospitality booking for premium rooms, curated services, and fast payment.</p>
      </div>
      <div className="footer-links">
        <a href={`#/${routePaths.rooms}`}>Rooms</a>
        <a href={`#/${routePaths.contact}`}>Contact</a>
        <a href={`#/${routePaths.about}`}>About</a>
        <a href={`#/${routePaths.admin}`}>Admin</a>
      </div>
    </footer>
  )
}
