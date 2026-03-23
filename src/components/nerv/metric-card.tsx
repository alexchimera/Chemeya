type MetricCardProps = {
  label: string
  value: string | number | null
  subtitle?: string
  coord?: string
}

export function MetricCard({ label, value, subtitle }: MetricCardProps) {
  return (
    <div className="bg-bg-primary rounded-lg border border-border p-4 flex flex-col gap-1">
      <div className="text-xs font-medium text-text-secondary">
        {value != null ? label : 'Awaiting data'}
      </div>
      <div className="text-2xl font-semibold text-text-primary leading-none">
        {value ?? '—'}
      </div>
      {subtitle && (
        <div className="text-xs text-text-tertiary">
          {subtitle}
        </div>
      )}
    </div>
  )
}
