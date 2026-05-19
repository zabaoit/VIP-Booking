import { useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type AuthContextValue, type AuthUser } from './authStore'

const authStorageKey = 'vip-booking-auth-user'

function readStoredUser(): AuthUser | null {
  const rawUser = localStorage.getItem(authStorageKey)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as AuthUser
  } catch {
    localStorage.removeItem(authStorageKey)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      user,
      login: (email) => {
        const nextUser: AuthUser = {
          email,
          role: email.trim().toLowerCase().startsWith('admin') ? 'admin' : 'guest',
        }

        localStorage.setItem(authStorageKey, JSON.stringify(nextUser))
        setUser(nextUser)
      },
      logout: () => {
        localStorage.removeItem(authStorageKey)
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}