import { routeByPath, routePaths } from '../data/routes'
import type { RouteKey } from '../types'

export function readRoute(): RouteKey {
  const rawHash = window.location.hash.replace(/^#\/?/, '').replace(/\/$/, '')
  const path = rawHash || routePaths.home
  return routeByPath[path] ?? 'notFound'
}

export function setHashRoute(route: RouteKey) {
  const nextHash = `#/${routePaths[route]}`

  if (window.location.hash === nextHash) {
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    return
  }

  window.location.hash = `/${routePaths[route]}`
}
