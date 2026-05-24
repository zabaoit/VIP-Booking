import { useMemo, useState, type FormEvent } from 'react'
import { Icon } from '../../components/icons/Icon'
import type { CustomerProfile, CustomerStatus, CustomerTier, RegisteredUser } from '../../types'
import {
  registeredUsersStorageKey,
  readBookings,
  readCustomerProfiles,
  readRegisteredUsers,
  saveCustomerProfiles,
} from '../../utils/appStorage'

const adminCustomersSearchKey = 'vip-booking:admin-customers-search'

function displayNameFromEmail(email: string) {
  return email
    .split('@')[0]
    .split(/[._-]/g)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')
}

function createCustomerId(email: string) {
  let hash = 0
  for (let index = 0; index < email.length; index += 1) {
    hash = (hash * 31 + email.charCodeAt(index)) % 10000
  }
  return `CUS-${String(Math.abs(hash)).padStart(4, '0')}`
}

function parseBookingAmount(amount: string) {
  return Number(amount.replace(/[^0-9.]/g, '')) || 0
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

type CustomerView = CustomerProfile & {
  bookings: number
  totalSpent: number
}

export function AdminCustomersPage() {
  const [search, setSearch] = useState(() => {
    const value = window.sessionStorage.getItem(adminCustomersSearchKey) ?? ''
    window.sessionStorage.removeItem(adminCustomersSearchKey)
    return value
  })
  const [statusFilter, setStatusFilter] = useState<'All Customers' | CustomerStatus>('All Customers')
  const [tierFilter, setTierFilter] = useState(false)
  const [activeCustomer, setActiveCustomer] = useState<CustomerView | null>(null)
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [users, setUsers] = useState<RegisteredUser[]>(() => readRegisteredUsers())
  const [profileData, setProfileData] = useState<CustomerProfile[]>(() => readCustomerProfiles())

  const bookings = readBookings()
  const guestUsers = users.filter((user) => user.role !== 'admin')

  const customers = useMemo<CustomerView[]>(() => {
    const profileByEmail = new Map(profileData.map((profile) => [normalizeEmail(profile.email), profile]))

    return guestUsers.map((user) => {
      const normalizedEmail = normalizeEmail(user.email)
      const profile = profileByEmail.get(normalizedEmail)
      const customerBookings = bookings.filter((booking) => {
        const ownerEmail = normalizeEmail(booking.ownerEmail ?? booking.email)
        return ownerEmail === normalizedEmail
      })
      const totalSpent = customerBookings.reduce(
        (total, booking) => total + parseBookingAmount(booking.amount),
        0,
      )

      return {
        id: profile?.id ?? createCustomerId(user.email),
        email: user.email,
        name: profile?.name || displayNameFromEmail(user.email),
        phone: profile?.phone || '+1 (555) 000-0000',
        address: profile?.address || 'Not set',
        status: profile?.status ?? 'Active',
        tier: profile?.tier ?? 'Standard',
        bookings: customerBookings.length,
        totalSpent,
      }
    })
  }, [bookings, guestUsers, profileData])

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase()
    return customers.filter((customer) => {
      const statusMatch = statusFilter === 'All Customers' || customer.status === statusFilter
      const tierMatch = !tierFilter || customer.tier !== 'Standard'
      const searchMatch =
        !query ||
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.id.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query)
      return statusMatch && tierMatch && searchMatch
    })
  }, [customers, search, statusFilter, tierFilter])

  const totalSpent = customers.reduce((total, customer) => total + customer.totalSpent, 0)
  const activeCount = customers.filter((customer) => customer.status === 'Active').length
  const vipCount = customers.filter((customer) => customer.tier !== 'Standard').length

  const persistUsers = (nextUsers: RegisteredUser[]) => {
    setUsers(nextUsers)
    localStorage.setItem(registeredUsersStorageKey, JSON.stringify(nextUsers))
  }

  const persistProfiles = (nextProfiles: CustomerProfile[]) => {
    setProfileData(nextProfiles)
    saveCustomerProfiles(nextProfiles)
  }

  const openAddCustomerModal = () => {
    setActiveCustomer(null)
    setIsCustomerModalOpen(true)
  }

  const openEditCustomerModal = (customer: CustomerView) => {
    setActiveCustomer(customer)
    setIsCustomerModalOpen(true)
  }

  const closeCustomerModal = () => {
    setActiveCustomer(null)
    setIsCustomerModalOpen(false)
  }

  const upsertCustomerProfile = (
    email: string,
    updates: Pick<CustomerProfile, 'status' | 'tier' | 'phone' | 'address' | 'name'>,
  ) => {
    const normalizedEmail = normalizeEmail(email)
    const existingProfile = profileData.find(
      (profile) => normalizeEmail(profile.email) === normalizedEmail,
    )
    const nextProfile: CustomerProfile = {
      id: existingProfile?.id ?? createCustomerId(email),
      email,
      name: updates.name,
      phone: updates.phone,
      address: updates.address,
      status: updates.status,
      tier: updates.tier,
    }

    const nextProfiles = existingProfile
      ? profileData.map((profile) =>
          normalizeEmail(profile.email) === normalizedEmail ? nextProfile : profile,
        )
      : [nextProfile, ...profileData]

    persistProfiles(nextProfiles)
  }

  const handleCustomerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = activeCustomer
      ? normalizeEmail(activeCustomer.email)
      : normalizeEmail(String(formData.get('email') ?? ''))
    const name = String(formData.get('name') ?? '').trim()
    const phone = String(formData.get('phone') ?? '').trim()
    const address = String(formData.get('address') ?? '').trim()
    const status = String(formData.get('status') ?? 'Active') as CustomerStatus
    const tier = String(formData.get('tier') ?? 'Standard') as CustomerTier

    if (!email || !email.includes('@') || !name || !phone || !address) {
      return
    }

    const hasUser = users.some((user) => normalizeEmail(user.email) === email)
    if (!activeCustomer && hasUser) {
      window.alert('This customer email already exists.')
      return
    }

    if (!hasUser) {
      persistUsers([
        {
          email,
          password: 'vipbooking',
          role: 'guest',
        },
        ...users,
      ])
    }

    upsertCustomerProfile(email, {
      name,
      phone,
      address,
      status,
      tier,
    })
    closeCustomerModal()
  }

  const handleDeleteCustomer = (customer: CustomerView) => {
    const shouldDelete = window.confirm(`Delete customer "${customer.email}"?`)
    if (!shouldDelete) {
      return
    }

    persistUsers(users.filter((user) => normalizeEmail(user.email) !== normalizeEmail(customer.email)))
    persistProfiles(
      profileData.filter((profile) => normalizeEmail(profile.email) !== normalizeEmail(customer.email)),
    )
  }

  return (
    <div className="admin-stack">
      <div className="metric-grid">
        <article className="metric-card">
          <span className="icon-tile">
            <Icon name="users" />
          </span>
          <p>Total Customers</p>
          <strong>{customers.length}</strong>
          <small>guest accounts</small>
        </article>
        <article className="metric-card">
          <span className="icon-tile">
            <Icon name="check" />
          </span>
          <p>Active Customers</p>
          <strong>{activeCount}</strong>
          <small>enabled profiles</small>
        </article>
        <article className="metric-card">
          <span className="icon-tile">
            <Icon name="award" />
          </span>
          <p>VIP Profiles</p>
          <strong>{vipCount}</strong>
          <small>gold or corporate</small>
        </article>
        <article className="metric-card">
          <span className="icon-tile">
            <Icon name="card" />
          </span>
          <p>Total Spent</p>
          <strong>${totalSpent.toLocaleString()}</strong>
          <small>booking history</small>
        </article>
      </div>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div className="panel-title">
            <Icon name="users" />
            <span>Customer Management</span>
          </div>
          <button className="primary-button compact" type="button" onClick={openAddCustomerModal}>
            <Icon name="plus" />
            Add Customer
          </button>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <label className="flex-1 min-w-[240px]">
            <input
              value={search}
              placeholder="Search by ID, name, email, or phone..."
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          {(['All Customers', 'Active', 'Disabled'] as const).map((status) => (
            <button
              key={status}
              className={`ghost-button compact ${statusFilter === status ? 'border-slate-500 text-white' : ''}`}
              type="button"
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
          <button
            className={`ghost-button compact ${tierFilter ? 'border-slate-500 text-white' : ''}`}
            type="button"
            onClick={() => setTierFilter((value) => !value)}
          >
            VIP Tier
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Tier</th>
                <th>Bookings</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>#{customer.id}</td>
                  <td>
                    <strong>{customer.name}</strong>
                    <br />
                    <small>{customer.address}</small>
                  </td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>
                    <span className="status-chip pending">{customer.tier}</span>
                  </td>
                  <td>{customer.bookings}</td>
                  <td>${customer.totalSpent.toLocaleString()}</td>
                  <td>
                    <span className={`status-chip ${customer.status === 'Active' ? 'success' : 'failed'}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="link-button" type="button" onClick={() => openEditCustomerModal(customer)}>
                        Edit
                      </button>
                      <button className="link-button" type="button" onClick={() => handleDeleteCustomer(customer)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={9}>No customers found for this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isCustomerModalOpen && (
        <div className="admin-modal-backdrop" role="presentation">
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-form-title"
          >
            <div className="admin-modal-header">
              <div>
                <p className="eyebrow">Customer account</p>
                <h2 id="customer-form-title">{activeCustomer ? 'Edit Customer' : 'Add Customer'}</h2>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label="Close customer form"
                onClick={closeCustomerModal}
              >
                <Icon name="close" />
              </button>
            </div>
            <form
              key={activeCustomer?.email ?? 'new-customer'}
              className="admin-room-form"
              onSubmit={handleCustomerSubmit}
            >
              <label>
                Email
                <input
                  name="email"
                  defaultValue={activeCustomer?.email}
                  disabled={Boolean(activeCustomer)}
                  placeholder="guest@email.com"
                  required
                  type="email"
                />
              </label>
              <label>
                Full name
                <input name="name" defaultValue={activeCustomer?.name} placeholder="Guest name" required />
              </label>
              <label>
                Phone number
                <input name="phone" defaultValue={activeCustomer?.phone} placeholder="+84 901 123 456" required />
              </label>
              <label>
                Status
                <select name="status" defaultValue={activeCustomer?.status ?? 'Active'}>
                  <option value="Active">Active</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </label>
              <label>
                Tier
                <select name="tier" defaultValue={activeCustomer?.tier ?? 'Standard'}>
                  <option value="Standard">Standard</option>
                  <option value="VIP GOLD">VIP GOLD</option>
                  <option value="Corporate Account">Corporate Account</option>
                </select>
              </label>
              <label className="span-2">
                Billing address
                <input
                  name="address"
                  defaultValue={activeCustomer?.address}
                  placeholder="Customer billing address"
                  required
                />
              </label>
              <div className="admin-modal-actions span-2">
                <button className="ghost-button" type="button" onClick={closeCustomerModal}>
                  Cancel
                </button>
                <button className="primary-button" type="submit">
                  <Icon name={activeCustomer ? 'check' : 'plus'} />
                  {activeCustomer ? 'Update Customer' : 'Save Customer'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
