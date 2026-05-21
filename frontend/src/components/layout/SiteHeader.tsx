import { navItems } from '../../data/navigation'
import { useAuth } from '../../hooks/useAuth'
import type { Navigate, RouteKey } from '../../types'
import { getRouteHref } from '../../utils/router'
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
  const { isAuthenticated } = useAuth()

  return (
    <header className="site-header">
      <a className="brand" href={getRouteHref('home')} aria-label="VIP Booking home">
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
            href={getRouteHref(item.route)}
            key={item.route}
            onClick={onCloseMenu}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <button className="primary-button compact" type="button" onClick={() => navigate('rooms')}>
          Book Now
        </button>
        {isAuthenticated ? (
          <button
            className="account-avatar"
            type="button"
            aria-label="Open profile page"
            onClick={() => navigate('profile')}
          >
            <Icon name="user" size={28} />
          </button>
        ) : (
          <button className="ghost-button" type="button" onClick={() => navigate('login')}>
            Login
          </button>
        )}
      </div>
    </header>
  )
}
