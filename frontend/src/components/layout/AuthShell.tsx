import type { ReactNode } from 'react'
import { images } from '../../data/images'
import { routePaths } from '../../data/routes'
import { Icon } from '../icons/Icon'

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <main className="auth-page" style={{ backgroundImage: `url(${images.lobby})` }}>
      <a className="brand auth-brand" href={`#/${routePaths.home}`}>
        <span className="brand-mark">VIP</span>
        <span>VIP Booking</span>
      </a>
      <section className="auth-card">
        <span className="auth-icon">
          <Icon name="lock" />
        </span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </section>
    </main>
  )
}
