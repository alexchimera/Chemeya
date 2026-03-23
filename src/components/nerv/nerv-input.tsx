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
    <div className={`space-y-1.5 ${className || ''}`}>
      <label htmlFor={name} className="block text-sm font-medium text-text-primary">
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
        className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary"
      />
    </div>
  )
}

export function NervTextarea({ label, name, defaultValue, required, placeholder, rows = 3, className }: InputProps & { rows?: number }) {
  return (
    <div className={`space-y-1.5 ${className || ''}`}>
      <label htmlFor={name} className="block text-sm font-medium text-text-primary">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary resize-none"
      />
    </div>
  )
}
