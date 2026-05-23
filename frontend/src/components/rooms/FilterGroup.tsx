export function FilterGroup({
  title,
  options,
  selectedOptions,
  onToggle,
}: {
  title: string
  options: string[]
  selectedOptions: string[]
  onToggle: (option: string) => void
}) {
  return (
    <div className="grid gap-2.5">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      {options.map((option) => (
        <label className="inline-flex items-center gap-2 text-sm text-slate-300" key={option}>
          <input
            className="h-4 w-4 accent-blue-500"
            checked={selectedOptions.includes(option)}
            type="checkbox"
            onChange={() => onToggle(option)}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  )
}
