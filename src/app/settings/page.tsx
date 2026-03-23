import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { NervPanel } from '@/components/nerv/nerv-panel'
import { NervInput } from '@/components/nerv/nerv-input'
import { NervTextarea } from '@/components/nerv/nerv-input'
import { NervButton } from '@/components/nerv/nerv-button'
import { updateProgram } from '@/lib/actions/programs'
import {
  createHypothesis,
  createDecisionMetric,
  createCycleMetric,
} from '@/lib/actions/settings'

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ program?: string }> }) {
  const params = await searchParams
  if (!params.program) notFound()

  const program = await prisma.program.findUnique({ where: { id: params.program } })
  if (!program) notFound()

  const hypotheses = await prisma.designHypothesis.findMany({
    where: { programId: program.id },
    orderBy: { createdAt: 'desc' },
  })

  const decisionMetrics = await prisma.decisionMetric.findMany({
    where: { programId: program.id },
    orderBy: { order: 'asc' },
  })

  const cycleMetrics = await prisma.cycleMetric.findMany({
    where: { programId: program.id },
    orderBy: { cycleNumber: 'desc' },
  })

  const updateProgramAction = updateProgram.bind(null, program.id)

  return (
    <div className="min-h-screen bg-bg-secondary p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Settings</h1>
            <p className="text-sm text-text-secondary">{program.name}</p>
          </div>
          <NervButton href={`/?program=${program.id}`} variant="default">&larr; Back to Board</NervButton>
        </div>

        {/* Program Data */}
        <NervPanel label="Program Data">
          <form action={updateProgramAction} className="space-y-4">
            <NervInput label="Name" name="name" required defaultValue={program.name} />
            <NervInput label="Prefix" name="prefix" required maxLength={6} defaultValue={program.prefix} />
            <NervTextarea label="Description" name="description" defaultValue={program.description || ''} />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="active"
                id="active"
                defaultChecked={program.active}
                className="rounded border-border text-accent focus:ring-accent"
              />
              <label htmlFor="active" className="text-sm text-text-primary">Active</label>
            </div>
            <NervButton type="submit" variant="primary">Save Changes</NervButton>
          </form>
        </NervPanel>

        {/* Design Hypotheses */}
        <NervPanel label="Design Hypotheses">
          <div className="space-y-3">
            {hypotheses.map(h => (
              <div key={h.id} className="rounded-lg bg-bg-secondary p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">{h.label}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs ${h.active ? 'text-green' : 'text-text-tertiary'}`}>
                      {h.active ? 'Active' : 'Inactive'}
                    </span>
                    <form action={async () => { 'use server'; const { deleteHypothesis: del } = await import('@/lib/actions/settings'); await del(h.id) }}>
                      <button type="submit" className="text-xs text-red hover:text-red/80 cursor-pointer">Delete</button>
                    </form>
                  </div>
                </div>
                <div className="text-xs text-text-secondary">{h.content}</div>
              </div>
            ))}

            <details className="pt-1">
              <summary className="text-sm font-medium text-accent cursor-pointer hover:text-accent-hover">
                + Add Hypothesis
              </summary>
              <form action={createHypothesis} className="space-y-3 pt-3">
                <input type="hidden" name="programId" value={program.id} />
                <NervInput label="Label" name="label" required placeholder="e.g. Hinge Binder" />
                <NervTextarea label="Content" name="content" required placeholder="Hypothesis description..." />
                <NervButton type="submit" variant="primary">Add</NervButton>
              </form>
            </details>
          </div>
        </NervPanel>

        {/* Decision Metrics */}
        <NervPanel label="Decision Metrics">
          <div className="space-y-3">
            {decisionMetrics.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-text-secondary">
                    <th className="text-left py-2 pr-3 font-medium">Metric</th>
                    <th className="text-left py-2 pr-3 font-medium">Target</th>
                    <th className="text-left py-2 pr-3 font-medium">Current</th>
                    <th className="text-right py-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {decisionMetrics.map(m => (
                    <tr key={m.id} className="border-t border-border">
                      <td className="text-text-primary py-2 pr-3">{m.label}</td>
                      <td className="text-text-secondary py-2 pr-3">{m.target}</td>
                      <td className="text-text-primary py-2 pr-3 font-medium">{m.current || '—'}</td>
                      <td className="text-right py-2">
                        <form action={async () => { 'use server'; const { deleteDecisionMetric: del } = await import('@/lib/actions/settings'); await del(m.id) }} className="inline">
                          <button type="submit" className="text-xs text-red hover:text-red/80 cursor-pointer">Delete</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <details>
              <summary className="text-sm font-medium text-accent cursor-pointer hover:text-accent-hover">
                + Add Metric
              </summary>
              <form action={createDecisionMetric} className="space-y-3 pt-3">
                <input type="hidden" name="programId" value={program.id} />
                <NervInput label="Label" name="label" required placeholder="e.g. IC50" />
                <NervInput label="Target" name="target" required placeholder="e.g. < 100 nM" />
                <NervInput label="Current" name="current" placeholder="Current value" />
                <NervButton type="submit" variant="primary">Add</NervButton>
              </form>
            </details>
          </div>
        </NervPanel>

        {/* Cycle Metrics */}
        <NervPanel label="Cycle Metrics">
          <div className="space-y-3">
            {cycleMetrics.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-text-secondary">
                    <th className="text-left py-2 font-medium">Cycle</th>
                    <th className="text-left py-2 font-medium">Week</th>
                    <th className="text-left py-2 font-medium">Avg Days</th>
                    <th className="text-left py-2 font-medium">Active</th>
                    <th className="text-left py-2 font-medium">Synth %</th>
                    <th className="text-left py-2 font-medium">Hit %</th>
                  </tr>
                </thead>
                <tbody>
                  {cycleMetrics.map(m => (
                    <tr key={m.id} className="border-t border-border">
                      <td className="text-text-primary py-2">{String(m.cycleNumber).padStart(2, '0')}</td>
                      <td className="text-text-secondary py-2">{m.weekOf.toISOString().slice(0, 10)}</td>
                      <td className="text-text-primary py-2">{m.avgCycleTimeDays.toFixed(1)}</td>
                      <td className="text-text-primary py-2">{m.activeCompounds}</td>
                      <td className="text-text-primary py-2">{m.synthesisSuccessRate.toFixed(0)}%</td>
                      <td className="text-text-primary py-2">{m.potencyHitRate.toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <details>
              <summary className="text-sm font-medium text-accent cursor-pointer hover:text-accent-hover">
                + Log Cycle
              </summary>
              <form action={createCycleMetric} className="space-y-3 pt-3">
                <input type="hidden" name="programId" value={program.id} />
                <div className="grid grid-cols-2 gap-3">
                  <NervInput label="Cycle Number" name="cycleNumber" type="number" required />
                  <NervInput label="Week Of" name="weekOf" type="date" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <NervInput label="Avg Cycle Time (Days)" name="avgCycleTimeDays" type="number" required />
                  <NervInput label="Active Compounds" name="activeCompounds" type="number" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <NervInput label="Synthesis Success %" name="synthesisSuccessRate" type="number" required />
                  <NervInput label="Potency Hit %" name="potencyHitRate" type="number" required />
                </div>
                <NervButton type="submit" variant="primary">Log Cycle</NervButton>
              </form>
            </details>
          </div>
        </NervPanel>
      </div>
    </div>
  )
}
