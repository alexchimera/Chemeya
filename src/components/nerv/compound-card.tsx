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
  HIGH: 'bg-red/20 text-red',
  MEDIUM: 'bg-yellow/20 text-yellow',
  LOW: 'bg-blue/20 text-blue',
}

export function CompoundCard({ id, compoundId, description, priority, daysInStage, status, blockerCount, programId }: CompoundCardProps) {
  const days = `D${String(daysInStage).padStart(2, '0')}`

  return (
    <Link
      href={`/compounds/${id}/edit`}
      className="block bg-bg-panel border border-cyan/15 p-2 hover:border-cyan/40 hover:shadow-[0_0_8px_rgba(232,145,58,0.25),inset_0_0_4px_rgba(232,145,58,0.05)] transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-text-bright text-[13px] uppercase font-medium tracking-wider">
          {compoundId}
        </span>
        <span className={`text-[9px] uppercase px-1.5 py-0.5 ${priorityStyles[priority]}`} style={{ borderRadius: '2px' }}>
          {priority}
        </span>
      </div>
      <div className="text-text-secondary text-[11px] leading-snug mb-1.5 line-clamp-2">
        {description}
      </div>
      <div className="flex items-center gap-2 text-[9px]">
        <span className="bg-amber/20 text-amber px-1.5 py-0.5" style={{ borderRadius: '2px' }}>
          {days}
        </span>
        {status && (
          <span className="bg-cyan/15 text-cyan px-1.5 py-0.5" style={{ borderRadius: '2px' }}>
            {status}
          </span>
        )}
        {blockerCount > 0 && (
          <span className="bg-red/20 text-red px-1.5 py-0.5" style={{ borderRadius: '2px' }}>
            {blockerCount} BLOCKER{blockerCount > 1 ? 'S' : ''}
          </span>
        )}
      </div>
    </Link>
  )
}
