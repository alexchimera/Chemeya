export function NervFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative border border-cyan p-2 ${className || ''}`}>
      <div className="absolute inset-[6px] border border-cyan pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
