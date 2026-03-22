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
    <div className={`space-y-1 ${className || ''}`}>
      <label htmlFor={name} className="block text-[10px] uppercase tracking-[0.1em] text-text-structural">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="w-full bg-bg-inset border border-cyan-dim px-3 py-1.5 text-amber text-[12px] uppercase tracking-[0.05em] appearance-none cursor-pointer"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
