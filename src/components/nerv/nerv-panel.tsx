export function NervPanel({ children, className, label, coord }: { children: React.ReactNode; className?: string; label?: string; coord?: string }) {
  return (
    <div className={`relative border border-cyan/30 bg-bg-panel p-3 ${className || ''}`}>
      {/* Top-left corner bracket */}
      <div className="absolute -top-px -left-px w-3.5 h-3.5 border-t-2 border-l-2 border-cyan" />
      {/* Bottom-right corner bracket */}
      <div className="absolute -bottom-px -right-px w-3.5 h-3.5 border-b-2 border-r-2 border-cyan" />
      {label && (
        <div className="absolute -top-2.5 left-4 px-1 bg-bg-panel text-text-structural text-[10px] uppercase tracking-[0.1em]">
          {label}
        </div>
      )}
      {coord && (
        <div className="absolute top-1 right-2 text-cyan-dim text-[9px] tracking-wider opacity-60">
          {coord}
        </div>
      )}
      {children}
    </div>
  )
}
