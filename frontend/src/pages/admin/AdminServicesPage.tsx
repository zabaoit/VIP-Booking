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
            Them dich vu
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Price</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {serviceItems.map((service) => (
                <tr key={service.name}>
                  <td>{service.name}</td>
                  <td>{service.price}</td>
                  <td>{service.note}</td>
                  <td>
                    <span
                      className={`status-chip ${
                        service.status === 'Active' ? 'success' : 'pending'
                      }`}
                    >
                      {service.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="link-button"
                      type="button"
                      onClick={() => openEditModal(service)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
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
                  {activeService ? 'Sua dich vu' : 'Them dich vu'}
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
                Ten dich vu
                <input
                  name="name"
                  placeholder="Private Dinner Setup"
                  defaultValue={activeService?.name}
                  required
                />
              </label>

              <label>
                Gia dich vu
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
                Trang thai
                <select name="status" defaultValue={activeService?.status ?? 'Active'}>
                  <option>Active</option>
                  <option>Paused</option>
                </select>
              </label>

              <label className="span-2">
                Mo ta
                <textarea
                  name="note"
                  placeholder="Mo ta ngan ve dich vu..."
                  defaultValue={activeService?.note}
                  required
                  rows={4}
                />
              </label>

              <div className="admin-modal-actions span-2">
                <button className="ghost-button" type="button" onClick={() => setIsModalOpen(false)}>
                  Huy
                </button>

                <button className="primary-button" type="submit">
                  <Icon name={activeService ? 'edit' : 'plus'} />
                  {activeService ? 'Luu thay doi' : 'Luu dich vu'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
