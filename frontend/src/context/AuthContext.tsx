import { useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type AuthContextValue } from './authStore'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('vip-booking-auth') !== 'false'
  })

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      login: () => {
        localStorage.setItem('vip-booking-auth', 'true')
        setIsAuthenticated(true)
      },
      logout: () => {
        localStorage.setItem('vip-booking-auth', 'false')
        setIsAuthenticated(false)
      },
    }),
    [isAuthenticated],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
