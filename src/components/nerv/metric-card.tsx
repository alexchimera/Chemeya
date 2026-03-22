import { NervPanel } from './nerv-panel'

type MetricCardProps = {
  label: string
  value: string | number | null
  subtitle?: string
  coord?: string
}

export function MetricCard({ label, value, subtitle, coord }: MetricCardProps) {
  return (
    <NervPanel coord={coord} className="flex flex-col gap-1 min-w-0">
      <div className="text-[10px] uppercase tracking-[0.1em] text-text-structural">
        {value != null ? label : 'AWAITING DATA'}
      </div>
      <div className="text-[28px] font-semibold text-amber-bright leading-none tracking-wider">
        {value ?? '---'}
      </div>
      {subtitle && (
        <div className="text-[10px] text-amber-dim uppercase tracking-[0.05em]">
          {subtitle}
        </div>
      )}
    </NervPanel>
  )
}
