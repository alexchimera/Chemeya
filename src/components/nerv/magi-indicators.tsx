type MagiProps = {
  designCount: number
  makeCount: number
  testCount: number
}

export function MagiIndicators({ designCount, makeCount, testCount }: MagiProps) {
  return (
    <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.1em]">
      <span className={designCount > 0 ? 'text-amber' : 'text-text-muted'}>
        ■ DESIGN
      </span>
      <span className={makeCount > 0 ? 'text-amber' : 'text-text-muted'}>
        ■ SYNTH
      </span>
      <span className={testCount > 0 ? 'text-amber' : 'text-text-muted'}>
        ■ ASSAY
      </span>
    </div>
  )
}
