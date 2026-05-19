import { useState } from 'react'
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
  const { isAuthenticated, logout, user } = useAuth()
  const [isAccountOpen, setIsAccountOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setIsAccountOpen(false)
    navigate('home')
  }

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
        {isAuthenticated && user ? (
          <div className="account-menu">
            <button
              className="account-avatar"
              type="button"
              aria-label="Open account menu"
              aria-expanded={isAccountOpen}
              onClick={() => setIsAccountOpen((value) => !value)}
            >
              <Icon name="user" size={28} />
            </button>
            {isAccountOpen && (
              <div className="account-popover">
                <div>
                  <span className="account-avatar large">
                    <Icon name="user" size={34} />
                  </span>
                  <div>
                    <strong>{user.email}</strong>
                    <small>{user.role === 'admin' ? 'Admin account' : 'Guest account'}</small>
                  </div>
                </div>
                <button className="ghost-button full-width" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="ghost-button" type="button" onClick={() => navigate('login')}>
            Login
          </button>
        )}
        <button className="primary-button compact" type="button" onClick={() => navigate('rooms')}>
          Book Now
        </button>
      </div>
    </header>
  )
}