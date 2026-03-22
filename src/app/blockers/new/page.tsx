import { prisma } from '@/lib/prisma'
import { NervFrame } from '@/components/nerv/nerv-frame'
import { NervInput } from '@/components/nerv/nerv-input'
import { NervTextarea } from '@/components/nerv/nerv-input'
import { NervSelect } from '@/components/nerv/nerv-select'
import { NervButton } from '@/components/nerv/nerv-button'
import { createBlocker } from '@/lib/actions/blockers'

export default async function NewBlockerPage({ searchParams }: { searchParams: Promise<{ program?: string }> }) {
  const params = await searchParams
  const programId = params.program || ''

  const compounds = await prisma.compound.findMany({
    where: { programId },
    orderBy: { compoundId: 'asc' },
  })

  return (
    <div className="min-h-screen bg-bg-void flex items-center justify-center p-4">
      <NervFrame className="w-full max-w-lg p-6">
        <NervFrame className="p-6">
          <div className="text-amber text-[14px] uppercase tracking-[0.1em] mb-6">
            ▷ LOG IMPEDIMENT
          </div>
          <form action={createBlocker} className="space-y-4">
            <input type="hidden" name="programId" value={programId} />
            <NervInput label="Title" name="title" required placeholder="Impediment title" />
            <NervTextarea label="Description" name="description" required placeholder="Details..." />
            <NervSelect
              label="Severity"
              name="severity"
              defaultValue="AMBER"
              options={[
                { value: 'RED', label: 'RED' },
                { value: 'AMBER', label: 'AMBER' },
                { value: 'GREEN', label: 'GREEN' },
              ]}
            />
            <NervSelect
              label="Linked Compound (Optional)"
              name="compoundId"
              options={[
                { value: '', label: '— NONE —' },
                ...compounds.map(c => ({ value: c.id, label: c.compoundId })),
              ]}
            />
            <div className="flex justify-end gap-3 pt-2">
              <NervButton href={`/?program=${programId}`} variant="default">ABORT</NervButton>
              <NervButton type="submit" variant="primary">LOG</NervButton>
            </div>
          </form>
        </NervFrame>
      </NervFrame>
    </div>
  )
}
