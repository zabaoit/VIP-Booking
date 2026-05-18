import { useEffect, useState } from 'react'
import { readRoute, setHashRoute } from '../utils/router'
import type { Navigate, RouteKey } from '../types'

export function useHashRoute(): { currentRoute: RouteKey; navigate: Navigate } {
  const [currentRoute, setCurrentRoute] = useState<RouteKey>(() => readRoute())

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(readRoute())
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return { currentRoute, navigate: setHashRoute }
}
