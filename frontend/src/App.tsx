import { useEffect, useMemo, useState } from 'react'
import { SiteFooter } from './components/layout/SiteFooter'
import { SiteHeader } from './components/layout/SiteHeader'
import { AuthProvider } from './context/AuthContext'
import {
  adminRouteKeys,
  authRouteKeys,
  privateRouteKeys,
  routeTitles,
} from './data/routes'

import { useHashRoute } from './hooks/useHashRoute'

import { privateRoutes } from './routes/privateRoutes'
import { publicRoutes } from './routes/publicRoutes'
import { PrivateRoute, PublicRoute } from './routes/routeGuards'

function App() {
  const { currentRoute, navigate } = useHashRoute()

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    document.title = routeTitles[currentRoute]
  }, [currentRoute])

  const activeRoute = useMemo(() => {
    return [...publicRoutes, ...privateRoutes].find(
      (route) => route.key === currentRoute
    )
  }, [currentRoute])

  const isAuthPage = authRouteKeys.includes(currentRoute)
  const isPrivatePage = privateRouteKeys.includes(currentRoute)
  const isAdminPage = adminRouteKeys.includes(currentRoute)

  const routeElement =
    activeRoute?.element(navigate) ??
    publicRoutes.find((route) => route.key === 'notFound')?.element(navigate)

  return (
    <AuthProvider>
      <div
        className={`app-shell ${
          isAuthPage ? 'auth-mode' : ''
        } ${isPrivatePage ? 'admin-mode' : ''}`}
      >
        {!isAuthPage && !isPrivatePage && (
          <SiteHeader
            currentRoute={currentRoute}
            isMenuOpen={isMenuOpen}
            navigate={navigate}
            onCloseMenu={() => setIsMenuOpen(false)}
            onToggleMenu={() => setIsMenuOpen((value) => !value)}
          />
        )}

        {isPrivatePage ? (
          <PrivateRoute navigate={navigate} requireAdmin={isAdminPage}>
            {routeElement}
          </PrivateRoute>
        ) : (
          <PublicRoute>{routeElement}</PublicRoute>
        )}

        {!isAuthPage && !isPrivatePage && (
          <SiteFooter navigate={navigate} />
        )}
      </div>
    </AuthProvider>
  )
}

export default App