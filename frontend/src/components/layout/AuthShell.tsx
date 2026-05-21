import type { ReactNode } from 'react'
import { images } from '../../data/images'
import type { IconName } from '../../types'
import { getRouteHref } from '../../utils/router'
import { Icon } from '../icons/Icon'

export function AuthShell({
  title,
  subtitle,
  iconName = 'lock',
  maxWidthClass = 'w-full max-w-[420px]',
  children,
}: {
  title: string
  subtitle: string
  iconName?: IconName
  maxWidthClass?: string
  children: ReactNode
}) {
  return (
    <main className="auth-page" style={{ backgroundImage: `url(${images.lobby})` }}>
      <a className="brand auth-brand" href={getRouteHref('home')}>
        <span className="brand-mark">VIP</span>
        <span>VIP Booking</span>
      </a>
      <section className={`auth-card ${maxWidthClass}`}>
        <span className="auth-icon">
          <Icon name={iconName} />
        </span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </section>
    </main>
  )
}
