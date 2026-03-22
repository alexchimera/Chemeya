'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { z } from 'zod/v4'

const ProgramSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  prefix: z.string().min(1, 'Prefix is required').max(6, 'Prefix max 6 characters'),
  description: z.string().optional(),
})

export async function createProgram(formData: FormData) {
  const parsed = ProgramSchema.safeParse({
    name: formData.get('name'),
    prefix: (formData.get('prefix') as string)?.toUpperCase(),
    description: formData.get('description') || undefined,
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  const program = await prisma.program.create({
    data: parsed.data,
  })

  redirect(`/?program=${program.id}`)
}

export async function updateProgram(id: string, formData: FormData) {
  const parsed = ProgramSchema.safeParse({
    name: formData.get('name'),
    prefix: (formData.get('prefix') as string)?.toUpperCase(),
    description: formData.get('description') || undefined,
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  await prisma.program.update({
    where: { id },
    data: {
      ...parsed.data,
      active: formData.get('active') === 'on',
    },
  })

  redirect(`/settings?program=${id}`)
}

export async function getPrograms() {
  return prisma.program.findMany({
    where: { active: true },
    orderBy: { createdAt: 'asc' },
  })
}

export async function getProgram(id: string) {
  return prisma.program.findUnique({ where: { id } })
}
