import Link from 'next/link'

type CompoundCardProps = {
  id: string
  compoundId: string
  description: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  daysInStage: number
  status: string | null
  blockerCount: number
  programId: string
}

const priorityStyles = {
  HIGH: 'bg-red-light text-red',
  MEDIUM: 'bg-yellow-light text-yellow',
  LOW: 'bg-blue-light text-blue',
}

export function CompoundCard({ id, compoundId, description, priority, daysInStage, status, blockerCount }: CompoundCardProps) {
  return (
    <Link
      href={`/compounds/${id}/edit`}
      className="block bg-bg-primary border border-border rounded-lg p-3 hover:shadow-md hover:border-border/80 transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-sm font-semibold text-text-primary">
          {compoundId}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityStyles[priority]}`}>
          {priority.charAt(0) + priority.slice(1).toLowerCase()}
        </span>
      </div>
      <div className="text-text-secondary text-xs leading-relaxed mb-2 line-clamp-2">
        {description}
      </div>
      <div className="flex items-center gap-1.5 text-xs">
        <span className="bg-bg-tertiary text-text-secondary px-2 py-0.5 rounded-full">
          {daysInStage}d
        </span>
        {status && (
          <span className="bg-accent-light text-accent px-2 py-0.5 rounded-full">
            {status}
          </span>
        )}
        {blockerCount > 0 && (
          <span className="bg-red-light text-red px-2 py-0.5 rounded-full">
            {blockerCount} blocker{blockerCount > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </Link>
  )
}
