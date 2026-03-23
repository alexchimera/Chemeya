import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { NervInput } from '@/components/nerv/nerv-input'
import { NervTextarea } from '@/components/nerv/nerv-input'
import { NervSelect } from '@/components/nerv/nerv-select'
import { NervButton } from '@/components/nerv/nerv-button'
import { updateBlocker } from '@/lib/actions/blockers'

export default async function EditBlockerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const blocker = await prisma.blocker.findUnique({
    where: { id },
    include: { program: true },
  })

  if (!blocker) notFound()

  const compounds = await prisma.compound.findMany({
    where: { programId: blocker.programId },
    orderBy: { compoundId: 'asc' },
  })

  const updateAction = updateBlocker.bind(null, blocker.id)

  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-bg-primary rounded-xl border border-border shadow-sm p-8">
        <h1 className="text-lg font-semibold text-text-primary mb-6">
          Edit Blocker
        </h1>
        <form action={updateAction} className="space-y-4">
          <input type="hidden" name="programId" value={blocker.programId} />
          <NervInput label="Title" name="title" required defaultValue={blocker.title} />
          <NervTextarea label="Description" name="description" required defaultValue={blocker.description} />
          <NervSelect
            label="Severity"
            name="severity"
            defaultValue={blocker.severity}
            options={[
              { value: 'RED', label: 'Critical' },
              { value: 'AMBER', label: 'Warning' },
              { value: 'GREEN', label: 'Low' },
            ]}
          />
          <NervSelect
            label="Linked Compound"
            name="compoundId"
            defaultValue={blocker.compoundId || ''}
            options={[
              { value: '', label: 'None' },
              ...compounds.map(c => ({ value: c.id, label: c.compoundId })),
            ]}
          />
          <div className="flex justify-end gap-3 pt-2">
            <NervButton href={`/?program=${blocker.programId}`} variant="default">Cancel</NervButton>
            <NervButton type="submit" variant="primary">Save</NervButton>
          </div>
        </form>
      </div>
    </div>
  )
}
