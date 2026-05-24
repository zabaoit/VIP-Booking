<<<<<<< HEAD
import { useMemo, useState } from 'react'
=======
import { useMemo, useState, type FormEvent } from 'react'
>>>>>>> main
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

<<<<<<< HEAD
function initials(fullName: string) {
  return fullName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

=======
>>>>>>> main
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
<<<<<<< HEAD
  const [profileData, setProfileData] = useState<CustomerProfile[]>(() => readCustomerProfiles())

  const allUsers = readRegisteredUsers()
  const bookings = readBookings()
  const guestUsers = allUsers.filter((user) => user.role !== 'admin')
=======
  const [activeCustomer, setActiveCustomer] = useState<CustomerView | null>(null)
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [users, setUsers] = useState<RegisteredUser[]>(() => readRegisteredUsers())
  const [profileData, setProfileData] = useState<CustomerProfile[]>(() => readCustomerProfiles())

  const bookings = readBookings()
  const guestUsers = users.filter((user) => user.role !== 'admin')
>>>>>>> main

  const customers = useMemo<CustomerView[]>(() => {
    const profileByEmail = new Map(profileData.map((profile) => [normalizeEmail(profile.email), profile]))

<<<<<<< HEAD
    return guestUsers.map((user: RegisteredUser) => {
=======
    return guestUsers.map((user) => {
>>>>>>> main
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
<<<<<<< HEAD
        customer.id.toLowerCase().includes(query)
=======
        customer.id.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query)
>>>>>>> main
      return statusMatch && tierMatch && searchMatch
    })
  }, [customers, search, statusFilter, tierFilter])

<<<<<<< HEAD
  const [activeCustomerId, setActiveCustomerId] = useState(() => filteredCustomers[0]?.id ?? '')
  const activeCustomer =
    filteredCustomers.find((customer) => customer.id === activeCustomerId) ?? filteredCustomers[0] ?? null

  const upsertCustomerProfile = (
    email: string,
    updates: Partial<Pick<CustomerProfile, 'status' | 'tier' | 'phone' | 'address' | 'name'>>,
=======
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
>>>>>>> main
  ) => {
    const normalizedEmail = normalizeEmail(email)
    const existingProfile = profileData.find(
      (profile) => normalizeEmail(profile.email) === normalizedEmail,
    )
    const nextProfile: CustomerProfile = {
      id: existingProfile?.id ?? createCustomerId(email),
      email,
<<<<<<< HEAD
      name: updates.name ?? existingProfile?.name ?? displayNameFromEmail(email),
      phone: updates.phone ?? existingProfile?.phone ?? '+1 (555) 000-0000',
      address: updates.address ?? existingProfile?.address ?? 'Not set',
      status: updates.status ?? existingProfile?.status ?? 'Active',
      tier: updates.tier ?? existingProfile?.tier ?? 'Standard',
=======
      name: updates.name,
      phone: updates.phone,
      address: updates.address,
      status: updates.status,
      tier: updates.tier,
>>>>>>> main
    }

    const nextProfiles = existingProfile
      ? profileData.map((profile) =>
          normalizeEmail(profile.email) === normalizedEmail ? nextProfile : profile,
        )
      : [nextProfile, ...profileData]

<<<<<<< HEAD
    setProfileData(nextProfiles)
    saveCustomerProfiles(nextProfiles)
  }

  const handleAddCustomer = () => {
    const emailInput = window.prompt('Enter customer email')
    const email = emailInput?.trim().toLowerCase() ?? ''

    if (!email || !email.includes('@')) {
      return
    }

    const hasUser = allUsers.some((user) => normalizeEmail(user.email) === email)
    if (!hasUser) {
      const nextUsers: RegisteredUser[] = [
        ...allUsers,
=======
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
>>>>>>> main
        {
          email,
          password: 'vipbooking',
          role: 'guest',
        },
<<<<<<< HEAD
      ]
      localStorage.setItem(registeredUsersStorageKey, JSON.stringify(nextUsers))
    }

    upsertCustomerProfile(email, {})
    setActiveCustomerId(createCustomerId(email))
=======
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
>>>>>>> main
  }

  return (
    <div className="admin-stack">
<<<<<<< HEAD
      <section className="admin-panel">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="m-0 text-[1.7rem] leading-tight text-white">Customers</h2>
            <p className="mt-1 text-sm text-slate-400">
              Manage customer accounts and statuses across booking history.
            </p>
          </div>
          <button className="primary-button compact" type="button" onClick={handleAddCustomer}>
=======
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
>>>>>>> main
            <Icon name="plus" />
            Add Customer
          </button>
        </div>

<<<<<<< HEAD
        <div className="mb-3 grid gap-2">
          <label>
            <input
              value={search}
              placeholder="Search customers by name, email, or ID..."
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className={`ghost-button compact ${statusFilter === 'All Customers' ? 'border-slate-500 text-white' : ''}`}
              type="button"
              onClick={() => setStatusFilter('All Customers')}
            >
              All Customers
            </button>
            <button
              className={`ghost-button compact ${statusFilter === 'Active' ? 'border-slate-500 text-white' : ''}`}
              type="button"
              onClick={() => setStatusFilter('Active')}
            >
              Active
            </button>
            <button
              className={`ghost-button compact ${statusFilter === 'Disabled' ? 'border-slate-500 text-white' : ''}`}
              type="button"
              onClick={() => setStatusFilter('Disabled')}
            >
              Disabled
            </button>
            <button
              className={`ghost-button compact ${tierFilter ? 'border-slate-500 text-white' : ''}`}
              type="button"
              onClick={() => setTierFilter((value) => !value)}
            >
              VIP Tier
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[290px_minmax(0,1fr)]">
          <div className="rounded-xl border border-slate-700 bg-slate-950/55">
            <div className="border-b border-slate-700 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Customer
            </div>
            <div className="max-h-[440px] overflow-auto">
              {filteredCustomers.map((customer) => (
                <button
                  key={customer.id}
                  className={`flex w-full items-start gap-3 border-b border-slate-800 px-3 py-3 text-left transition hover:bg-slate-800/40 ${
                    customer.id === activeCustomer?.id ? 'bg-slate-800/65' : ''
                  }`}
                  type="button"
                  onClick={() => setActiveCustomerId(customer.id)}
                >
                  <span className="inline-grid h-8 w-8 place-items-center rounded-full border border-slate-600 text-xs font-semibold text-slate-200">
                    {initials(customer.name)}
                  </span>
                  <span className="grid gap-0.5">
                    <strong className="text-sm text-white">{customer.name}</strong>
                    <small className="text-xs text-slate-400">ID: #{customer.id}</small>
                  </span>
                </button>
              ))}
              {filteredCustomers.length === 0 && (
                <p className="p-3 text-sm text-slate-400">No customers found.</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-950/55">
            <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
              <strong className="text-sm text-white">Customer Profile</strong>
              <button className="link-button text-sm" type="button" onClick={() => setActiveCustomerId('')}>
                Close
              </button>
            </div>

            {activeCustomer ? (
              <div className="grid gap-4 p-4">
                <div className="grid justify-items-center gap-2 text-center">
                  <span className="inline-grid h-14 w-14 place-items-center rounded-full border border-blue-400/50 bg-slate-900 text-base font-semibold text-white">
                    {initials(activeCustomer.name)}
                  </span>
                  <strong className="text-base text-white">{activeCustomer.name}</strong>
                  <span className="text-sm text-slate-400">{activeCustomer.email}</span>
                  <span className="status-chip pending">{activeCustomer.tier}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                    <p className="m-0 text-xs text-slate-400">Total Spent</p>
                    <strong className="mt-1 inline-block text-white">
                      ${activeCustomer.totalSpent.toLocaleString()}
                    </strong>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                    <p className="m-0 text-xs text-slate-400">Bookings</p>
                    <strong className="mt-1 inline-block text-white">{activeCustomer.bookings}</strong>
                  </div>
                </div>

                <div className="grid gap-2 border-t border-slate-700 pt-3 text-sm text-slate-300">
                  <div>
                    <p className="m-0 text-xs uppercase tracking-wide text-slate-400">Phone Number</p>
                    <p className="m-0 mt-1">{activeCustomer.phone}</p>
                  </div>
                  <div>
                    <p className="m-0 text-xs uppercase tracking-wide text-slate-400">Billing Address</p>
                    <p className="m-0 mt-1">{activeCustomer.address}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <label className="grid gap-1 text-xs text-slate-300">
                      Status
                      <select
                        value={activeCustomer.status}
                        onChange={(event) =>
                          upsertCustomerProfile(activeCustomer.email, {
                            status: event.target.value as CustomerStatus,
                          })
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Disabled">Disabled</option>
                      </select>
                    </label>
                    <label className="grid gap-1 text-xs text-slate-300">
                      Tier
                      <select
                        value={activeCustomer.tier}
                        onChange={(event) =>
                          upsertCustomerProfile(activeCustomer.email, {
                            tier: event.target.value as CustomerTier,
                          })
                        }
                      >
                        <option value="Standard">Standard</option>
                        <option value="VIP GOLD">VIP GOLD</option>
                        <option value="Corporate Account">Corporate Account</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <p className="p-4 text-slate-400">Select a customer to view profile details.</p>
            )}
          </div>
        </div>
      </section>
=======
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
>>>>>>> main
    </div>
  )
}
