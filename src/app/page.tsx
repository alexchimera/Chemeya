import { prisma } from '@/lib/prisma'
import { Header } from '@/components/header'
import { NervFrame } from '@/components/nerv/nerv-frame'
import { NervPanel } from '@/components/nerv/nerv-panel'
import { NervButton } from '@/components/nerv/nerv-button'
import { MetricCard } from '@/components/nerv/metric-card'
import { CompoundCard } from '@/components/nerv/compound-card'
import { KanbanBoard } from '@/components/kanban-board'
import Link from 'next/link'

const STAGES = ['DESIGN', 'MAKE', 'TEST', 'ANALYZE'] as const

const stageStyles = {
  DESIGN: { headerBg: 'rgba(232, 145, 58, 0.1)', headerText: 'text-amber', border: 'rgba(232, 145, 58, 0.3)' },
  MAKE: { headerBg: 'rgba(0, 212, 170, 0.1)', headerText: 'text-cyan', border: 'rgba(0, 212, 170, 0.3)' },
  TEST: { headerBg: 'rgba(42, 123, 212, 0.1)', headerText: 'text-blue', border: 'rgba(42, 123, 212, 0.3)' },
  ANALYZE: { headerBg: 'rgba(212, 42, 42, 0.1)', headerText: 'text-red', border: 'rgba(212, 42, 42, 0.3)' },
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ program?: string }> }) {
  const params = await searchParams
  const programs = await prisma.program.findMany({ where: { active: true }, orderBy: { createdAt: 'asc' } })

  if (programs.length === 0) {
    return (
      <div className="min-h-screen bg-bg-void flex flex-col">
        <Header programName={null} programId={null} programs={[]} stageCounts={{ design: 0, make: 0, test: 0 }} cycleNumber={null} />
        <div className="flex-1 flex items-center justify-center">
          <NervFrame className="p-8">
            <div className="text-center space-y-4" style={{ animation: 'pulse-dim 3s ease-in-out infinite' }}>
              <div className="text-amber-dim text-[14px] uppercase tracking-[0.1em]">▷ DMTA OBEYA</div>
              <div className="text-amber-dim text-[12px] uppercase tracking-[0.1em]">
                SYSTEM STANDBY // AWAITING INITIALIZATION
              </div>
              <NervButton href="/programs/new" variant="primary">
                INITIALIZE FIRST PROGRAM
              </NervButton>
            </div>
          </NervFrame>
        </div>
      </div>
    )
  }

  const currentProgram = params.program
    ? programs.find(p => p.id === params.program) || programs[0]
    : programs[0]

  const compounds = await prisma.compound.findMany({
    where: { programId: currentProgram.id },
    include: { blockers: { where: { resolved: false } } },
    orderBy: { createdAt: 'asc' },
  })

  const blockers = await prisma.blocker.findMany({
    where: { programId: currentProgram.id, resolved: false },
    include: { compound: true },
    orderBy: { createdAt: 'desc' },
  })

  const hypotheses = await prisma.designHypothesis.findMany({
    where: { programId: currentProgram.id, active: true },
    orderBy: { createdAt: 'desc' },
  })

  const decisionMetrics = await prisma.decisionMetric.findMany({
    where: { programId: currentProgram.id },
    orderBy: { order: 'asc' },
  })

  const latestCycle = await prisma.cycleMetric.findFirst({
    where: { programId: currentProgram.id },
    orderBy: { cycleNumber: 'desc' },
  })

  // Update daysInStage for display
  const now = new Date()
  const compoundsWithDays = compounds.map(c => ({
    ...c,
    daysInStage: Math.floor((now.getTime() - c.stageEnteredAt.getTime()) / (1000 * 60 * 60 * 24)),
  }))

  const stageCounts = {
    design: compoundsWithDays.filter(c => c.stage === 'DESIGN').length,
    make: compoundsWithDays.filter(c => c.stage === 'MAKE').length,
    test: compoundsWithDays.filter(c => c.stage === 'TEST').length,
  }

  const compoundsByStage = {
    DESIGN: compoundsWithDays.filter(c => c.stage === 'DESIGN'),
    MAKE: compoundsWithDays.filter(c => c.stage === 'MAKE'),
    TEST: compoundsWithDays.filter(c => c.stage === 'TEST'),
    ANALYZE: compoundsWithDays.filter(c => c.stage === 'ANALYZE'),
  }

  return (
    <div className="min-h-screen bg-bg-void flex flex-col">
      <Header
        programName={currentProgram.name}
        programId={currentProgram.id}
        programs={programs.map(p => ({ id: p.id, name: p.name }))}
        stageCounts={stageCounts}
        cycleNumber={latestCycle?.cycleNumber ?? null}
      />

      <main className="flex-1 p-3 space-y-3">
        {/* Metric Cards */}
        <NervFrame>
          <div className="grid grid-cols-4 gap-2">
            <MetricCard
              label="AVG CYCLE TIME"
              value={latestCycle ? `${latestCycle.avgCycleTimeDays.toFixed(1)}D` : null}
              subtitle="DAYS PER CYCLE"
              coord="0x7A1"
            />
            <MetricCard
              label="ACTIVE COMPOUNDS"
              value={compounds.length || null}
              subtitle="IN PIPELINE"
              coord="0x7A2"
            />
            <MetricCard
              label="SYNTH SUCCESS"
              value={latestCycle ? `${latestCycle.synthesisSuccessRate.toFixed(0)}%` : null}
              subtitle="SYNTHESIS RATE"
              coord="0x7A3"
            />
            <MetricCard
              label="POTENCY HITS"
              value={latestCycle ? `${latestCycle.potencyHitRate.toFixed(0)}%` : null}
              subtitle="HIT RATE"
              coord="0x7A4"
            />
          </div>
        </NervFrame>

        {/* Kanban Board */}
        <KanbanBoard programId={currentProgram.id} compoundsByStage={compoundsByStage} />

        {/* Bottom Panels */}
        <div className="grid grid-cols-2 gap-3">
          {/* Blockers Panel */}
          <NervPanel label="BLOCKERS & ACTIONS" coord="0xB01">
            <div className="pt-2 space-y-2">
              {blockers.length === 0 ? (
                <div className="text-amber-dim text-[11px] uppercase tracking-[0.1em] text-center py-4">
                  NO ACTIVE BLOCKERS
                </div>
              ) : (
                blockers.map(b => (
                  <div key={b.id} className="flex items-start gap-2 p-2 border border-cyan/10">
                    <span className={`mt-0.5 text-[10px] ${
                      b.severity === 'RED' ? 'text-red' : b.severity === 'AMBER' ? 'text-yellow' : 'text-green'
                    }`}>●</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-amber text-[11px] uppercase tracking-wider">{b.title}</div>
                      <div className="text-text-secondary text-[10px] mt-0.5">{b.description}</div>
                      {b.compound && (
                        <div className="text-cyan-dim text-[9px] mt-0.5">→ {b.compound.compoundId}</div>
                      )}
                    </div>
                    <form action={async () => { 'use server'; const { resolveBlocker } = await import('@/lib/actions/blockers'); await resolveBlocker(b.id) }}>
                      <button type="submit" className="text-[9px] text-cyan uppercase tracking-wider hover:text-cyan-bright px-1.5 py-0.5 border border-cyan/30 cursor-pointer">
                        RESOLVE
                      </button>
                    </form>
                  </div>
                ))
              )}
              <div className="pt-1">
                <NervButton href={`/blockers/new?program=${currentProgram.id}`} variant="default">
                  + LOG BLOCKER
                </NervButton>
              </div>
            </div>
          </NervPanel>

          {/* Design Hypotheses & Decision Metrics Panel */}
          <NervPanel label="DESIGN HYPOTHESES & METRICS" coord="0xB02">
            <div className="pt-2 space-y-3">
              {/* Hypotheses */}
              <div>
                <div className="text-text-structural text-[10px] uppercase tracking-[0.1em] mb-1.5">HYPOTHESES</div>
                {hypotheses.length === 0 ? (
                  <div className="text-amber-dim text-[10px] uppercase tracking-[0.1em] py-2">AWAITING DATA</div>
                ) : (
                  <div className="space-y-1.5">
                    {hypotheses.map(h => (
                      <div key={h.id} className="border border-cyan/10 p-1.5">
                        <div className="text-amber text-[10px] uppercase tracking-wider">{h.label}</div>
                        <div className="text-text-secondary text-[10px] mt-0.5">{h.content}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Decision Metrics */}
              <div>
                <div className="text-text-structural text-[10px] uppercase tracking-[0.1em] mb-1.5">DECISION METRICS</div>
                {decisionMetrics.length === 0 ? (
                  <div className="text-amber-dim text-[10px] uppercase tracking-[0.1em] py-2">AWAITING DATA</div>
                ) : (
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="text-text-structural uppercase tracking-wider">
                        <th className="text-left py-0.5 pr-2">METRIC</th>
                        <th className="text-left py-0.5 pr-2">TARGET</th>
                        <th className="text-left py-0.5">CURRENT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {decisionMetrics.map(m => (
                        <tr key={m.id} className="border-t border-cyan/10">
                          <td className="text-amber py-0.5 pr-2 uppercase">{m.label}</td>
                          <td className="text-amber-dim py-0.5 pr-2">{m.target}</td>
                          <td className="text-amber-bright py-0.5">{m.current || '---'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <NervButton href={`/settings?program=${currentProgram.id}`} variant="default">
                MANAGE IN CONFIG
              </NervButton>
            </div>
          </NervPanel>
        </div>
      </main>
    </div>
  )
}
