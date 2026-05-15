import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'

type RouteKey =
  | 'home'
  | 'rooms'
  | 'roomDetail'
  | 'booking'
  | 'confirm'
  | 'payment'
  | 'success'
  | 'failed'
  | 'contact'
  | 'about'
  | 'login'
  | 'register'
  | 'forgot'
  | 'reset'
  | 'otp'
  | 'admin'
  | 'adminRooms'
  | 'adminServices'
  | 'notFound'

type IconName =
  | 'award'
  | 'bed'
  | 'calendar'
  | 'card'
  | 'check'
  | 'chevron'
  | 'close'
  | 'dashboard'
  | 'edit'
  | 'filter'
  | 'home'
  | 'lock'
  | 'mail'
  | 'mapPin'
  | 'menu'
  | 'phone'
  | 'plus'
  | 'search'
  | 'service'
  | 'shield'
  | 'spark'
  | 'star'
  | 'trash'
  | 'user'
  | 'users'
  | 'wifi'

type Room = {
  id: string
  name: string
  category: string
  location: string
  price: number
  rating: number
  reviews: number
  size: string
  guests: string
  bed: string
  image: string
  gallery: string[]
  description: string
  amenities: string[]
  highlights: string[]
  availability: number[]
}

type Service = {
  name: string
  icon: IconName
  price: string
  note: string
  status: 'Active' | 'Paused'
}

type Navigate = (route: RouteKey) => void

const routePaths: Record<RouteKey, string> = {
  home: 'home',
  rooms: 'rooms',
  roomDetail: 'rooms/ocean-view-grand-suite',
  booking: 'booking-information',
  confirm: 'confirm-booking',
  payment: 'secure-payment',
  success: 'payment-success',
  failed: 'payment-failed',
  contact: 'contact',
  about: 'about',
  login: 'login',
  register: 'register',
  forgot: 'forgot-password',
  reset: 'reset-password',
  otp: 'otp',
  admin: 'admin',
  adminRooms: 'admin/room-types',
  adminServices: 'admin/services',
  notFound: '404',
}

const routeByPath = Object.entries(routePaths).reduce<Record<string, RouteKey>>(
  (acc, [key, value]) => {
    acc[value] = key as RouteKey
    return acc
  },
  {},
)

const routeTitles: Record<RouteKey, string> = {
  home: 'Home Page - VIP Booking',
  rooms: 'Room Listing - VIP Booking',
  roomDetail: 'Room Detail - VIP Booking',
  booking: 'Booking Information - VIP Booking',
  confirm: 'Confirm Your Booking - VIP Booking',
  payment: 'Secure Payment - VIP Booking',
  success: 'Payment Success - VIP Booking',
  failed: 'Payment Failed - VIP Booking',
  contact: 'Contact - VIP Booking',
  about: 'About - VIP Booking',
  login: 'Login - VIP Booking',
  register: 'Register - VIP Booking',
  forgot: 'Forgot Password - VIP Booking',
  reset: 'Reset Password - VIP Booking',
  otp: 'OTP - VIP Booking',
  admin: 'Admin Dashboard - VIP Booking',
  adminRooms: 'Room Types Management - VIP Booking',
  adminServices: 'Service Management - VIP Booking',
  notFound: '404 - VIP Booking',
}

const images = {
  hero: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1800&q=85',
  lobby:
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85',
  exterior:
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1600&q=85',
  suite:
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1400&q=85',
  ocean:
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=85',
  penthouse:
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=85',
  spa: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
  dining:
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=85',
  pool: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85',
  meeting:
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=85',
  portraitOne:
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
  portraitTwo:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
  portraitThree:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
}

const rooms: Room[] = [
  {
    id: 'ocean-view-grand-suite',
    name: 'Ocean View Grand Suite',
    category: 'Signature Suite',
    location: 'North Tower, Level 18',
    price: 450,
    rating: 4.9,
    reviews: 218,
    size: '72 m2',
    guests: '2 adults',
    bed: 'King bed',
    image: images.suite,
    gallery: [images.suite, images.ocean, images.dining],
    description:
      'A calm private suite facing the water, built for long stays, executive travel, and celebration weekends with personal arrival service.',
    amenities: [
      'Ocean-facing balcony',
      'Private lounge access',
      'Smart climate control',
      'Premium minibar',
      'Marble bathroom',
      'Late checkout',
    ],
    highlights: ['Free cancellation', 'Breakfast included', 'Airport priority'],
    availability: [4, 5, 10, 11, 12, 18, 19, 23, 24],
  },
  {
    id: 'executive-sky-room',
    name: 'Executive Sky Room',
    category: 'Business Class',
    location: 'West Wing, Level 12',
    price: 320,
    rating: 4.8,
    reviews: 164,
    size: '48 m2',
    guests: '2 guests',
    bed: 'Queen bed',
    image: images.ocean,
    gallery: [images.ocean, images.meeting, images.spa],
    description:
      'A polished room for business travel with fast check-in, ergonomic workspace, skyline views, and quiet evening service.',
    amenities: [
      'Executive desk',
      'Soundproof windows',
      'High speed Wi-Fi',
      'Coffee bar',
      'Pressing service',
      'Meeting lounge',
    ],
    highlights: ['Express check-in', 'Workspace ready', 'Flexible hold'],
    availability: [2, 3, 8, 9, 15, 16, 21, 22, 28],
  },
  {
    id: 'garden-residence',
    name: 'Garden Residence',
    category: 'Family Residence',
    location: 'Garden Court, Level 3',
    price: 560,
    rating: 4.95,
    reviews: 132,
    size: '94 m2',
    guests: '4 guests',
    bed: 'Two bedrooms',
    image: images.penthouse,
    gallery: [images.penthouse, images.pool, images.lobby],
    description:
      'A generous residence with a separate living room, garden terrace, and curated family amenities for slower luxury stays.',
    amenities: [
      'Private terrace',
      'Two bathrooms',
      'Kitchenette',
      'Kids amenity set',
      'Laundry pickup',
      'Evening turndown',
    ],
    highlights: ['Family ready', 'Daily breakfast', 'Private terrace'],
    availability: [1, 6, 7, 13, 14, 20, 25, 26, 27],
  },
]

const services: Service[] = [
  {
    name: 'Breakfast Signature',
    icon: 'spark',
    price: '$35',
    note: 'Chef selection, tea service, and fresh juice',
    status: 'Active',
  },
  {
    name: 'Private Chauffeur',
    icon: 'shield',
    price: '$80',
    note: 'Airport arrival or city transfer',
    status: 'Active',
  },
  {
    name: 'Wellness Ritual',
    icon: 'award',
    price: '$120',
    note: 'Spa treatment with private suite setup',
    status: 'Active',
  },
  {
    name: 'Late Checkout',
    icon: 'calendar',
    price: '$45',
    note: 'Extend room access until 4:00 PM',
    status: 'Paused',
  },
]

const navItems: Array<{ label: string; route: RouteKey }> = [
  { label: 'Home', route: 'home' },
  { label: 'Rooms', route: 'rooms' },
  { label: 'Contact', route: 'contact' },
  { label: 'About', route: 'about' },
]

const adminNavItems: Array<{ label: string; route: RouteKey; icon: IconName }> = [
  { label: 'Overview', route: 'admin', icon: 'dashboard' },
  { label: 'Room Types', route: 'adminRooms', icon: 'bed' },
  { label: 'Services', route: 'adminServices', icon: 'service' },
]

function readRoute(): RouteKey {
  const rawHash = window.location.hash.replace(/^#\/?/, '').replace(/\/$/, '')
  const path = rawHash || 'home'
  return routeByPath[path] ?? 'notFound'
}

function setHashRoute(route: RouteKey) {
  const nextHash = `#/${routePaths[route]}`
  if (window.location.hash === nextHash) {
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    return
  }
  window.location.hash = `/${routePaths[route]}`
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function handleRouteSubmit(event: FormEvent<HTMLFormElement>, route: RouteKey, navigate: Navigate) {
  event.preventDefault()
  navigate(route)
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (name) {
    case 'award':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="5" />
          <path d="m8.5 12.5-1 7 4.5-2.5 4.5 2.5-1-7" />
        </svg>
      )
    case 'bed':
      return (
        <svg {...common}>
          <path d="M3 11V5" />
          <path d="M21 18v-6a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v6" />
          <path d="M3 18h18" />
          <path d="M6 11h15" />
        </svg>
      )
    case 'calendar':
      return (
        <svg {...common}>
          <path d="M7 3v3" />
          <path d="M17 3v3" />
          <rect x="4" y="5" width="16" height="16" rx="2" />
          <path d="M4 10h16" />
        </svg>
      )
    case 'card':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 10h18" />
          <path d="M7 15h3" />
        </svg>
      )
    case 'check':
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      )
    case 'chevron':
      return (
        <svg {...common}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      )
    case 'close':
      return (
        <svg {...common}>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      )
    case 'dashboard':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="8" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="15" width="7" height="6" rx="1.5" />
        </svg>
      )
    case 'edit':
      return (
        <svg {...common}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      )
    case 'filter':
      return (
        <svg {...common}>
          <path d="M4 5h16" />
          <path d="M7 12h10" />
          <path d="M10 19h4" />
        </svg>
      )
    case 'home':
      return (
        <svg {...common}>
          <path d="m4 11 8-7 8 7" />
          <path d="M6 10v10h12V10" />
          <path d="M10 20v-6h4v6" />
        </svg>
      )
    case 'lock':
      return (
        <svg {...common}>
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      )
    case 'mail':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      )
    case 'mapPin':
      return (
        <svg {...common}>
          <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      )
    case 'menu':
      return (
        <svg {...common}>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      )
    case 'phone':
      return (
        <svg {...common}>
          <path d="M22 16.8v2.5a2 2 0 0 1-2.2 2 19 19 0 0 1-8.3-3A18.6 18.6 0 0 1 3.7 6.5 2 2 0 0 1 5.6 4h2.5a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2L9.3 11.7a15 15 0 0 0 3 3l1.1-1.1a2 2 0 0 1 2-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
        </svg>
      )
    case 'plus':
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      )
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      )
    case 'service':
      return (
        <svg {...common}>
          <path d="M4 18h16" />
          <path d="M6 18a6 6 0 0 1 12 0" />
          <path d="M12 4v3" />
          <path d="M8 6l1.5 2" />
          <path d="M16 6l-1.5 2" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6Z" />
          <path d="m9 12 2 2 4-5" />
        </svg>
      )
    case 'spark':
      return (
        <svg {...common}>
          <path d="M12 2 14 9l7 3-7 3-2 7-2-7-7-3 7-3Z" />
        </svg>
      )
    case 'star':
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="m12 2.8 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.4l6.2-.9Z" />
        </svg>
      )
    case 'trash':
      return (
        <svg {...common}>
          <path d="M4 7h16" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M6 7l1 14h10l1-14" />
          <path d="M9 7V4h6v3" />
        </svg>
      )
    case 'user':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M5 21a7 7 0 0 1 14 0" />
        </svg>
      )
    case 'users':
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M3 21a6 6 0 0 1 12 0" />
          <path d="M15 17a5 5 0 0 1 6 4" />
        </svg>
      )
    case 'wifi':
      return (
        <svg {...common}>
          <path d="M5 10a11 11 0 0 1 14 0" />
          <path d="M8 14a6 6 0 0 1 8 0" />
          <path d="M12 18h.01" />
        </svg>
      )
    default:
      return null
  }
}

function App() {
  const [currentRoute, setCurrentRoute] = useState<RouteKey>(() => readRoute())
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(readRoute())
      setIsMenuOpen(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    document.title = routeTitles[currentRoute]
  }, [currentRoute])

  const navigate = (route: RouteKey) => setHashRoute(route)
  const isAuth = ['login', 'register', 'forgot', 'reset', 'otp'].includes(currentRoute)
  const isAdmin = ['admin', 'adminRooms', 'adminServices'].includes(currentRoute)

  const page = useMemo(() => {
    switch (currentRoute) {
      case 'home':
        return <HomePage navigate={navigate} />
      case 'rooms':
        return <RoomListingPage navigate={navigate} />
      case 'roomDetail':
        return <RoomDetailPage room={rooms[0]} navigate={navigate} />
      case 'booking':
        return <BookingInformationPage room={rooms[0]} navigate={navigate} />
      case 'confirm':
        return <ConfirmBookingPage room={rooms[0]} navigate={navigate} />
      case 'payment':
        return <SecurePaymentPage room={rooms[0]} navigate={navigate} />
      case 'success':
        return <PaymentStatusPage variant="success" navigate={navigate} />
      case 'failed':
        return <PaymentStatusPage variant="failed" navigate={navigate} />
      case 'contact':
        return <ContactPage />
      case 'about':
        return <AboutPage />
      case 'login':
        return <LoginPage navigate={navigate} />
      case 'register':
        return <RegisterPage navigate={navigate} />
      case 'forgot':
        return <ForgotPasswordPage navigate={navigate} />
      case 'reset':
        return <ResetPasswordPage navigate={navigate} />
      case 'otp':
        return <OtpPage navigate={navigate} />
      case 'admin':
        return (
          <AdminLayout currentRoute={currentRoute}>
            <AdminDashboard />
          </AdminLayout>
        )
      case 'adminRooms':
        return (
          <AdminLayout currentRoute={currentRoute}>
            <AdminRoomTypes />
          </AdminLayout>
        )
      case 'adminServices':
        return (
          <AdminLayout currentRoute={currentRoute}>
            <AdminServices />
          </AdminLayout>
        )
      default:
        return <NotFoundPage navigate={navigate} />
    }
  }, [currentRoute])

  return (
    <div className={`app-shell ${isAuth ? 'auth-mode' : ''} ${isAdmin ? 'admin-mode' : ''}`}>
      {!isAuth && !isAdmin && (
        <SiteHeader
          currentRoute={currentRoute}
          isMenuOpen={isMenuOpen}
          navigate={navigate}
          onToggleMenu={() => setIsMenuOpen((value) => !value)}
        />
      )}
      {page}
      {!isAuth && !isAdmin && <SiteFooter />}
    </div>
  )
}

function SiteHeader({
  currentRoute,
  isMenuOpen,
  navigate,
  onToggleMenu,
}: {
  currentRoute: RouteKey
  isMenuOpen: boolean
  navigate: Navigate
  onToggleMenu: () => void
}) {
  return (
    <header className="site-header">
      <a className="brand" href={`#/${routePaths.home}`} aria-label="VIP Booking home">
        <span className="brand-mark">VIP</span>
        <span>VIP Booking</span>
      </a>

      <button className="icon-button mobile-menu-button" type="button" onClick={onToggleMenu}>
        <Icon name={isMenuOpen ? 'close' : 'menu'} />
      </button>

      <nav className={`main-nav ${isMenuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
        {navItems.map((item) => (
          <a
            className={currentRoute === item.route ? 'active' : ''}
            href={`#/${routePaths[item.route]}`}
            key={item.route}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <button className="ghost-button" type="button" onClick={() => navigate('login')}>
          Login
        </button>
        <button className="primary-button compact" type="button" onClick={() => navigate('rooms')}>
          Book Now
        </button>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <a className="brand" href={`#/${routePaths.home}`}>
          <span className="brand-mark">VIP</span>
          <span>VIP Booking</span>
        </a>
        <p>Private hospitality booking for premium rooms, curated services, and fast payment.</p>
      </div>
      <div className="footer-links">
        <a href={`#/${routePaths.rooms}`}>Rooms</a>
        <a href={`#/${routePaths.contact}`}>Contact</a>
        <a href={`#/${routePaths.about}`}>About</a>
        <a href={`#/${routePaths.admin}`}>Admin</a>
      </div>
    </footer>
  )
}

function HomePage({ navigate }: { navigate: Navigate }) {
  return (
    <main>
      <section className="hero-section" style={{ backgroundImage: `url(${images.hero})` }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">VIP hospitality platform</p>
          <h1>Experience Unparalleled Luxury</h1>
          <p>
            Reserve refined rooms, add personal services, and move from search to secure payment
            with the same polished flow shown in the VIP Booking demo.
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => navigate('rooms')}>
              Explore Rooms
            </button>
            <button className="secondary-button" type="button" onClick={() => navigate('contact')}>
              Concierge
            </button>
          </div>
        </div>
        <SearchPanel navigate={navigate} />
      </section>

      <section className="section-shell">
        <SectionHeading
          eyebrow="Featured stays"
          title="Rooms built for premium travel"
          actionLabel="View all"
          onAction={() => navigate('rooms')}
        />
        <div className="room-grid featured-grid">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} navigate={navigate} />
          ))}
        </div>
      </section>

      <section className="section-shell service-band">
        <SectionHeading eyebrow="Services" title="World-class amenities" />
        <div className="service-grid">
          {services.slice(0, 4).map((service) => (
            <article className="service-card" key={service.name}>
              <span className="icon-tile">
                <Icon name={service.icon} />
              </span>
              <h3>{service.name}</h3>
              <p>{service.note}</p>
              <span>{service.price}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell split-story">
        <div>
          <p className="eyebrow">Weekend retreat</p>
          <h2>Private dining, skyline rooms, and arrival support in one flow.</h2>
          <p>
            The interface keeps the guest journey visible: select a room, confirm service add-ons,
            review the invoice, and pay without losing booking context.
          </p>
          <button className="secondary-button" type="button" onClick={() => navigate('booking')}>
            Start Booking
          </button>
        </div>
        <img src={images.dining} alt="Luxury dinner setting" loading="lazy" />
      </section>
    </main>
  )
}

function SearchPanel({ navigate }: { navigate: Navigate }) {
  return (
    <form
      className="search-panel"
      onSubmit={(event) => handleRouteSubmit(event, 'rooms', navigate)}
    >
      <label>
        <span>Destination</span>
        <input defaultValue="Da Nang Oceanfront" />
      </label>
      <label>
        <span>Check in</span>
        <input defaultValue="2026-10-10" type="date" />
      </label>
      <label>
        <span>Check out</span>
        <input defaultValue="2026-10-13" type="date" />
      </label>
      <label>
        <span>Guests</span>
        <select defaultValue="2 adults">
          <option>1 adult</option>
          <option>2 adults</option>
          <option>3 guests</option>
          <option>4 guests</option>
        </select>
      </label>
      <button className="primary-button search-button" type="submit">
        <Icon name="search" />
        Search
      </button>
    </form>
  )
}

function SectionHeading({
  eyebrow,
  title,
  actionLabel,
  onAction,
}: {
  eyebrow: string
  title: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {actionLabel && onAction && (
        <button className="text-button" type="button" onClick={onAction}>
          {actionLabel}
          <Icon name="chevron" size={16} />
        </button>
      )}
    </div>
  )
}

function RoomListingPage({ navigate }: { navigate: Navigate }) {
  return (
    <main className="page-shell">
      <PageIntro
        eyebrow="Room listing"
        title="Available Rooms"
        copy="Filter premium room types by stay style, amenities, price and guest count."
      />

      <div className="listing-layout">
        <aside className="filter-panel" aria-label="Room filters">
          <div className="panel-title">
            <Icon name="filter" />
            <span>Filters</span>
          </div>
          <FilterGroup title="Price range" options={['$250 - $350', '$350 - $500', '$500+']} />
          <FilterGroup title="Room class" options={['Suite', 'Business', 'Family', 'Residence']} />
          <FilterGroup
            title="Amenities"
            options={['Breakfast', 'Balcony', 'Spa access', 'Airport pickup']}
          />
        </aside>

        <section className="listing-results">
          <div className="results-toolbar">
            <p>
              <strong>{rooms.length}</strong> curated rooms found
            </p>
            <select defaultValue="recommended" aria-label="Sort rooms">
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: low to high</option>
              <option value="rating">Highest rating</option>
            </select>
          </div>

          <div className="room-grid">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} navigate={navigate} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

function FilterGroup({ title, options }: { title: string; options: string[] }) {
  return (
    <div className="filter-group">
      <h3>{title}</h3>
      {options.map((option, index) => (
        <label className="check-row" key={option}>
          <input defaultChecked={index === 0} type="checkbox" />
          <span>{option}</span>
        </label>
      ))}
    </div>
  )
}

function RoomCard({ room, navigate }: { room: Room; navigate: Navigate }) {
  return (
    <article className="room-card">
      <div className="room-image">
        <img src={room.image} alt={room.name} loading="lazy" />
        <span>{room.category}</span>
      </div>
      <div className="room-card-body">
        <div className="room-card-title">
          <div>
            <h3>{room.name}</h3>
            <p>
              <Icon name="mapPin" size={14} />
              {room.location}
            </p>
          </div>
          <div className="rating-pill">
            <Icon name="star" size={14} />
            {room.rating}
          </div>
        </div>
        <div className="room-meta">
          <span>
            <Icon name="users" size={15} />
            {room.guests}
          </span>
          <span>
            <Icon name="bed" size={15} />
            {room.bed}
          </span>
          <span>{room.size}</span>
        </div>
        <p>{room.description}</p>
        <div className="card-footer">
          <strong>
            {formatCurrency(room.price)}
            <small>/night</small>
          </strong>
          <div>
            <button
              className="ghost-button compact"
              type="button"
              onClick={() => navigate('roomDetail')}
            >
              Details
            </button>
            <button
              className="primary-button compact"
              type="button"
              onClick={() => navigate('booking')}
            >
              Book
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function RoomDetailPage({ room, navigate }: { room: Room; navigate: Navigate }) {
  const calendarDays = Array.from({ length: 31 }, (_, index) => index + 1)

  return (
    <main className="page-shell room-detail-page">
      <PageIntro
        eyebrow={room.category}
        title={room.name}
        copy="A detailed room view with gallery, amenities, price summary, and availability picker."
      />

      <section className="detail-grid">
        <div>
          <div className="gallery-layout">
            <img className="gallery-main" src={room.gallery[0]} alt={room.name} />
            <div className="gallery-side">
              {room.gallery.slice(1).map((image) => (
                <img src={image} alt={`${room.name} preview`} key={image} loading="lazy" />
              ))}
            </div>
          </div>

          <div className="detail-panel">
            <div className="rating-line">
              <span>
                <Icon name="star" />
                {room.rating} rating
              </span>
              <span>{room.reviews} verified reviews</span>
              <span>{room.location}</span>
            </div>
            <p>{room.description}</p>
            <div className="amenity-grid">
              {room.amenities.map((amenity) => (
                <span key={amenity}>
                  <Icon name={amenity.includes('Wi') ? 'wifi' : 'check'} size={15} />
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <div className="detail-panel">
            <div className="panel-title">
              <Icon name="calendar" />
              <span>Availability</span>
            </div>
            <div className="calendar-card">
              <div className="calendar-header">
                <button type="button" aria-label="Previous month">
                  <Icon name="chevron" />
                </button>
                <strong>October 2026</strong>
                <button type="button" aria-label="Next month">
                  <Icon name="chevron" />
                </button>
              </div>
              <div className="calendar-weekdays">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <span key={`${day}-${index}`}>{day}</span>
                ))}
              </div>
              <div className="calendar-grid">
                {calendarDays.map((day) => {
                  const available = room.availability.includes(day)
                  const selected = [10, 11, 12].includes(day)
                  return (
                    <button
                      className={`${available ? 'available' : ''} ${selected ? 'selected' : ''}`}
                      disabled={!available}
                      key={day}
                      type="button"
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <aside className="booking-panel">
          <div className="price-block">
            <span>Starting from</span>
            <strong>{formatCurrency(room.price)}</strong>
            <small>per night</small>
          </div>
          <div className="booking-fields">
            <label>
              Check in
              <input defaultValue="2026-10-10" type="date" />
            </label>
            <label>
              Check out
              <input defaultValue="2026-10-13" type="date" />
            </label>
            <label>
              Guests
              <select defaultValue="2 adults">
                <option>2 adults</option>
                <option>3 guests</option>
                <option>4 guests</option>
              </select>
            </label>
          </div>
          <ul className="highlight-list">
            {room.highlights.map((item) => (
              <li key={item}>
                <Icon name="check" />
                {item}
              </li>
            ))}
          </ul>
          <button
            className="primary-button full-width"
            type="button"
            onClick={() => navigate('booking')}
          >
            Reserve Room
          </button>
        </aside>
      </section>
    </main>
  )
}

function BookingInformationPage({ room, navigate }: { room: Room; navigate: Navigate }) {
  return (
    <main className="page-shell">
      <PageIntro
        eyebrow="Complete your booking"
        title="Booking Information"
        copy="Guest details, stay preferences, and booking summary are shown together for review."
      />

      <form
        className="checkout-layout"
        onSubmit={(event) => handleRouteSubmit(event, 'confirm', navigate)}
      >
        <section className="form-panel">
          <h2>Guest Information</h2>
          <div className="form-grid">
            <label>
              First name
              <input defaultValue="Anh" />
            </label>
            <label>
              Last name
              <input defaultValue="Nguyen" />
            </label>
            <label>
              Email
              <input defaultValue="anh.nguyen@example.com" type="email" />
            </label>
            <label>
              Phone
              <input defaultValue="+84 901 123 456" />
            </label>
          </div>
          <h2>Special Requests</h2>
          <textarea defaultValue="High floor, quiet room, and champagne on arrival." rows={5} />
          <label className="check-row consent-row">
            <input type="checkbox" />
            <span>I require accessible room assistance.</span>
          </label>
        </section>

        <BookingSummary room={room} buttonLabel="Continue to Review" />
      </form>
    </main>
  )
}

function ConfirmBookingPage({ room, navigate }: { room: Room; navigate: Navigate }) {
  return (
    <main className="page-shell">
      <PageIntro
        eyebrow="Review booking"
        title="Confirm Your Booking"
        copy="Confirm the room, included services, add-ons, and final payment amount."
      />

      <div className="checkout-layout">
        <section className="form-panel">
          <h2>Room Summary</h2>
          <div className="summary-row strong">
            <span>{room.name}</span>
            <strong>{formatCurrency(room.price * 3)}</strong>
          </div>
          <div className="mini-room">
            <img src={room.image} alt={room.name} />
            <div>
              <p>{room.location}</p>
              <span>Oct 10 - Oct 13, 2026</span>
              <span>2 adults, 3 nights</span>
            </div>
          </div>

          <h2>Included Services</h2>
          <div className="add-on-grid">
            {services.slice(0, 3).map((service) => (
              <label className="add-on-card" key={service.name}>
                <input defaultChecked type="checkbox" />
                <span className="icon-tile">
                  <Icon name={service.icon} />
                </span>
                <strong>{service.name}</strong>
                <small>{service.price}</small>
              </label>
            ))}
          </div>

          <h2>Price Details</h2>
          <PriceDetails room={room} />
          <button
            className="primary-button full-width"
            type="button"
            onClick={() => navigate('payment')}
          >
            Proceed to Payment
          </button>
        </section>
        <BookingSummary
          room={room}
          buttonLabel="Proceed to Payment"
          onButtonClick={() => navigate('payment')}
        />
      </div>
    </main>
  )
}

function SecurePaymentPage({ room, navigate }: { room: Room; navigate: Navigate }) {
  return (
    <main className="page-shell">
      <PageIntro
        eyebrow="Checkout"
        title="Secure Payment"
        copy="A payment form with booking context and invoice summary, ready for backend payment APIs."
      />

      <form
        className="checkout-layout"
        onSubmit={(event) => handleRouteSubmit(event, 'success', navigate)}
      >
        <section className="form-panel">
          <h2>Payment Method</h2>
          <div className="payment-tabs">
            <button className="active" type="button">
              <Icon name="card" />
              Credit Card
            </button>
            <button type="button">
              <Icon name="shield" />
              Bank Transfer
            </button>
            <button type="button">
              <Icon name="lock" />
              Wallet
            </button>
          </div>
          <div className="form-grid">
            <label className="span-2">
              Card number
              <input defaultValue="4242 4242 4242 4242" inputMode="numeric" />
            </label>
            <label>
              Expiry date
              <input defaultValue="10/28" />
            </label>
            <label>
              CVC
              <input defaultValue="123" inputMode="numeric" />
            </label>
            <label className="span-2">
              Cardholder name
              <input defaultValue="ANH NGUYEN" />
            </label>
          </div>
          <label className="check-row consent-row">
            <input defaultChecked type="checkbox" />
            <span>Save payment method for future VIP bookings.</span>
          </label>
          <button className="primary-button full-width" type="submit">
            <Icon name="lock" />
            Pay Securely
          </button>
          <button
            className="ghost-button full-width"
            type="button"
            onClick={() => navigate('failed')}
          >
            Simulate Failed Payment
          </button>
        </section>
        <BookingSummary room={room} buttonLabel="Pay Securely" />
      </form>
    </main>
  )
}

function BookingSummary({
  room,
  buttonLabel,
  onButtonClick,
}: {
  room: Room
  buttonLabel: string
  onButtonClick?: () => void
}) {
  return (
    <aside className="summary-panel">
      <img src={room.image} alt={room.name} />
      <div className="summary-content">
        <h3>{room.name}</h3>
        <p>{room.location}</p>
        <div className="summary-badges">
          <span>3 nights</span>
          <span>2 guests</span>
          <span>Oct 2026</span>
        </div>
        <PriceDetails room={room} />
        <button className="primary-button full-width" type="submit" onClick={onButtonClick}>
          {buttonLabel}
        </button>
      </div>
    </aside>
  )
}

function PriceDetails({ room }: { room: Room }) {
  const subtotal = room.price * 3
  const serviceFee = 145
  const tax = 88
  const total = subtotal + serviceFee + tax

  return (
    <div className="price-details">
      <div>
        <span>Room subtotal</span>
        <strong>{formatCurrency(subtotal)}</strong>
      </div>
      <div>
        <span>Service package</span>
        <strong>{formatCurrency(serviceFee)}</strong>
      </div>
      <div>
        <span>Tax and fees</span>
        <strong>{formatCurrency(tax)}</strong>
      </div>
      <div className="total">
        <span>Total</span>
        <strong>{formatCurrency(total)}</strong>
      </div>
    </div>
  )
}

function PaymentStatusPage({
  variant,
  navigate,
}: {
  variant: 'success' | 'failed'
  navigate: Navigate
}) {
  const isSuccess = variant === 'success'

  return (
    <main className="status-page">
      <section className="status-panel">
        <span className={`status-icon ${isSuccess ? 'success' : 'failed'}`}>
          <Icon name={isSuccess ? 'check' : 'close'} size={28} />
        </span>
        <h1>{isSuccess ? 'Payment Successful' : 'Payment Failed'}</h1>
        <p>
          {isSuccess
            ? 'Your VIP Booking reservation is confirmed. A receipt has been prepared for the guest profile.'
            : 'The payment could not be authorized. Review the details or try another payment method.'}
        </p>
        <div className="receipt-card">
          <img src={images.exterior} alt="VIP Booking hotel exterior" />
          <PriceDetails room={rooms[0]} />
        </div>
        <div className="status-actions">
          <button
            className="primary-button"
            type="button"
            onClick={() => navigate(isSuccess ? 'home' : 'payment')}
          >
            {isSuccess ? 'Back to Home' : 'Try Again'}
          </button>
          <button className="ghost-button" type="button" onClick={() => navigate('rooms')}>
            View Rooms
          </button>
        </div>
      </section>
    </main>
  )
}

function ContactPage() {
  return (
    <main className="page-shell">
      <PageIntro
        eyebrow="Get in touch"
        title="Concierge Support"
        copy="Contact channels, quick help cards, message form, and common guest questions."
      />

      <section className="contact-grid">
        <aside className="contact-cards">
          <ContactCard icon="phone" title="Call Concierge" copy="+84 901 123 456" />
          <ContactCard icon="mail" title="Email Reservations" copy="reservations@vipbooking.vn" />
          <ContactCard icon="mapPin" title="Visit Us" copy="Son Tra Coast, Da Nang, Viet Nam" />
        </aside>

        <form className="form-panel contact-form">
          <h2>Send a Message</h2>
          <div className="form-grid">
            <label>
              Full name
              <input defaultValue="Anh Nguyen" />
            </label>
            <label>
              Email
              <input defaultValue="anh.nguyen@example.com" type="email" />
            </label>
            <label className="span-2">
              Subject
              <select defaultValue="Booking Consultation">
                <option>Booking Consultation</option>
                <option>Private Event</option>
                <option>Corporate Travel</option>
              </select>
            </label>
            <label className="span-2">
              Message
              <textarea
                defaultValue="I would like to arrange a suite with airport pickup."
                rows={6}
              />
            </label>
          </div>
          <button className="primary-button" type="button">
            Send Message
          </button>
        </form>
      </section>

      <section className="section-shell faq-section">
        <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />
        {[
          'What is the VIP flexible cancellation policy?',
          'Can concierge arrange airport pickup?',
          'Are corporate invoices available?',
          'Can I change my booking after payment?',
        ].map((question, index) => (
          <details className="faq-item" key={question} open={index === 2}>
            <summary>{question}</summary>
            <p>
              Yes. The booking team can update service requests, room preferences, and invoices
              according to the selected rate conditions.
            </p>
          </details>
        ))}
      </section>
    </main>
  )
}

function ContactCard({ icon, title, copy }: { icon: IconName; title: string; copy: string }) {
  return (
    <article className="contact-card">
      <span className="icon-tile">
        <Icon name={icon} />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{copy}</p>
      </div>
    </article>
  )
}

function AboutPage() {
  return (
    <main className="page-shell about-page">
      <PageIntro
        eyebrow="About us"
        title="A hospitality brand for precise luxury"
        copy="Story, imagery, leadership, and awards laid out with the same dark premium language as the demo."
      />

      <section className="about-hero">
        <img src={images.exterior} alt="VIP Booking hotel exterior" />
        <div>
          <p className="eyebrow">Our story</p>
          <h2>Built around calm arrivals and exacting guest care.</h2>
          <p>
            VIP Booking combines room inventory, concierge services, booking review, payment, and
            admin operations into a single front-end experience for premium hotel teams.
          </p>
        </div>
      </section>

      <section className="image-strip">
        <img src={images.lobby} alt="Hotel lobby" loading="lazy" />
        <img src={images.pool} alt="Pool view" loading="lazy" />
        <img src={images.dining} alt="Restaurant table" loading="lazy" />
      </section>

      <section className="section-shell leadership-section">
        <SectionHeading eyebrow="Leadership" title="Executive leadership" />
        <div className="leader-grid">
          {[
            ['Jonathan Sterling', 'Chief Executive Officer', images.portraitOne],
            ['Elena Moore', 'Head of Guest Experience', images.portraitTwo],
            ['Marcus Tran', 'Director of Operations', images.portraitThree],
          ].map(([name, role, image]) => (
            <article className="leader-card" key={name}>
              <img src={image} alt={name} loading="lazy" />
              <h3>{name}</h3>
              <p>{role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="award-grid">
        {[
          'Luxury Travel Award',
          'Five Star Guest Care',
          'Design Excellence',
          'Green Hotel Leader',
        ].map((award) => (
          <article className="award-card" key={award}>
            <Icon name="award" />
            <span>{award}</span>
          </article>
        ))}
      </section>
    </main>
  )
}

function LoginPage({ navigate }: { navigate: Navigate }) {
  return (
    <AuthShell title="Welcome Back" subtitle="Sign in to continue your VIP booking experience.">
      <form onSubmit={(event) => handleRouteSubmit(event, 'home', navigate)}>
        <label>
          Email address
          <input defaultValue="guest@vipbooking.vn" type="email" />
        </label>
        <label>
          Password
          <input defaultValue="vipbooking" type="password" />
        </label>
        <div className="auth-row">
          <label className="check-row">
            <input defaultChecked type="checkbox" />
            <span>Remember me</span>
          </label>
          <button className="link-button" type="button" onClick={() => navigate('forgot')}>
            Forgot password?
          </button>
        </div>
        <button className="primary-button full-width" type="submit">
          Sign In
        </button>
      </form>
      <p className="auth-switch">
        No account yet? <button onClick={() => navigate('register')}>Register</button>
      </p>
    </AuthShell>
  )
}

function RegisterPage({ navigate }: { navigate: Navigate }) {
  return (
    <AuthShell
      title="Create Account"
      subtitle="Join VIP Booking to reserve rooms and services faster."
    >
      <form onSubmit={(event) => handleRouteSubmit(event, 'otp', navigate)}>
        <label>
          Full name
          <input defaultValue="Anh Nguyen" />
        </label>
        <label>
          Email address
          <input defaultValue="anh.nguyen@example.com" type="email" />
        </label>
        <label>
          Phone number
          <input defaultValue="+84 901 123 456" />
        </label>
        <label>
          Password
          <input defaultValue="vipbooking" type="password" />
        </label>
        <label>
          Confirm password
          <input defaultValue="vipbooking" type="password" />
        </label>
        <button className="primary-button full-width" type="submit">
          Create Account
        </button>
      </form>
      <p className="auth-switch">
        Already have an account? <button onClick={() => navigate('login')}>Sign in</button>
      </p>
    </AuthShell>
  )
}

function ForgotPasswordPage({ navigate }: { navigate: Navigate }) {
  return (
    <AuthShell title="Forgot Password" subtitle="Enter your email to receive a verification code.">
      <form onSubmit={(event) => handleRouteSubmit(event, 'otp', navigate)}>
        <label>
          Email address
          <input defaultValue="guest@vipbooking.vn" type="email" />
        </label>
        <button className="primary-button full-width" type="submit">
          Send Reset Code
        </button>
      </form>
      <p className="auth-switch">
        Remembered it? <button onClick={() => navigate('login')}>Login here</button>
      </p>
    </AuthShell>
  )
}

function ResetPasswordPage({ navigate }: { navigate: Navigate }) {
  return (
    <AuthShell title="Reset Password" subtitle="Create a new secure password for your account.">
      <form onSubmit={(event) => handleRouteSubmit(event, 'login', navigate)}>
        <label>
          New password
          <input defaultValue="newvipbooking" type="password" />
        </label>
        <label>
          Confirm password
          <input defaultValue="newvipbooking" type="password" />
        </label>
        <label className="check-row consent-row">
          <input defaultChecked type="checkbox" />
          <span>Sign out from all other devices.</span>
        </label>
        <button className="primary-button full-width" type="submit">
          Reset Password
        </button>
      </form>
    </AuthShell>
  )
}

function OtpPage({ navigate }: { navigate: Navigate }) {
  return (
    <AuthShell title="Secure Verification" subtitle="Enter the six-digit code sent to your inbox.">
      <form onSubmit={(event) => handleRouteSubmit(event, 'reset', navigate)}>
        <div className="otp-grid">
          {['2', '4', '1', '8', '6', '9'].map((digit, index) => (
            <input
              aria-label={`Verification digit ${index + 1}`}
              defaultValue={digit}
              inputMode="numeric"
              key={`${digit}-${index}`}
              maxLength={1}
            />
          ))}
        </div>
        <button className="primary-button full-width" type="submit">
          Verify Account
        </button>
      </form>
      <p className="auth-switch">
        Did not receive it? <button>Resend code</button>
      </p>
    </AuthShell>
  )
}

function AuthShell({
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

function AdminLayout({ currentRoute, children }: { currentRoute: RouteKey; children: ReactNode }) {
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

function AdminDashboard() {
  return (
    <div className="admin-stack">
      <div className="metric-grid">
        {[
          ['Revenue', '$42.8K', '+18%', 'spark'],
          ['Occupancy', '84%', '+6%', 'bed'],
          ['Pending Requests', '18', '-4%', 'service'],
          ['VIP Guests', '126', '+21%', 'users'],
        ].map(([label, value, delta, icon]) => (
          <article className="metric-card" key={label}>
            <span className="icon-tile">
              <Icon name={icon as IconName} />
            </span>
            <p>{label}</p>
            <strong>{value}</strong>
            <small>{delta} this month</small>
          </article>
        ))}
      </div>

      <div className="admin-grid">
        <section className="admin-panel">
          <div className="panel-title">
            <Icon name="dashboard" />
            <span>Reservation Flow</span>
          </div>
          <svg
            className="chart"
            viewBox="0 0 620 260"
            role="img"
            aria-label="Reservation line chart"
          >
            <path
              d="M30 210 C110 180 160 220 230 160 C300 90 360 130 420 80 C480 38 540 70 590 34"
              fill="none"
              stroke="url(#chartGradient)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="1">
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#e4b96b" />
              </linearGradient>
            </defs>
          </svg>
        </section>

        <section className="admin-panel">
          <div className="panel-title">
            <Icon name="bed" />
            <span>Room Mix</span>
          </div>
          <div className="bar-chart">
            <span style={{ height: '42%' }}>Suite</span>
            <span style={{ height: '70%' }}>Sky</span>
            <span style={{ height: '58%' }}>Garden</span>
            <span style={{ height: '86%' }}>Villa</span>
          </div>
        </section>
      </div>

      <section className="admin-panel">
        <div className="panel-title">
          <Icon name="calendar" />
          <span>Recent Bookings</span>
        </div>
        <DataTable
          headers={['Guest', 'Room', 'Check in', 'Amount', 'Status']}
          rows={[
            ['Anh Nguyen', 'Ocean View Grand Suite', 'Oct 10', '$1,583', 'Confirmed'],
            ['Maya Le', 'Executive Sky Room', 'Oct 12', '$1,105', 'Pending'],
            ['Daniel Park', 'Garden Residence', 'Oct 18', '$1,913', 'Cancelled'],
            ['Linh Tran', 'Ocean View Grand Suite', 'Oct 23', '$1,583', 'Confirmed'],
          ]}
        />
      </section>
    </div>
  )
}

function AdminRoomTypes() {
  return (
    <div className="admin-stack">
      <section className="admin-panel">
        <div className="admin-panel-header">
          <div className="panel-title">
            <Icon name="bed" />
            <span>Room Types Management</span>
          </div>
          <button className="primary-button compact" type="button">
            <Icon name="plus" />
            Add Room Type
          </button>
        </div>
        <div className="room-grid admin-room-grid">
          {rooms.map((room) => (
            <article className="admin-room-card" key={room.id}>
              <img src={room.image} alt={room.name} loading="lazy" />
              <div>
                <span>{room.category}</span>
                <h3>{room.name}</h3>
                <p>
                  {room.size} - {room.guests} - {room.bed}
                </p>
                <strong>{formatCurrency(room.price)}/night</strong>
              </div>
              <div className="row-actions">
                <button className="icon-button" type="button" aria-label={`Edit ${room.name}`}>
                  <Icon name="edit" />
                </button>
                <button
                  className="icon-button danger"
                  type="button"
                  aria-label={`Delete ${room.name}`}
                >
                  <Icon name="trash" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function AdminServices() {
  return (
    <div className="admin-stack">
      <section className="admin-panel">
        <div className="admin-panel-header">
          <div className="panel-title">
            <Icon name="service" />
            <span>Service Management</span>
          </div>
          <button className="primary-button compact" type="button">
            <Icon name="plus" />
            Add Service
          </button>
        </div>
        <DataTable
          headers={['Service', 'Price', 'Description', 'Status', 'Actions']}
          rows={services.map((service) => [
            service.name,
            service.price,
            service.note,
            service.status,
            'Edit',
          ])}
        />
      </section>
    </div>
  )
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join('-')}>
              {row.map((cell, index) => (
                <td key={`${cell}-${index}`}>
                  {['Confirmed', 'Active'].includes(cell) && (
                    <span className="status-chip success">{cell}</span>
                  )}
                  {['Pending', 'Paused'].includes(cell) && (
                    <span className="status-chip pending">{cell}</span>
                  )}
                  {cell === 'Cancelled' && <span className="status-chip failed">{cell}</span>}
                  {!['Confirmed', 'Active', 'Pending', 'Paused', 'Cancelled'].includes(cell) &&
                    cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function NotFoundPage({ navigate }: { navigate: Navigate }) {
  return (
    <main className="not-found" style={{ backgroundImage: `url(${images.lobby})` }}>
      <section>
        <span>404</span>
        <h1>Page not found</h1>
        <p>The page may have moved or the booking link is no longer active.</p>
        <div>
          <button className="primary-button" type="button" onClick={() => navigate('home')}>
            Go Home
          </button>
          <button className="ghost-button" type="button" onClick={() => navigate('contact')}>
            Contact Support
          </button>
        </div>
      </section>
    </main>
  )
}

function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <section className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{copy}</p>
    </section>
  )
}

export default App
