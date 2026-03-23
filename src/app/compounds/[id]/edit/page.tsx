import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { NervInput } from '@/components/nerv/nerv-input'
import { NervTextarea } from '@/components/nerv/nerv-input'
import { NervSelect } from '@/components/nerv/nerv-select'
import { NervButton } from '@/components/nerv/nerv-button'
import { updateCompound, deleteCompound } from '@/lib/actions/compounds'

export default async function EditCompoundPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const compound = await prisma.compound.findUnique({
    where: { id },
    include: { program: true },
  })

  if (!compound) notFound()

  const updateAction = updateCompound.bind(null, compound.id)
  const deleteAction = deleteCompound.bind(null, compound.id, compound.programId)

  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-bg-primary rounded-xl border border-border shadow-sm p-8">
        <h1 className="text-lg font-semibold text-text-primary mb-6">
          Edit {compound.compoundId}
        </h1>
        <form action={updateAction} className="space-y-4">
          <input type="hidden" name="programId" value={compound.programId} />
          <NervInput label="Compound ID" name="compoundId" required defaultValue={compound.compoundId} />
          <NervInput label="Scaffold" name="scaffold" required defaultValue={compound.scaffold} />
          <NervInput label="Target" name="target" required defaultValue={compound.target} />
          <NervTextarea label="Description" name="description" required defaultValue={compound.description} />
          <div className="grid grid-cols-2 gap-3">
            <NervSelect
              label="Stage"
              name="stage"
              defaultValue={compound.stage}
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
              defaultValue={compound.priority}
              options={[
                { value: 'HIGH', label: 'High' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'LOW', label: 'Low' },
              ]}
            />
          </div>
          <NervInput label="Status" name="status" defaultValue={compound.status || ''} placeholder="Optional status note" />
          <div className="flex justify-between pt-2">
            <form action={deleteAction}>
              <NervButton type="submit" variant="danger">Delete</NervButton>
            </form>
            <div className="flex gap-3">
              <NervButton href={`/?program=${compound.programId}`} variant="default">Cancel</NervButton>
              <NervButton type="submit" variant="primary">Save</NervButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
