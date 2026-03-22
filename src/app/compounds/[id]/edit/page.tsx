import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { NervFrame } from '@/components/nerv/nerv-frame'
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
    <div className="min-h-screen bg-bg-void flex items-center justify-center p-4">
      <NervFrame className="w-full max-w-lg p-6">
        <NervFrame className="p-6">
          <div className="text-amber text-[14px] uppercase tracking-[0.1em] mb-6">
            ▷ COMPOUND {compound.compoundId} // MODIFY
          </div>
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
                  { value: 'DESIGN', label: 'DESIGN' },
                  { value: 'MAKE', label: 'MAKE' },
                  { value: 'TEST', label: 'TEST' },
                  { value: 'ANALYZE', label: 'ANALYZE' },
                ]}
              />
              <NervSelect
                label="Priority"
                name="priority"
                defaultValue={compound.priority}
                options={[
                  { value: 'HIGH', label: 'HIGH' },
                  { value: 'MEDIUM', label: 'MEDIUM' },
                  { value: 'LOW', label: 'LOW' },
                ]}
              />
            </div>
            <NervInput label="Status" name="status" defaultValue={compound.status || ''} placeholder="Optional status note" />
            <div className="flex justify-between pt-2">
              <form action={deleteAction}>
                <NervButton type="submit" variant="danger">DECOMMISSION</NervButton>
              </form>
              <div className="flex gap-3">
                <NervButton href={`/?program=${compound.programId}`} variant="default">ABORT</NervButton>
                <NervButton type="submit" variant="primary">UPDATE</NervButton>
              </div>
            </div>
          </form>
        </NervFrame>
      </NervFrame>
    </div>
  )
}
