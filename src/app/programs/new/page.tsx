import { NervFrame } from '@/components/nerv/nerv-frame'
import { NervInput } from '@/components/nerv/nerv-input'
import { NervTextarea } from '@/components/nerv/nerv-input'
import { NervButton } from '@/components/nerv/nerv-button'
import { createProgram } from '@/lib/actions/programs'

export default function NewProgramPage() {
  return (
    <div className="min-h-screen bg-bg-void flex items-center justify-center p-4">
      <NervFrame className="w-full max-w-lg p-6">
        <NervFrame className="p-6">
          <div className="text-amber text-[14px] uppercase tracking-[0.1em] mb-6">
            ▷ PROGRAM INITIALIZATION
          </div>
          <form action={createProgram} className="space-y-4">
            <NervInput label="Program Name" name="name" required placeholder="e.g. KINASE-X" />
            <NervInput label="Prefix" name="prefix" required maxLength={6} placeholder="e.g. KNX" className="uppercase" />
            <NervTextarea label="Description" name="description" placeholder="Program objectives..." />
            <div className="flex justify-end gap-3 pt-2">
              <NervButton href="/" variant="default">ABORT</NervButton>
              <NervButton type="submit" variant="primary">INITIALIZE</NervButton>
            </div>
          </form>
        </NervFrame>
      </NervFrame>
    </div>
  )
}
