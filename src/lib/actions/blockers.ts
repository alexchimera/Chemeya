'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod/v4'
import { Severity } from '@prisma/client'

const BlockerSchema = z.object({
  programId: z.string().min(1),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  severity: z.enum(['RED', 'AMBER', 'GREEN']),
  compoundId: z.string().optional(),
})

export async function createBlocker(formData: FormData) {
  const parsed = BlockerSchema.safeParse({
    programId: formData.get('programId'),
    title: formData.get('title'),
    description: formData.get('description'),
    severity: formData.get('severity'),
    compoundId: formData.get('compoundId') || undefined,
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  await prisma.blocker.create({
    data: {
      ...parsed.data,
      severity: parsed.data.severity as Severity,
      compoundId: parsed.data.compoundId || null,
    },
  })

  redirect(`/?program=${parsed.data.programId}`)
}

export async function updateBlocker(id: string, formData: FormData) {
  const parsed = BlockerSchema.safeParse({
    programId: formData.get('programId'),
    title: formData.get('title'),
    description: formData.get('description'),
    severity: formData.get('severity'),
    compoundId: formData.get('compoundId') || undefined,
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  await prisma.blocker.update({
    where: { id },
    data: {
      ...parsed.data,
      severity: parsed.data.severity as Severity,
      compoundId: parsed.data.compoundId || null,
    },
  })

  redirect(`/?program=${parsed.data.programId}`)
}

export async function resolveBlocker(id: string) {
  await prisma.blocker.update({
    where: { id },
    data: { resolved: true },
  })
  revalidatePath('/')
}

export async function getBlockersByProgram(programId: string) {
  return prisma.blocker.findMany({
    where: { programId, resolved: false },
    include: { compound: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getBlocker(id: string) {
  return prisma.blocker.findUnique({
    where: { id },
    include: { compound: true },
  })
}
