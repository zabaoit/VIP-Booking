import { navItems } from '../../data/navigation'
import { routePaths } from '../../data/routes'
import type { Navigate, RouteKey } from '../../types'
import { Icon } from '../icons/Icon'

export function SiteHeader({
  currentRoute,
  isMenuOpen,
  navigate,
  onCloseMenu,
  onToggleMenu,
}: {
  currentRoute: RouteKey
  isMenuOpen: boolean
  navigate: Navigate
  onCloseMenu: () => void
  onToggleMenu: () => void
}) {
  return (
    <header className="site-header">
      <a className="brand" href={`#/${routePaths.home}`} aria-label="VIP Booking home">
        <span className="brand-mark">VIP</span>
        <span>VIP Booking</span>
      </a>

      <button className="icon-button mobile-menu-button" type="button" onClick={onToggleMenu}>
        <Icon name={isMenuOpen ? 'close' : 'menu'} />
      </button>

      <nav className={`main-nav ${isMenuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
        {navItems.map((item) => (
          <a
            className={currentRoute === item.route ? 'active' : ''}
            href={`#/${routePaths[item.route]}`}
            key={item.route}
            onClick={onCloseMenu}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <button className="ghost-button" type="button" onClick={() => navigate('login')}>
          Login
        </button>
        <button className="primary-button compact" type="button" onClick={() => navigate('rooms')}>
          Book Now
        </button>
      </div>
    </header>
  )
}
