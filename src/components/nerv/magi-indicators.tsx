type MagiProps = {
  designCount: number
  makeCount: number
  testCount: number
}

export function MagiIndicators({ designCount, makeCount, testCount }: MagiProps) {
  return (
    <div className="flex items-center gap-3 text-xs font-medium">
      <span className={`flex items-center gap-1.5 ${designCount > 0 ? 'text-accent' : 'text-text-tertiary'}`}>
        <span className={`w-2 h-2 rounded-full ${designCount > 0 ? 'bg-accent' : 'bg-border'}`} />
        Design
      </span>
      <span className={`flex items-center gap-1.5 ${makeCount > 0 ? 'text-green' : 'text-text-tertiary'}`}>
        <span className={`w-2 h-2 rounded-full ${makeCount > 0 ? 'bg-green' : 'bg-border'}`} />
        Synth
      </span>
      <span className={`flex items-center gap-1.5 ${testCount > 0 ? 'text-blue' : 'text-text-tertiary'}`}>
        <span className={`w-2 h-2 rounded-full ${testCount > 0 ? 'bg-blue' : 'bg-border'}`} />
        Assay
      </span>
    </div>
  )
}
