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
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-bg-primary rounded-xl border border-border shadow-sm p-8">
        <h1 className="text-lg font-semibold text-text-primary mb-6">
          Register Compound
        </h1>
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
                { value: 'DESIGN', label: 'Design' },
                { value: 'MAKE', label: 'Make' },
                { value: 'TEST', label: 'Test' },
                { value: 'ANALYZE', label: 'Analyze' },
              ]}
            />
            <NervSelect
              label="Priority"
              name="priority"
              defaultValue="MEDIUM"
              options={[
                { value: 'HIGH', label: 'High' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'LOW', label: 'Low' },
              ]}
            />
          </div>
          <NervInput label="Status" name="status" placeholder="Optional status note" />
          <div className="flex justify-end gap-3 pt-2">
            <NervButton href={`/?program=${programId}`} variant="default">Cancel</NervButton>
            <NervButton type="submit" variant="primary">Register</NervButton>
          </div>
        </form>
      </div>
    </div>
  )
}
