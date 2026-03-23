'use client'

import Link from 'next/link'
import { MagiIndicators } from './nerv/magi-indicators'

type HeaderProps = {
  programName: string | null
  programId: string | null
  programs: { id: string; name: string }[]
  stageCounts: { design: number; make: number; test: number }
  cycleNumber: number | null
}

export function Header({ programName, programId, programs, stageCounts, cycleNumber }: HeaderProps) {
  const now = new Date()
  const week = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  return (
    <header className="w-full bg-bg-primary border-b border-border px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-sm font-semibold text-text-primary hover:text-accent transition-colors">
          DMTA Obeya
        </Link>
        {programName && (
          <>
            <span className="text-text-tertiary">/</span>
            <span className="text-sm text-text-secondary">
              {programName}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {cycleNumber != null && (
          <span className="text-xs text-text-tertiary">
            Cycle {String(cycleNumber).padStart(2, '0')} &middot; {week}
          </span>
        )}
        {!cycleNumber && programId && (
          <span className="text-xs text-text-tertiary">
            {week}
          </span>
        )}

        {programs.length > 0 && (
          <select
            defaultValue={programId || ''}
            className="bg-bg-primary border border-border text-sm text-text-primary px-2.5 py-1.5 rounded-lg cursor-pointer"
            onChange={(e) => {
              if (e.target.value === 'new') {
                window.location.href = '/programs/new'
              } else {
                window.location.href = `/?program=${e.target.value}`
              }
            }}
          >
            {programs.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
            <option value="new">+ New Program</option>
          </select>
        )}

        <MagiIndicators
          designCount={stageCounts.design}
          makeCount={stageCounts.make}
          testCount={stageCounts.test}
        />

        {programId && (
          <Link
            href={`/settings?program=${programId}`}
            className="text-xs font-medium text-text-secondary hover:text-accent transition-colors"
          >
            Settings
          </Link>
        )}
      </div>
    </header>
  )
}
