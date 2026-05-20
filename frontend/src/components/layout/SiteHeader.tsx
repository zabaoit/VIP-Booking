import { useState, type FormEvent } from 'react'
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
  const { changePassword, isAuthenticated, logout, user } = useAuth()
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleLogout = () => {
    logout()
    setIsAccountOpen(false)
    navigate('home')
  }

  const handleChangePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const currentPassword = String(formData.get('currentPassword') ?? '')
    const nextPassword = String(formData.get('nextPassword') ?? '')
    const confirmPassword = String(formData.get('confirmPassword') ?? '')

    if (!currentPassword || !nextPassword || !confirmPassword) {
      setPasswordError('Vui long nhap day du thong tin.')
      setPasswordMessage('')
      return
    }

    if (nextPassword !== confirmPassword) {
      setPasswordError('Mat khau xac nhan khong khop.')
      setPasswordMessage('')
      return
    }

    if (!changePassword(currentPassword, nextPassword)) {
      setPasswordError('Mat khau hien tai khong dung.')
      setPasswordMessage('')
      return
    }

    setPasswordError('')
    setPasswordMessage('Doi mat khau thanh cong. Lan dang nhap sau hay dung mat khau moi.')
    event.currentTarget.reset()
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
                <button
                  className="ghost-button full-width"
                  type="button"
                  onClick={() => {
                    setIsPasswordModalOpen(true)
                    setIsAccountOpen(false)
                    setPasswordError('')
                    setPasswordMessage('')
                  }}
                >
                  Change password
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
      {isPasswordModalOpen && (
        <div className="admin-modal-backdrop" role="presentation">
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="change-password-title"
          >
            <div className="admin-modal-header">
              <div>
                <p className="eyebrow">Account security</p>
                <h2 id="change-password-title">Doi mat khau</h2>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label="Close change password form"
                onClick={() => setIsPasswordModalOpen(false)}
              >
                <Icon name="close" />
              </button>
            </div>

            <form className="admin-room-form" onSubmit={handleChangePassword}>
              <label className="span-2">
                Tai khoan
                <input value={user?.email ?? ''} readOnly />
              </label>
              <label className="span-2">
                Mat khau hien tai
                <input name="currentPassword" type="password" required />
              </label>
              <label>
                Mat khau moi
                <input name="nextPassword" type="password" required />
              </label>
              <label>
                Xac nhan mat khau moi
                <input name="confirmPassword" type="password" required />
              </label>
              {passwordError && <p className="form-error span-2">{passwordError}</p>}
              {passwordMessage && <p className="form-success span-2">{passwordMessage}</p>}
              <div className="admin-modal-actions span-2">
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Huy
                </button>
                <button className="primary-button" type="submit">
                  Luu mat khau
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </header>
  )
}
