import { useMemo, useState, type ReactNode } from 'react'
import {
  AuthContext,
  type AuthContextValue,
  type AuthUser,
} from './authStore'
import type { RegisteredUser } from '../types'
import { registeredUsersStorageKey } from '../utils/appStorage'

const authStorageKey = 'vip-booking-auth-user'
const defaultRegisteredUsers: RegisteredUser[] = [
  {
    email: 'admin@vipbooking.vn',
    password: 'admin123',
    role: 'admin',
  },
  {
    email: 'guest@vipbooking.vn',
    password: 'vipbooking',
    role: 'guest',
  },
]

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function getUserRole(email: string) {
  return normalizeEmail(email).startsWith('admin') ? 'admin' : 'guest'
}

function readStoredUser(): AuthUser | null {
  const rawUser = localStorage.getItem(authStorageKey)

  if (!rawUser) {
    return null
  }

  try {
    const storedUser = JSON.parse(rawUser) as AuthUser
    const isRegistered = readRegisteredUsers().some(
      (registeredUser) => normalizeEmail(registeredUser.email) === normalizeEmail(storedUser.email),
    )

    if (!isRegistered) {
      localStorage.removeItem(authStorageKey)
      return null
    }

    return storedUser
  } catch {
    localStorage.removeItem(authStorageKey)
    return null
  }
}

function readRegisteredUsers(): RegisteredUser[] {
  const rawUsers = localStorage.getItem(registeredUsersStorageKey)

  if (!rawUsers) {
    saveRegisteredUsers(defaultRegisteredUsers)
    return defaultRegisteredUsers
  }

  try {
    const users = JSON.parse(rawUsers) as RegisteredUser[]
    if (!Array.isArray(users)) {
      saveRegisteredUsers(defaultRegisteredUsers)
      return defaultRegisteredUsers
    }

    const usersWithDefaults = [...users]
    let hasMissingDefaultUser = false

    defaultRegisteredUsers.forEach((defaultUser) => {
      const exists = usersWithDefaults.some(
        (user) => normalizeEmail(user.email) === normalizeEmail(defaultUser.email),
      )

      if (!exists) {
        usersWithDefaults.push(defaultUser)
        hasMissingDefaultUser = true
      }
    })

    if (hasMissingDefaultUser) {
      saveRegisteredUsers(usersWithDefaults)
    }

    return usersWithDefaults
  } catch {
    saveRegisteredUsers(defaultRegisteredUsers)
    return defaultRegisteredUsers
  }
}

function saveRegisteredUsers(users: RegisteredUser[]) {
  localStorage.setItem(registeredUsersStorageKey, JSON.stringify(users))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() =>
    readRegisteredUsers(),
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      user,
      login: (email, password) => {
        const normalizedEmail = normalizeEmail(email)
        const registeredUser = registeredUsers.find(
          (item) => normalizeEmail(item.email) === normalizedEmail,
        )

        if (!registeredUser || registeredUser.password !== password) {
          return false
        }

        const nextUser: AuthUser = {
          email: registeredUser.email,
          role: registeredUser.role,
        }

        localStorage.setItem(authStorageKey, JSON.stringify(nextUser))
        setUser(nextUser)
        return true
      },
      register: (email, password) => {
        const normalizedEmail = normalizeEmail(email)
        const users = readRegisteredUsers()
        const existingIndex = users.findIndex((item) => normalizeEmail(item.email) === normalizedEmail)
        const registeredUser: RegisteredUser = {
          email: email.trim(),
          password,
          role: getUserRole(email),
        }

        if (existingIndex >= 0) {
          users[existingIndex] = registeredUser
        } else {
          users.push(registeredUser)
        }

        saveRegisteredUsers(users)
        setRegisteredUsers(users)
      },
      changePassword: (currentPassword, nextPassword) => {
        if (!user) {
          return false
        }

        const users = readRegisteredUsers()
        const userIndex = users.findIndex(
          (item) => normalizeEmail(item.email) === normalizeEmail(user.email),
        )

        if (userIndex < 0 || users[userIndex].password !== currentPassword) {
          return false
        }

        users[userIndex] = {
          ...users[userIndex],
          password: nextPassword,
        }

        saveRegisteredUsers(users)
        setRegisteredUsers(users)
        return true
      },
      logout: () => {
        localStorage.removeItem(authStorageKey)
        setUser(null)
      },
    }),
    [registeredUsers, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
