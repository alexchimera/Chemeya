export function NervPanel({ children, className, label, coord }: { children: React.ReactNode; className?: string; label?: string; coord?: string }) {
  return (
    <div className={`relative bg-bg-primary rounded-lg border border-border p-4 ${className || ''}`}>
      {label && (
        <div className="text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wide">
          {label}
        </div>
      )}
      {children}
    </div>
  )
}
