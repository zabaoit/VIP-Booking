import { Icon } from '../../components/icons/Icon'
import { DataTable } from '../../components/ui/DataTable'
import { services } from '../../data/services'

export function AdminServicesPage() {
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
