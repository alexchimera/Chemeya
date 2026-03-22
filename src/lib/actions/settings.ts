'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod/v4'

const HypothesisSchema = z.object({
  programId: z.string().min(1),
  label: z.string().min(1, 'Label is required'),
  content: z.string().min(1, 'Content is required'),
})

export async function createHypothesis(formData: FormData) {
  const parsed = HypothesisSchema.safeParse({
    programId: formData.get('programId'),
    label: formData.get('label'),
    content: formData.get('content'),
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  await prisma.designHypothesis.create({ data: parsed.data })
  revalidatePath('/settings')
  revalidatePath('/')
}

export async function updateHypothesis(id: string, formData: FormData) {
  await prisma.designHypothesis.update({
    where: { id },
    data: {
      label: formData.get('label') as string,
      content: formData.get('content') as string,
      active: formData.get('active') === 'on',
    },
  })
  revalidatePath('/settings')
  revalidatePath('/')
}

export async function deleteHypothesis(id: string) {
  await prisma.designHypothesis.delete({ where: { id } })
  revalidatePath('/settings')
  revalidatePath('/')
}

const DecisionMetricSchema = z.object({
  programId: z.string().min(1),
  label: z.string().min(1, 'Label is required'),
  target: z.string().min(1, 'Target is required'),
  current: z.string().optional(),
})

export async function createDecisionMetric(formData: FormData) {
  const parsed = DecisionMetricSchema.safeParse({
    programId: formData.get('programId'),
    label: formData.get('label'),
    target: formData.get('target'),
    current: formData.get('current') || undefined,
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  const count = await prisma.decisionMetric.count({
    where: { programId: parsed.data.programId },
  })

  await prisma.decisionMetric.create({
    data: { ...parsed.data, order: count },
  })

  revalidatePath('/settings')
  revalidatePath('/')
}

export async function updateDecisionMetric(id: string, formData: FormData) {
  await prisma.decisionMetric.update({
    where: { id },
    data: {
      label: formData.get('label') as string,
      target: formData.get('target') as string,
      current: (formData.get('current') as string) || null,
    },
  })
  revalidatePath('/settings')
  revalidatePath('/')
}

export async function deleteDecisionMetric(id: string) {
  await prisma.decisionMetric.delete({ where: { id } })
  revalidatePath('/settings')
  revalidatePath('/')
}

const CycleMetricSchema = z.object({
  programId: z.string().min(1),
  cycleNumber: z.coerce.number().int().positive(),
  weekOf: z.coerce.date(),
  avgCycleTimeDays: z.coerce.number().positive(),
  activeCompounds: z.coerce.number().int().nonnegative(),
  synthesisSuccessRate: z.coerce.number().min(0).max(100),
  potencyHitRate: z.coerce.number().min(0).max(100),
})

export async function createCycleMetric(formData: FormData) {
  const parsed = CycleMetricSchema.safeParse({
    programId: formData.get('programId'),
    cycleNumber: formData.get('cycleNumber'),
    weekOf: formData.get('weekOf'),
    avgCycleTimeDays: formData.get('avgCycleTimeDays'),
    activeCompounds: formData.get('activeCompounds'),
    synthesisSuccessRate: formData.get('synthesisSuccessRate'),
    potencyHitRate: formData.get('potencyHitRate'),
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  await prisma.cycleMetric.create({ data: parsed.data })
  revalidatePath('/settings')
  revalidatePath('/')
}

export async function getHypotheses(programId: string) {
  return prisma.designHypothesis.findMany({
    where: { programId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getDecisionMetrics(programId: string) {
  return prisma.decisionMetric.findMany({
    where: { programId },
    orderBy: { order: 'asc' },
  })
}

export async function getCycleMetrics(programId: string) {
  return prisma.cycleMetric.findMany({
    where: { programId },
    orderBy: { cycleNumber: 'desc' },
  })
}

export async function getLatestCycleMetric(programId: string) {
  return prisma.cycleMetric.findFirst({
    where: { programId },
    orderBy: { cycleNumber: 'desc' },
  })
}
