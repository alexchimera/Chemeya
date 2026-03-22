'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod/v4'
import { Stage, Priority } from '@prisma/client'

const CompoundSchema = z.object({
  compoundId: z.string().min(1, 'Compound ID is required'),
  programId: z.string().min(1),
  scaffold: z.string().min(1, 'Scaffold is required'),
  target: z.string().min(1, 'Target is required'),
  description: z.string().min(1, 'Description is required'),
  stage: z.enum(['DESIGN', 'MAKE', 'TEST', 'ANALYZE']),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  status: z.string().optional(),
})

export async function createCompound(formData: FormData) {
  const parsed = CompoundSchema.safeParse({
    compoundId: (formData.get('compoundId') as string)?.toUpperCase(),
    programId: formData.get('programId'),
    scaffold: formData.get('scaffold'),
    target: formData.get('target'),
    description: formData.get('description'),
    stage: formData.get('stage'),
    priority: formData.get('priority'),
    status: formData.get('status') || undefined,
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  await prisma.compound.create({
    data: {
      ...parsed.data,
      stage: parsed.data.stage as Stage,
      priority: parsed.data.priority as Priority,
    },
  })

  redirect(`/?program=${parsed.data.programId}`)
}

export async function updateCompound(id: string, formData: FormData) {
  const parsed = CompoundSchema.safeParse({
    compoundId: (formData.get('compoundId') as string)?.toUpperCase(),
    programId: formData.get('programId'),
    scaffold: formData.get('scaffold'),
    target: formData.get('target'),
    description: formData.get('description'),
    stage: formData.get('stage'),
    priority: formData.get('priority'),
    status: formData.get('status') || undefined,
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  await prisma.compound.update({
    where: { id },
    data: {
      ...parsed.data,
      stage: parsed.data.stage as Stage,
      priority: parsed.data.priority as Priority,
    },
  })

  redirect(`/?program=${parsed.data.programId}`)
}

export async function deleteCompound(id: string, programId: string) {
  await prisma.compound.delete({ where: { id } })
  redirect(`/?program=${programId}`)
}

export async function moveCompound(id: string, stage: Stage) {
  await prisma.compound.update({
    where: { id },
    data: {
      stage,
      stageEnteredAt: new Date(),
      daysInStage: 0,
    },
  })
  revalidatePath('/')
}

export async function getCompoundsByProgram(programId: string) {
  return prisma.compound.findMany({
    where: { programId },
    include: { blockers: { where: { resolved: false } } },
    orderBy: { createdAt: 'asc' },
  })
}

export async function getCompound(id: string) {
  return prisma.compound.findUnique({
    where: { id },
    include: { blockers: true, program: true },
  })
}

export async function getNextCompoundId(programId: string) {
  const program = await prisma.program.findUnique({ where: { id: programId } })
  if (!program) return ''

  const count = await prisma.compound.count({ where: { programId } })
  const seq = String(count + 1).padStart(3, '0')
  return `${program.prefix}-${seq}`
}
