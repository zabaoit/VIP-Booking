import { useMemo, useState } from 'react'
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

function initials(fullName: string) {
  return fullName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

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
  const [profileData, setProfileData] = useState<CustomerProfile[]>(() => readCustomerProfiles())

  const allUsers = readRegisteredUsers()
  const bookings = readBookings()
  const guestUsers = allUsers.filter((user) => user.role !== 'admin')

  const customers = useMemo<CustomerView[]>(() => {
    const profileByEmail = new Map(profileData.map((profile) => [normalizeEmail(profile.email), profile]))

    return guestUsers.map((user: RegisteredUser) => {
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
        customer.id.toLowerCase().includes(query)
      return statusMatch && tierMatch && searchMatch
    })
  }, [customers, search, statusFilter, tierFilter])

  const [activeCustomerId, setActiveCustomerId] = useState(() => filteredCustomers[0]?.id ?? '')
  const activeCustomer =
    filteredCustomers.find((customer) => customer.id === activeCustomerId) ?? filteredCustomers[0] ?? null

  const upsertCustomerProfile = (
    email: string,
    updates: Partial<Pick<CustomerProfile, 'status' | 'tier' | 'phone' | 'address' | 'name'>>,
  ) => {
    const normalizedEmail = normalizeEmail(email)
    const existingProfile = profileData.find(
      (profile) => normalizeEmail(profile.email) === normalizedEmail,
    )
    const nextProfile: CustomerProfile = {
      id: existingProfile?.id ?? createCustomerId(email),
      email,
      name: updates.name ?? existingProfile?.name ?? displayNameFromEmail(email),
      phone: updates.phone ?? existingProfile?.phone ?? '+1 (555) 000-0000',
      address: updates.address ?? existingProfile?.address ?? 'Not set',
      status: updates.status ?? existingProfile?.status ?? 'Active',
      tier: updates.tier ?? existingProfile?.tier ?? 'Standard',
    }

    const nextProfiles = existingProfile
      ? profileData.map((profile) =>
          normalizeEmail(profile.email) === normalizedEmail ? nextProfile : profile,
        )
      : [nextProfile, ...profileData]

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
        {
          email,
          password: 'vipbooking',
          role: 'guest',
        },
      ]
      localStorage.setItem(registeredUsersStorageKey, JSON.stringify(nextUsers))
    }

    upsertCustomerProfile(email, {})
    setActiveCustomerId(createCustomerId(email))
  }

  return (
    <div className="admin-stack">
      <section className="admin-panel">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="m-0 text-[1.7rem] leading-tight text-white">Customers</h2>
            <p className="mt-1 text-sm text-slate-400">
              Manage customer accounts and statuses across booking history.
            </p>
          </div>
          <button className="primary-button compact" type="button" onClick={handleAddCustomer}>
            <Icon name="plus" />
            Add Customer
          </button>
        </div>

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
    </div>
  )
}
