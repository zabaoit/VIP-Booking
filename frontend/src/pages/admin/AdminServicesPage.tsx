import { useState, type FormEvent } from 'react'
import { Icon } from '../../components/icons/Icon'
import { DataTable } from '../../components/ui/DataTable'
import { services } from '../../data/services'
import type { IconName, Service } from '../../types'

const serviceIconOptions: IconName[] = [
  'spark',
  'shield',
  'award',
  'calendar',
  'service',
]

function formatServicePrice(price: string) {
  const value = price.trim()
  return value.startsWith('$')
    ? value
    : `$${value}`
}

export function AdminServicesPage() {
  const [serviceItems, setServiceItems] =
    useState<Service[]>(services)

  const [isAddModalOpen, setIsAddModalOpen] =
    useState(false)

  const handleAddService = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    const formData = new FormData(
      event.currentTarget
    )

    const name = String(
      formData.get('name') ?? ''
    ).trim()

    const price = String(
      formData.get('price') ?? ''
    ).trim()

    const note = String(
      formData.get('note') ?? ''
    ).trim()

    const icon = String(
      formData.get('icon') ?? 'service'
    ) as IconName

    const status = String(
      formData.get('status') ?? 'Active'
    ) as Service['status']

    if (!name || !price || !note) {
      return
    }

    setServiceItems((current) => [
      {
        name,
        icon,
        price: formatServicePrice(price),
        note,
        status,
      },
      ...current,
    ])

    setIsAddModalOpen(false)
    event.currentTarget.reset()
  }

  return (
    <div className="admin-stack">
      <section className="admin-panel">
        <div className="admin-panel-header">
          <div className="panel-title">
            <Icon name="service" />
            <span>Service Management</span>
          </div>

          <button
            className="primary-button compact"
            type="button"
            onClick={() =>
              setIsAddModalOpen(true)
            }
          >
            <Icon name="plus" />
            Thêm dịch vụ
          </button>
        </div>

        <DataTable
          headers={[
            'Service',
            'Price',
            'Description',
            'Status',
            'Actions',
          ]}
          rows={serviceItems.map((service) => [
            service.name,
            service.price,
            service.note,
            service.status,
            'Edit',
          ])}
        />
      </section>

      {isAddModalOpen && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
        >
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-service-title"
          >
            <div className="admin-modal-header">
              <div>
                <p className="eyebrow">
                  Service catalog
                </p>

                <h2 id="add-service-title">
                  Thêm dịch vụ
                </h2>
              </div>

              <button
                className="icon-button"
                type="button"
                aria-label="Close add service form"
                onClick={() =>
                  setIsAddModalOpen(false)
                }
              >
                <Icon name="close" />
              </button>
            </div>

            <form
              className="admin-room-form"
              onSubmit={handleAddService}
            >
              <label>
                Tên dịch vụ
                <input
                  name="name"
                  placeholder="Private Dinner Setup"
                  required
                />
              </label>

              <label>
                Giá dịch vụ
                <input
                  name="price"
                  placeholder="95"
                  required
                />
              </label>

              <label>
                Icon
                <select
                  name="icon"
                  defaultValue="service"
                >
                  {serviceIconOptions.map(
                    (iconName) => (
                      <option
                        key={iconName}
                        value={iconName}
                      >
                        {iconName}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label>
                Trạng thái
                <select
                  name="status"
                  defaultValue="Active"
                >
                  <option>Active</option>
                  <option>Paused</option>
                </select>
              </label>

              <label className="span-2">
                Mô tả
                <textarea
                  name="note"
                  placeholder="Mô tả ngắn về dịch vụ..."
                  required
                  rows={4}
                />
              </label>

              <div className="admin-modal-actions span-2">
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() =>
                    setIsAddModalOpen(false)
                  }
                >
                  Hủy
                </button>

                <button
                  className="primary-button"
                  type="submit"
                >
                  <Icon name="plus" />
                  Lưu dịch vụ
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}