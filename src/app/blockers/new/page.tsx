import { prisma } from '@/lib/prisma'
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
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-bg-primary rounded-xl border border-border shadow-sm p-8">
        <h1 className="text-lg font-semibold text-text-primary mb-6">
          Log Blocker
        </h1>
        <form action={createBlocker} className="space-y-4">
          <input type="hidden" name="programId" value={programId} />
          <NervInput label="Title" name="title" required placeholder="Blocker title" />
          <NervTextarea label="Description" name="description" required placeholder="Details..." />
          <NervSelect
            label="Severity"
            name="severity"
            defaultValue="AMBER"
            options={[
              { value: 'RED', label: 'Critical' },
              { value: 'AMBER', label: 'Warning' },
              { value: 'GREEN', label: 'Low' },
            ]}
          />
          <NervSelect
            label="Linked Compound (Optional)"
            name="compoundId"
            options={[
              { value: '', label: 'None' },
              ...compounds.map(c => ({ value: c.id, label: c.compoundId })),
            ]}
          />
          <div className="flex justify-end gap-3 pt-2">
            <NervButton href={`/?program=${programId}`} variant="default">Cancel</NervButton>
            <NervButton type="submit" variant="primary">Log</NervButton>
          </div>
        </form>
      </div>
    </div>
  )
}
