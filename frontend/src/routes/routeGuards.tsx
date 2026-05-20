import { useEffect, type ReactNode } from 'react'
import { Icon } from '../components/icons/Icon'
import { useAuth } from '../hooks/useAuth'
import type { Navigate } from '../types'

export function PublicRoute({ children }: { children: ReactNode }) {
  return children
}

export function PrivateRoute({
  children,
  navigate,
  requireAdmin = false,
}: {
  children: ReactNode
  navigate: Navigate
  requireAdmin?: boolean
}) {
  const { isAuthenticated, user } = useAuth()
  const isAdminAllowed = !requireAdmin || user?.role === 'admin'

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('login')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return null
  }

  if (!isAdminAllowed) {
    return <AccessDeniedNotice navigate={navigate} />
  }

  return children
}

function AccessDeniedNotice({ navigate }: { navigate: Navigate }) {
  return (
    <main className="access-denied-page">
      <section className="access-denied-panel">
        <span className="status-icon failed">
          <Icon name="lock" size={28} />
        </span>
        <p className="eyebrow">Admin access</p>
        <h1>Khong co quyen truy cap</h1>
        <p>
          Tai khoan hien tai khong phai tai khoan admin. Vui long dang nhap bang tai khoan
          co role admin de vao trang quan tri.
        </p>
        <div>
          <button className="primary-button" type="button" onClick={() => navigate('login')}>
            Dang nhap admin
          </button>
          <button className="ghost-button" type="button" onClick={() => navigate('home')}>
            Ve trang chu
          </button>
        </div>
      </section>
    </main>
  )
}
