import { useEffect, type ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import type { Navigate } from '../types'

export function PublicRoute({ children }: { children: ReactNode }) {
  return children
}

export function PrivateRoute({ children, navigate }: { children: ReactNode; navigate: Navigate }) {
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('login')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return null
  }

  return children
}
