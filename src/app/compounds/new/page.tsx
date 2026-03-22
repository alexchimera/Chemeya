import { prisma } from '@/lib/prisma'
import { NervFrame } from '@/components/nerv/nerv-frame'
import { NervInput } from '@/components/nerv/nerv-input'
import { NervTextarea } from '@/components/nerv/nerv-input'
import { NervSelect } from '@/components/nerv/nerv-select'
import { NervButton } from '@/components/nerv/nerv-button'
import { createCompound, getNextCompoundId } from '@/lib/actions/compounds'

export default async function NewCompoundPage({ searchParams }: { searchParams: Promise<{ program?: string; stage?: string }> }) {
  const params = await searchParams
  const programId = params.program || ''
  const stage = params.stage || 'DESIGN'

  const suggestedId = programId ? await getNextCompoundId(programId) : ''

  return (
    <div className="min-h-screen bg-bg-void flex items-center justify-center p-4">
      <NervFrame className="w-full max-w-lg p-6">
        <NervFrame className="p-6">
          <div className="text-amber text-[14px] uppercase tracking-[0.1em] mb-6">
            ▷ COMPOUND REGISTRATION
          </div>
          <form action={createCompound} className="space-y-4">
            <input type="hidden" name="programId" value={programId} />
            <NervInput label="Compound ID" name="compoundId" required defaultValue={suggestedId} placeholder="e.g. KNX-001" />
            <NervInput label="Scaffold" name="scaffold" required placeholder="Core scaffold" />
            <NervInput label="Target" name="target" required placeholder="Biological target" />
            <NervTextarea label="Description" name="description" required placeholder="SAR hypothesis, modifications..." />
            <div className="grid grid-cols-2 gap-3">
              <NervSelect
                label="Stage"
                name="stage"
                defaultValue={stage}
                options={[
                  { value: 'DESIGN', label: 'DESIGN' },
                  { value: 'MAKE', label: 'MAKE' },
                  { value: 'TEST', label: 'TEST' },
                  { value: 'ANALYZE', label: 'ANALYZE' },
                ]}
              />
              <NervSelect
                label="Priority"
                name="priority"
                defaultValue="MEDIUM"
                options={[
                  { value: 'HIGH', label: 'HIGH' },
                  { value: 'MEDIUM', label: 'MEDIUM' },
                  { value: 'LOW', label: 'LOW' },
                ]}
              />
            </div>
            <NervInput label="Status" name="status" placeholder="Optional status note" />
            <div className="flex justify-end gap-3 pt-2">
              <NervButton href={`/?program=${programId}`} variant="default">ABORT</NervButton>
              <NervButton type="submit" variant="primary">REGISTER</NervButton>
            </div>
          </form>
        </NervFrame>
      </NervFrame>
    </div>
  )
}
