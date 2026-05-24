import { useMemo, useState, type FormEvent } from 'react'
import { Icon } from '../../components/icons/Icon'
import type { PricingRule } from '../../types'
import { readPricingRules, savePricingRules } from '../../utils/appStorage'

export function AdminPricingPage() {
  const [rules, setRules] = useState<PricingRule[]>(() => readPricingRules())
  const [activeTab, setActiveTab] = useState<'dynamic' | 'seasonal' | 'discounts'>('dynamic')
<<<<<<< HEAD
=======
  const [activeRule, setActiveRule] = useState<PricingRule | null>(null)
>>>>>>> main
  const [search, setSearch] = useState('')

  const persistRules = (nextRules: PricingRule[]) => {
    setRules(nextRules)
    savePricingRules(nextRules)
  }

  const visibleRules = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return rules
    }

    return rules.filter((rule) => {
      return (
        rule.name.toLowerCase().includes(query) ||
        rule.roomType.toLowerCase().includes(query) ||
        rule.trigger.toLowerCase().includes(query) ||
        rule.adjustment.toLowerCase().includes(query)
      )
    })
  }, [rules, search])

<<<<<<< HEAD
  const handleCreateRule = (event: FormEvent<HTMLFormElement>) => {
=======
  const handleRuleSubmit = (event: FormEvent<HTMLFormElement>) => {
>>>>>>> main
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('ruleName') ?? '').trim()
    const roomType = String(formData.get('roomType') ?? '').trim()
    const trigger = String(formData.get('trigger') ?? '').trim()
    const actionType = String(formData.get('actionType') ?? 'Increase (+)').trim()
    const actionValue = Number(formData.get('adjustmentValue') ?? 0)
    const startDate = String(formData.get('startDate') ?? '')
    const endDate = String(formData.get('endDate') ?? '')

    if (!name || !roomType || !trigger || !startDate || !endDate || actionValue <= 0) {
      return
    }

    const adjustment = `${actionType === 'Increase (+)' ? '+' : '-'}${actionValue}%`
    const nextRule: PricingRule = {
<<<<<<< HEAD
      id: `${Date.now()}`,
=======
      id: activeRule?.id ?? `${Date.now()}`,
>>>>>>> main
      name,
      roomType,
      trigger,
      adjustment,
      startDate,
      endDate,
    }

<<<<<<< HEAD
    persistRules([nextRule, ...rules])
    event.currentTarget.reset()
  }

=======
    persistRules(
      activeRule
        ? rules.map((rule) => (rule.id === activeRule.id ? nextRule : rule))
        : [nextRule, ...rules],
    )
    setActiveRule(null)
    event.currentTarget.reset()
  }

  const handleDeleteRule = (rule: PricingRule) => {
    const shouldDelete = window.confirm(`Delete pricing rule "${rule.name}"?`)
    if (!shouldDelete) {
      return
    }

    persistRules(rules.filter((item) => item.id !== rule.id))
    if (activeRule?.id === rule.id) {
      setActiveRule(null)
    }
  }

>>>>>>> main
  return (
    <div className="admin-stack">
      <section className="admin-panel">
        <header className="mb-4">
          <h2 className="m-0 text-[1.7rem] leading-tight text-white">Pricing Management</h2>
          <p className="mt-1 text-sm text-slate-400">
            Manage room rates, seasonal adjustments, and discounts.
          </p>
        </header>

        <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-slate-700 pb-2">
          {[
            ['dynamic', 'Dynamic Pricing Rules'],
            ['seasonal', 'Seasonal Adjustments'],
            ['discounts', 'Discount Settings'],
          ].map(([key, label]) => (
            <button
              key={key}
              className={`rounded-md px-2 py-1 text-sm font-semibold transition ${
                activeTab === key
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
              type="button"
              onClick={() => setActiveTab(key as 'dynamic' | 'seasonal' | 'discounts')}
            >
              {label}
            </button>
          ))}
        </div>

<<<<<<< HEAD
        {activeTab === 'dynamic' && (
          <div className="grid gap-4">
            <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <Icon name="plus" size={15} />
                <span>Create New Rule</span>
              </div>

              <form className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4" onSubmit={handleCreateRule}>
                <label className="grid gap-1 text-xs text-slate-300 xl:col-span-2">
                  Rule Name
                  <input name="ruleName" placeholder="e.g. High Occupancy Week" required />
                </label>
                <label className="grid gap-1 text-xs text-slate-300">
                  Room Type
                  <select name="roomType" defaultValue="All Room Types">
=======
        {activeTab && (
          <div className="grid gap-4">
            <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <Icon name={activeRule ? 'edit' : 'plus'} size={15} />
                <span>{activeRule ? 'Edit Rule' : 'Create New Rule'}</span>
              </div>

              <form
                key={activeRule?.id ?? 'new-rule'}
                className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
                onSubmit={handleRuleSubmit}
              >
                <label className="grid gap-1 text-xs text-slate-300 xl:col-span-2">
                  Rule Name
                  <input
                    name="ruleName"
                    defaultValue={activeRule?.name}
                    placeholder="e.g. High Occupancy Week"
                    required
                  />
                </label>
                <label className="grid gap-1 text-xs text-slate-300">
                  Room Type
                  <select name="roomType" defaultValue={activeRule?.roomType ?? 'All Room Types'}>
>>>>>>> main
                    <option>All Room Types</option>
                    <option>Standard King</option>
                    <option>Executive Ocean View</option>
                    <option>Garden Residence</option>
                  </select>
                </label>
                <label className="grid gap-1 text-xs text-slate-300">
                  Trigger Condition
<<<<<<< HEAD
                  <select name="trigger" defaultValue="Occupancy > 80%">
=======
                  <select name="trigger" defaultValue={activeRule?.trigger ?? 'Occupancy > 80%'}>
>>>>>>> main
                    <option>Occupancy &gt; 80%</option>
                    <option>Occupancy &gt; 85%</option>
                    <option>Days to Check in &lt; 3</option>
                    <option>Manual Override</option>
                  </select>
                </label>
                <label className="grid gap-1 text-xs text-slate-300">
                  Price Adjustment
                  <div className="grid grid-cols-[1fr_84px] gap-2">
<<<<<<< HEAD
                    <select name="actionType" defaultValue="Increase (+)">
=======
                    <select
                      name="actionType"
                      defaultValue={activeRule?.adjustment.startsWith('-') ? 'Decrease (-)' : 'Increase (+)'}
                    >
>>>>>>> main
                      <option>Increase (+)</option>
                      <option>Decrease (-)</option>
                    </select>
                    <input
                      name="adjustmentValue"
                      type="number"
                      min="1"
                      max="100"
<<<<<<< HEAD
                      defaultValue={15}
=======
                      defaultValue={activeRule ? Number(activeRule.adjustment.replace(/[^0-9.]/g, '')) : 15}
>>>>>>> main
                    />
                  </div>
                </label>
                <label className="grid gap-1 text-xs text-slate-300">
                  Effective Start Date
<<<<<<< HEAD
                  <input name="startDate" type="date" required />
                </label>
                <label className="grid gap-1 text-xs text-slate-300">
                  Effective End Date
                  <input name="endDate" type="date" required />
                </label>
                <div className="flex items-end justify-end gap-2 md:col-span-2 xl:col-span-4">
                  <button className="ghost-button compact" type="reset">
                    Clear
                  </button>
                  <button className="primary-button compact" type="submit">
                    <Icon name="check" size={14} />
                    Save Rule
=======
                  <input name="startDate" defaultValue={activeRule?.startDate} type="date" required />
                </label>
                <label className="grid gap-1 text-xs text-slate-300">
                  Effective End Date
                  <input name="endDate" defaultValue={activeRule?.endDate} type="date" required />
                </label>
                <div className="flex items-end justify-end gap-2 md:col-span-2 xl:col-span-4">
                  <button
                    className="ghost-button compact"
                    type="button"
                    onClick={() => setActiveRule(null)}
                  >
                    {activeRule ? 'Cancel Edit' : 'Clear'}
                  </button>
                  <button className="primary-button compact" type="submit">
                    <Icon name="check" size={14} />
                    {activeRule ? 'Update Rule' : 'Save Rule'}
>>>>>>> main
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h3 className="m-0 text-base font-semibold text-white">Active Rules</h3>
                <label className="relative min-w-[220px] flex-1 md:max-w-[320px]">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Icon name="search" size={14} />
                  </span>
                  <input
                    value={search}
                    placeholder="Search rules..."
                    className="pl-9"
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </label>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Rule Name</th>
                      <th>Room Type</th>
                      <th>Trigger</th>
                      <th>Adjustment</th>
                      <th>Date Range</th>
<<<<<<< HEAD
=======
                      <th>Actions</th>
>>>>>>> main
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRules.map((rule) => (
                      <tr key={rule.id}>
                        <td>
                          <strong>{rule.name}</strong>
                        </td>
                        <td>{rule.roomType}</td>
                        <td>{rule.trigger}</td>
                        <td>
                          <span
                            className={`font-semibold ${
                              rule.adjustment.startsWith('+') ? 'text-emerald-300' : 'text-amber-300'
                            }`}
                          >
                            {rule.adjustment}
                          </span>
                        </td>
                        <td>
                          {rule.startDate} to {rule.endDate}
                        </td>
<<<<<<< HEAD
=======
                        <td>
                          <div className="row-actions">
                            <button className="link-button" type="button" onClick={() => setActiveRule(rule)}>
                              Edit
                            </button>
                            <button className="link-button" type="button" onClick={() => handleDeleteRule(rule)}>
                              Delete
                            </button>
                          </div>
                        </td>
>>>>>>> main
                      </tr>
                    ))}
                    {visibleRules.length === 0 && (
                      <tr>
<<<<<<< HEAD
                        <td colSpan={5}>No pricing rules matched your search.</td>
=======
                        <td colSpan={6}>No pricing rules matched your search.</td>
>>>>>>> main
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

<<<<<<< HEAD
        {activeTab === 'seasonal' && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4 text-slate-300">
            Configure monthly and holiday-based multipliers for each room class.
          </div>
        )}

        {activeTab === 'discounts' && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4 text-slate-300">
            Manage loyalty, corporate, and campaign discount settings in one place.
          </div>
        )}
=======
>>>>>>> main
      </section>
    </div>
  )
}
