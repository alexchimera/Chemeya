import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { NervFrame } from '@/components/nerv/nerv-frame'
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
    <div className="min-h-screen bg-bg-void flex items-center justify-center p-4">
      <NervFrame className="w-full max-w-lg p-6">
        <NervFrame className="p-6">
          <div className="text-amber text-[14px] uppercase tracking-[0.1em] mb-6">
            ▷ MODIFY IMPEDIMENT
          </div>
          <form action={updateAction} className="space-y-4">
            <input type="hidden" name="programId" value={blocker.programId} />
            <NervInput label="Title" name="title" required defaultValue={blocker.title} />
            <NervTextarea label="Description" name="description" required defaultValue={blocker.description} />
            <NervSelect
              label="Severity"
              name="severity"
              defaultValue={blocker.severity}
              options={[
                { value: 'RED', label: 'RED' },
                { value: 'AMBER', label: 'AMBER' },
                { value: 'GREEN', label: 'GREEN' },
              ]}
            />
            <NervSelect
              label="Linked Compound"
              name="compoundId"
              defaultValue={blocker.compoundId || ''}
              options={[
                { value: '', label: '— NONE —' },
                ...compounds.map(c => ({ value: c.id, label: c.compoundId })),
              ]}
            />
            <div className="flex justify-end gap-3 pt-2">
              <NervButton href={`/?program=${blocker.programId}`} variant="default">ABORT</NervButton>
              <NervButton type="submit" variant="primary">UPDATE</NervButton>
            </div>
          </form>
        </NervFrame>
      </NervFrame>
    </div>
  )
}
