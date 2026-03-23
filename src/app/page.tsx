import { prisma } from '@/lib/prisma'
import { Header } from '@/components/header'
import { NervFrame } from '@/components/nerv/nerv-frame'
import { NervPanel } from '@/components/nerv/nerv-panel'
import { NervButton } from '@/components/nerv/nerv-button'
import { MetricCard } from '@/components/nerv/metric-card'
import { KanbanBoard } from '@/components/kanban-board'
import Link from 'next/link'

const STAGES = ['DESIGN', 'MAKE', 'TEST', 'ANALYZE'] as const

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ program?: string }> }) {
  const params = await searchParams
  const programs = await prisma.program.findMany({ where: { active: true }, orderBy: { createdAt: 'asc' } })

  if (programs.length === 0) {
    return (
      <div className="min-h-screen bg-bg-secondary flex flex-col">
        <Header programName={null} programId={null} programs={[]} stageCounts={{ design: 0, make: 0, test: 0 }} cycleNumber={null} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Welcome to DMTA Obeya</h2>
            <p className="text-sm text-text-secondary">
              Get started by creating your first program.
            </p>
            <NervButton href="/programs/new" variant="primary">
              Create Program
            </NervButton>
          </div>
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
    <div className="min-h-screen bg-bg-secondary flex flex-col">
      <Header
        programName={currentProgram.name}
        programId={currentProgram.id}
        programs={programs.map(p => ({ id: p.id, name: p.name }))}
        stageCounts={stageCounts}
        cycleNumber={latestCycle?.cycleNumber ?? null}
      />

      <main className="flex-1 p-4 space-y-4 max-w-[1400px] mx-auto w-full">
        {/* Metric Cards */}
        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            label="Avg Cycle Time"
            value={latestCycle ? `${latestCycle.avgCycleTimeDays.toFixed(1)}d` : null}
            subtitle="Days per cycle"
          />
          <MetricCard
            label="Active Compounds"
            value={compounds.length || null}
            subtitle="In pipeline"
          />
          <MetricCard
            label="Synth Success"
            value={latestCycle ? `${latestCycle.synthesisSuccessRate.toFixed(0)}%` : null}
            subtitle="Synthesis rate"
          />
          <MetricCard
            label="Potency Hits"
            value={latestCycle ? `${latestCycle.potencyHitRate.toFixed(0)}%` : null}
            subtitle="Hit rate"
          />
        </div>

        {/* Kanban Board */}
        <KanbanBoard programId={currentProgram.id} compoundsByStage={compoundsByStage} />

        {/* Bottom Panels */}
        <div className="grid grid-cols-2 gap-4">
          {/* Blockers Panel */}
          <NervPanel label="Blockers & Actions">
            <div className="space-y-2">
              {blockers.length === 0 ? (
                <div className="text-text-tertiary text-sm text-center py-6">
                  No active blockers
                </div>
              ) : (
                blockers.map(b => (
                  <div key={b.id} className="flex items-start gap-3 p-3 rounded-lg bg-bg-secondary">
                    <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                      b.severity === 'RED' ? 'bg-red' : b.severity === 'AMBER' ? 'bg-yellow' : 'bg-green'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-primary">{b.title}</div>
                      <div className="text-xs text-text-secondary mt-0.5">{b.description}</div>
                      {b.compound && (
                        <div className="text-xs text-accent mt-0.5">{b.compound.compoundId}</div>
                      )}
                    </div>
                    <form action={async () => { 'use server'; const { resolveBlocker } = await import('@/lib/actions/blockers'); await resolveBlocker(b.id) }}>
                      <button type="submit" className="text-xs font-medium text-accent hover:text-accent-hover px-2.5 py-1 rounded-md border border-border cursor-pointer transition-colors">
                        Resolve
                      </button>
                    </form>
                  </div>
                ))
              )}
              <div className="pt-1">
                <NervButton href={`/blockers/new?program=${currentProgram.id}`} variant="default">
                  + Log Blocker
                </NervButton>
              </div>
            </div>
          </NervPanel>

          {/* Design Hypotheses & Decision Metrics Panel */}
          <NervPanel label="Hypotheses & Metrics">
            <div className="space-y-4">
              {/* Hypotheses */}
              <div>
                <div className="text-xs font-medium text-text-secondary mb-2">Hypotheses</div>
                {hypotheses.length === 0 ? (
                  <div className="text-text-tertiary text-xs py-2">No data yet</div>
                ) : (
                  <div className="space-y-2">
                    {hypotheses.map(h => (
                      <div key={h.id} className="rounded-lg bg-bg-secondary p-2.5">
                        <div className="text-sm font-medium text-text-primary">{h.label}</div>
                        <div className="text-xs text-text-secondary mt-0.5">{h.content}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Decision Metrics */}
              <div>
                <div className="text-xs font-medium text-text-secondary mb-2">Decision Metrics</div>
                {decisionMetrics.length === 0 ? (
                  <div className="text-text-tertiary text-xs py-2">No data yet</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-text-secondary">
                        <th className="text-left py-1.5 pr-3 font-medium">Metric</th>
                        <th className="text-left py-1.5 pr-3 font-medium">Target</th>
                        <th className="text-left py-1.5 font-medium">Current</th>
                      </tr>
                    </thead>
                    <tbody>
                      {decisionMetrics.map(m => (
                        <tr key={m.id} className="border-t border-border">
                          <td className="text-text-primary py-1.5 pr-3">{m.label}</td>
                          <td className="text-text-secondary py-1.5 pr-3">{m.target}</td>
                          <td className="text-text-primary py-1.5 font-medium">{m.current || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <NervButton href={`/settings?program=${currentProgram.id}`} variant="default">
                Manage in Settings
              </NervButton>
            </div>
          </NervPanel>
        </div>
      </main>
    </div>
  )
}
