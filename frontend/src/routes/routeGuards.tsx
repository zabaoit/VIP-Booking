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
        <h1>Access denied</h1>
        <p>
          Current account is not an admin account. 
          Please log in with an account that has the admin role to access the admin dashboard.
        </p>
        <div>
          <button className="primary-button" type="button" onClick={() => navigate('login')}>
           Admin Login
          </button>
          <button className="ghost-button" type="button" onClick={() => navigate('home')}>
            Back to Home Page
          </button>
        </div>
      </section>
    </main>
  )
}
