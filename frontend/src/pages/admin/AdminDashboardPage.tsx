import { Icon } from '../../components/icons/Icon'
import { DataTable } from '../../components/ui/DataTable'
import type { IconName } from '../../types'

export function AdminDashboardPage() {
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
              strokeLinecap="round"
              strokeWidth="8"
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
