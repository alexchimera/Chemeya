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
  const week = `WK ${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  return (
    <header className="w-full bg-bg-panel border-b border-cyan px-4 py-2 flex items-center justify-between" style={{ animation: 'flicker 4s infinite' }}>
      <div className="flex items-center gap-2">
        <Link href="/" className="text-text-structural text-[13px] uppercase tracking-[0.1em] font-semibold hover:text-cyan-bright">
          DMTA OBEYA //
        </Link>
        <span className="text-amber-bright text-[13px] uppercase tracking-[0.1em]">
          {programName || 'AWAITING INITIALIZATION'}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {cycleNumber != null && (
          <span className="text-amber-dim text-[11px] uppercase tracking-[0.1em]">
            CYCLE {String(cycleNumber).padStart(2, '0')} | {week}
          </span>
        )}
        {!cycleNumber && programId && (
          <span className="text-amber-dim text-[11px] uppercase tracking-[0.1em]">
            {week}
          </span>
        )}

        {programs.length > 0 && (
          <div className="relative">
            <select
              defaultValue={programId || ''}
              className="bg-bg-inset border border-cyan-dim text-amber text-[11px] uppercase tracking-[0.05em] px-2 py-1 appearance-none cursor-pointer pr-6"
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
              <option value="new">+ INITIALIZE NEW PROGRAM</option>
            </select>
          </div>
        )}

        <MagiIndicators
          designCount={stageCounts.design}
          makeCount={stageCounts.make}
          testCount={stageCounts.test}
        />

        {programId && (
          <Link
            href={`/settings?program=${programId}`}
            className="text-cyan-dim text-[10px] uppercase tracking-[0.1em] hover:text-cyan"
          >
            CONFIG
          </Link>
        )}
      </div>
    </header>
  )
}
