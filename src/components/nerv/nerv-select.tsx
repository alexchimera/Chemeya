type SelectProps = {
  label: string
  name: string
  options: { value: string; label: string }[]
  defaultValue?: string
  required?: boolean
  className?: string
}

export function NervSelect({ label, name, options, defaultValue, required, className }: SelectProps) {
  return (
    <div className={`space-y-1.5 ${className || ''}`}>
      <label htmlFor={name} className="block text-sm font-medium text-text-primary">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary cursor-pointer"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
