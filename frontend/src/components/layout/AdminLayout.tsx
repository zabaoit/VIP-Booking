import type { ReactNode } from 'react'
import { adminNavItems } from '../../data/navigation'
import { routePaths, routeTitles } from '../../data/routes'
import type { RouteKey } from '../../types'
import { Icon } from '../icons/Icon'

export function AdminLayout({
  currentRoute,
  children,
}: {
  currentRoute: RouteKey
  children: ReactNode
}) {
  return (
    <main className="admin-layout">
      <aside className="admin-sidebar">
        <a className="brand" href={`#/${routePaths.home}`}>
          <span className="brand-mark">VIP</span>
          <span>VIP Booking</span>
        </a>
        <nav aria-label="Admin navigation">
          {adminNavItems.map((item) => (
            <a
              className={currentRoute === item.route ? 'active' : ''}
              href={`#/${routePaths[item.route]}`}
              key={item.route}
            >
              <Icon name={item.icon} />
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
      <section className="admin-content">
        <div className="admin-topbar">
          <div>
            <p className="eyebrow">Control center</p>
            <h1>{routeTitles[currentRoute].replace(' - VIP Booking', '')}</h1>
          </div>
          <div className="admin-search">
            <Icon name="search" />
            <input placeholder="Search bookings, rooms, guests..." />
          </div>
        </div>
        {children}
      </section>
    </main>
  )
}
