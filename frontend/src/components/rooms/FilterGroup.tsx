export function FilterGroup({ title, options }: { title: string; options: string[] }) {
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
