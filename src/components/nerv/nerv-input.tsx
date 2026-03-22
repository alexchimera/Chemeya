type InputProps = {
  label: string
  name: string
  type?: string
  defaultValue?: string
  required?: boolean
  maxLength?: number
  placeholder?: string
  className?: string
}

export function NervInput({ label, name, type = 'text', defaultValue, required, maxLength, placeholder, className }: InputProps) {
  return (
    <div className={`space-y-1 ${className || ''}`}>
      <label htmlFor={name} className="block text-[10px] uppercase tracking-[0.1em] text-text-structural">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        className="w-full bg-bg-inset border border-cyan-dim px-3 py-1.5 text-amber text-[12px] tracking-[0.05em] placeholder:text-text-muted"
      />
    </div>
  )
}

export function NervTextarea({ label, name, defaultValue, required, placeholder, rows = 3, className }: InputProps & { rows?: number }) {
  return (
    <div className={`space-y-1 ${className || ''}`}>
      <label htmlFor={name} className="block text-[10px] uppercase tracking-[0.1em] text-text-structural">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-bg-inset border border-cyan-dim px-3 py-1.5 text-amber text-[12px] tracking-[0.05em] placeholder:text-text-muted resize-none"
      />
    </div>
  )
}
