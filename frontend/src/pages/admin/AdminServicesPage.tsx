import { useState, type FormEvent } from 'react'
import { Icon } from '../../components/icons/Icon'
import type { IconName, Service } from '../../types'
import { readServices, saveServices } from '../../utils/appStorage'

const serviceIconOptions: IconName[] = ['spark', 'shield', 'award', 'calendar', 'service']

function formatServicePrice(price: string) {
  const value = price.trim()
  return value.startsWith('$') ? value : `$${value}`
}

export function AdminServicesPage() {
  const [serviceItems, setServiceItems] = useState<Service[]>(() => readServices())
  const [activeService, setActiveService] = useState<Service | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | Service['status']>('All')

  const openAddModal = () => {
    setActiveService(null)
    setIsModalOpen(true)
  }

  const openEditModal = (service: Service) => {
    setActiveService(service)
    setIsModalOpen(true)
  }

  const persistServices = (nextServices: Service[]) => {
    setServiceItems(nextServices)
    saveServices(nextServices)
  }

  const handleToggleStatus = (serviceName: string) => {
    const nextServices = serviceItems.map((service) =>
      service.name === serviceName
        ? { ...service, status: (service.status === 'Active' ? 'Paused' : 'Active') as Service['status'] }
        : service,
    )

    persistServices(nextServices)
  }

  const handleServiceSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const price = String(formData.get('price') ?? '').trim()
    const note = String(formData.get('note') ?? '').trim()
    const icon = String(formData.get('icon') ?? 'service') as IconName
    const status = String(formData.get('status') ?? 'Active') as Service['status']

    if (!name || !price || !note) {
      return
    }

    const nextService: Service = {
      name,
      icon,
      price: formatServicePrice(price),
      note,
      status,
    }

    const nextServices = activeService
      ? serviceItems.map((service) => (service.name === activeService.name ? nextService : service))
      : [nextService, ...serviceItems]

    persistServices(nextServices)
    setIsModalOpen(false)
    setActiveService(null)
  }

  const filteredServices = serviceItems.filter((service) => {
    const statusMatch = statusFilter === 'All' || service.status === statusFilter
    const searchQuery = search.trim().toLowerCase()
    const searchMatch =
      !searchQuery ||
      service.name.toLowerCase().includes(searchQuery) ||
      service.note.toLowerCase().includes(searchQuery) ||
      service.price.toLowerCase().includes(searchQuery)

    return statusMatch && searchMatch
  })

  return (
    <div className="admin-stack">
      <section className="admin-panel">
        <div className="admin-panel-header">
          <div className="panel-title">
            <Icon name="service" />
            <span>Service Management</span>
          </div>

          <button className="primary-button compact" type="button" onClick={openAddModal}>
            <Icon name="plus" />
            Add New Service
          </button>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <label className="flex-1 min-w-[220px]">
            <input
              value={search}
              placeholder="Search services..."
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <button
            className={`ghost-button compact ${statusFilter === 'All' ? 'border-slate-500 text-white' : ''}`}
            type="button"
            onClick={() => setStatusFilter('All')}
          >
            All Services
          </button>
          <button
            className={`ghost-button compact ${statusFilter === 'Active' ? 'border-slate-500 text-white' : ''}`}
            type="button"
            onClick={() => setStatusFilter('Active')}
          >
            Active
          </button>
          <button
            className={`ghost-button compact ${statusFilter === 'Paused' ? 'border-slate-500 text-white' : ''}`}
            type="button"
            onClick={() => setStatusFilter('Paused')}
          >
            Paused
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Category</th>
                <th>Price</th>
                <th>Description</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr key={service.name}>
                  <td>{service.name}</td>
                  <td>
                    <span className="status-chip pending">{service.icon}</span>
                  </td>
                  <td>{service.price}</td>
                  <td>{service.note}</td>
                  <td>
                    <label className="check-row">
                      <input
                        checked={service.status === 'Active'}
                        type="checkbox"
                        onChange={() => handleToggleStatus(service.name)}
                      />
                    </label>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="link-button"
                        type="button"
                        onClick={() => openEditModal(service)}
                      >
                        Edit
                      </button>
                      <button
                        className="link-button"
                        type="button"
                        onClick={() =>
                          persistServices(serviceItems.filter((item) => item.name !== service.name))
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredServices.length === 0 && (
                <tr>
                  <td colSpan={6}>No services found for this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <div className="admin-modal-backdrop" role="presentation">
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
          >
            <div className="admin-modal-header">
              <div>
                <p className="eyebrow">Service catalog</p>
                <h2 id="service-modal-title">
                  {activeService ? 'Edit Service' : 'Add Service'}
                </h2>
              </div>

              <button
                className="icon-button"
                type="button"
                aria-label="Close service form"
                onClick={() => setIsModalOpen(false)}
              >
                <Icon name="close" />
              </button>
            </div>

            <form className="admin-room-form" onSubmit={handleServiceSubmit}>
              <label>
                Service Name
                <input
                  name="name"
                  placeholder="Private Dinner Setup"
                  defaultValue={activeService?.name}
                  required
                />
              </label>

              <label>
                Price
                <input
                  name="price"
                  placeholder="95"
                  defaultValue={activeService?.price.replace('$', '')}
                  required
                />
              </label>

              <label>
                Icon
                <select name="icon" defaultValue={activeService?.icon ?? 'service'}>
                  {serviceIconOptions.map((iconName) => (
                    <option key={iconName} value={iconName}>
                      {iconName}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Status
                <select name="status" defaultValue={activeService?.status ?? 'Active'}>
                  <option>Active</option>
                  <option>Paused</option>
                </select>
              </label>

              <label className="span-2">
                Description
                <textarea
                  name="note"
                  placeholder="Short service note..."
                  defaultValue={activeService?.note}
                  required
                  rows={4}
                />
              </label>

              <div className="admin-modal-actions span-2">
                <button className="ghost-button" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>

                <button className="primary-button" type="submit">
                  <Icon name={activeService ? 'edit' : 'plus'} />
                  {activeService ? 'Save Changes' : 'Save Service'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
