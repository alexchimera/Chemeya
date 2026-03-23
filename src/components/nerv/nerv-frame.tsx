export function NervFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-bg-primary rounded-xl border border-border shadow-sm ${className || ''}`}>
      <div className="relative">{children}</div>
    </div>
  )
}
