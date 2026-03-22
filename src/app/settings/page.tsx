import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { NervFrame } from '@/components/nerv/nerv-frame'
import { NervPanel } from '@/components/nerv/nerv-panel'
import { NervInput } from '@/components/nerv/nerv-input'
import { NervTextarea } from '@/components/nerv/nerv-input'
import { NervButton } from '@/components/nerv/nerv-button'
import { updateProgram } from '@/lib/actions/programs'
import {
  createHypothesis,
  updateHypothesis,
  deleteHypothesis,
  createDecisionMetric,
  updateDecisionMetric,
  deleteDecisionMetric,
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
    <div className="min-h-screen bg-bg-void p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-amber text-[14px] uppercase tracking-[0.1em]">
            ▷ CONFIGURATION // {program.name}
          </div>
          <NervButton href={`/?program=${program.id}`} variant="default">← RETURN TO BOARD</NervButton>
        </div>

        {/* Program Data */}
        <NervPanel label="PROGRAM DATA" coord="0xC01">
          <form action={updateProgramAction} className="space-y-3 pt-2">
            <NervInput label="Name" name="name" required defaultValue={program.name} />
            <NervInput label="Prefix" name="prefix" required maxLength={6} defaultValue={program.prefix} />
            <NervTextarea label="Description" name="description" defaultValue={program.description || ''} />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="active"
                id="active"
                defaultChecked={program.active}
                className="accent-lime"
              />
              <label htmlFor="active" className="text-[11px] text-amber uppercase tracking-wider">ACTIVE</label>
            </div>
            <NervButton type="submit" variant="primary">SAVE CHANGES</NervButton>
          </form>
        </NervPanel>

        {/* Design Hypotheses */}
        <NervPanel label="DESIGN HYPOTHESES" coord="0xC02">
          <div className="space-y-2 pt-2">
            {hypotheses.map(h => (
              <div key={h.id} className="border border-cyan/10 p-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-amber text-[11px] uppercase tracking-wider">{h.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] ${h.active ? 'text-green' : 'text-amber-dim'}`}>
                      {h.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                    <form action={async () => { 'use server'; const { deleteHypothesis: del } = await import('@/lib/actions/settings'); await del(h.id) }}>
                      <button type="submit" className="text-red text-[9px] hover:text-red/80 cursor-pointer">DELETE</button>
                    </form>
                  </div>
                </div>
                <div className="text-text-secondary text-[10px]">{h.content}</div>
              </div>
            ))}

            <details className="pt-2">
              <summary className="text-lime text-[10px] uppercase tracking-wider cursor-pointer hover:text-lime/80">
                + ADD HYPOTHESIS
              </summary>
              <form action={createHypothesis} className="space-y-2 pt-2">
                <input type="hidden" name="programId" value={program.id} />
                <NervInput label="Label" name="label" required placeholder="e.g. HINGE BINDER" />
                <NervTextarea label="Content" name="content" required placeholder="Hypothesis description..." />
                <NervButton type="submit" variant="primary">ADD</NervButton>
              </form>
            </details>
          </div>
        </NervPanel>

        {/* Decision Metrics */}
        <NervPanel label="DECISION METRICS" coord="0xC03">
          <div className="space-y-2 pt-2">
            {decisionMetrics.length > 0 && (
              <table className="w-full text-[10px] mb-2">
                <thead>
                  <tr className="text-text-structural uppercase tracking-wider">
                    <th className="text-left py-1 pr-2">METRIC</th>
                    <th className="text-left py-1 pr-2">TARGET</th>
                    <th className="text-left py-1 pr-2">CURRENT</th>
                    <th className="text-right py-1"></th>
                  </tr>
                </thead>
                <tbody>
                  {decisionMetrics.map(m => (
                    <tr key={m.id} className="border-t border-cyan/10">
                      <td className="text-amber py-1 pr-2 uppercase">{m.label}</td>
                      <td className="text-amber-dim py-1 pr-2">{m.target}</td>
                      <td className="text-amber-bright py-1 pr-2">{m.current || '---'}</td>
                      <td className="text-right py-1">
                        <form action={async () => { 'use server'; const { deleteDecisionMetric: del } = await import('@/lib/actions/settings'); await del(m.id) }} className="inline">
                          <button type="submit" className="text-red text-[9px] hover:text-red/80 cursor-pointer">DEL</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <details>
              <summary className="text-lime text-[10px] uppercase tracking-wider cursor-pointer hover:text-lime/80">
                + ADD METRIC
              </summary>
              <form action={createDecisionMetric} className="space-y-2 pt-2">
                <input type="hidden" name="programId" value={program.id} />
                <NervInput label="Label" name="label" required placeholder="e.g. IC50" />
                <NervInput label="Target" name="target" required placeholder="e.g. < 100 nM" />
                <NervInput label="Current" name="current" placeholder="Current value" />
                <NervButton type="submit" variant="primary">ADD</NervButton>
              </form>
            </details>
          </div>
        </NervPanel>

        {/* Cycle Metrics */}
        <NervPanel label="CYCLE METRICS" coord="0xC04">
          <div className="space-y-2 pt-2">
            {cycleMetrics.length > 0 && (
              <table className="w-full text-[10px] mb-2">
                <thead>
                  <tr className="text-text-structural uppercase tracking-wider">
                    <th className="text-left py-1">CYCLE</th>
                    <th className="text-left py-1">WEEK</th>
                    <th className="text-left py-1">AVG DAYS</th>
                    <th className="text-left py-1">ACTIVE</th>
                    <th className="text-left py-1">SYNTH %</th>
                    <th className="text-left py-1">HIT %</th>
                  </tr>
                </thead>
                <tbody>
                  {cycleMetrics.map(m => (
                    <tr key={m.id} className="border-t border-cyan/10">
                      <td className="text-amber py-1">{String(m.cycleNumber).padStart(2, '0')}</td>
                      <td className="text-amber-dim py-1">{m.weekOf.toISOString().slice(0, 10)}</td>
                      <td className="text-amber py-1">{m.avgCycleTimeDays.toFixed(1)}</td>
                      <td className="text-amber py-1">{m.activeCompounds}</td>
                      <td className="text-amber py-1">{m.synthesisSuccessRate.toFixed(0)}%</td>
                      <td className="text-amber py-1">{m.potencyHitRate.toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <details>
              <summary className="text-lime text-[10px] uppercase tracking-wider cursor-pointer hover:text-lime/80">
                + LOG CYCLE
              </summary>
              <form action={createCycleMetric} className="space-y-2 pt-2">
                <input type="hidden" name="programId" value={program.id} />
                <div className="grid grid-cols-2 gap-2">
                  <NervInput label="Cycle Number" name="cycleNumber" type="number" required />
                  <NervInput label="Week Of" name="weekOf" type="date" required />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <NervInput label="Avg Cycle Time (Days)" name="avgCycleTimeDays" type="number" required />
                  <NervInput label="Active Compounds" name="activeCompounds" type="number" required />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <NervInput label="Synthesis Success %" name="synthesisSuccessRate" type="number" required />
                  <NervInput label="Potency Hit %" name="potencyHitRate" type="number" required />
                </div>
                <NervButton type="submit" variant="primary">LOG CYCLE</NervButton>
              </form>
            </details>
          </div>
        </NervPanel>
      </div>
    </div>
  )
}
