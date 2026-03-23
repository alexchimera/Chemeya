import { NervInput } from '@/components/nerv/nerv-input'
import { NervTextarea } from '@/components/nerv/nerv-input'
import { NervButton } from '@/components/nerv/nerv-button'
import { createProgram } from '@/lib/actions/programs'

export default function NewProgramPage() {
  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-bg-primary rounded-xl border border-border shadow-sm p-8">
        <h1 className="text-lg font-semibold text-text-primary mb-6">
          Create Program
        </h1>
        <form action={createProgram} className="space-y-4">
          <NervInput label="Program Name" name="name" required placeholder="e.g. Kinase-X" />
          <NervInput label="Prefix" name="prefix" required maxLength={6} placeholder="e.g. KNX" />
          <NervTextarea label="Description" name="description" placeholder="Program objectives..." />
          <div className="flex justify-end gap-3 pt-2">
            <NervButton href="/" variant="default">Cancel</NervButton>
            <NervButton type="submit" variant="primary">Create</NervButton>
          </div>
        </form>
      </div>
    </div>
  )
}
