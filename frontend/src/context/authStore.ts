import { createContext } from 'react'

export type UserRole = 'guest' | 'admin'

export type AuthUser = {
  email: string
  role: UserRole
}

export type AuthContextValue = {
  isAuthenticated: boolean
  user: AuthUser | null
  login: (email: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)