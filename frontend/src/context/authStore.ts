import { createContext } from 'react'

export type UserRole = 'guest' | 'admin'

export type AuthUser = {
  email: string
  role: UserRole
}

export type AuthContextValue = {
  isAuthenticated: boolean
  user: AuthUser | null
  login: (email: string, password: string) => boolean
  register: (email: string, password: string) => void
  changePassword: (currentPassword: string, nextPassword: string) => boolean
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
