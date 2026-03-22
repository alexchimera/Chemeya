'use client'

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { CompoundCard } from './nerv/compound-card'
import { NervFrame } from './nerv/nerv-frame'
import { NervButton } from './nerv/nerv-button'
import { moveCompound } from '@/lib/actions/compounds'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

const STAGES = ['DESIGN', 'MAKE', 'TEST', 'ANALYZE'] as const

const stageStyles: Record<string, { headerBg: string; headerText: string; border: string }> = {
  DESIGN: { headerBg: 'rgba(232, 145, 58, 0.1)', headerText: 'text-amber', border: 'rgba(232, 145, 58, 0.3)' },
  MAKE: { headerBg: 'rgba(0, 212, 170, 0.1)', headerText: 'text-cyan', border: 'rgba(0, 212, 170, 0.3)' },
  TEST: { headerBg: 'rgba(42, 123, 212, 0.1)', headerText: 'text-blue', border: 'rgba(42, 123, 212, 0.3)' },
  ANALYZE: { headerBg: 'rgba(212, 42, 42, 0.1)', headerText: 'text-red', border: 'rgba(212, 42, 42, 0.3)' },
}

type CompoundData = {
  id: string
  compoundId: string
  description: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  daysInStage: number
  status: string | null
  stage: string
  programId: string
  blockers: { id: string }[]
}

type Props = {
  programId: string
  compoundsByStage: Record<string, CompoundData[]>
}

export function KanbanBoard({ programId, compoundsByStage: initialData }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState(initialData)

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return
    const { draggableId, destination } = result
    const newStage = destination.droppableId as typeof STAGES[number]

    // Find the compound
    let compound: CompoundData | undefined
    for (const stage of STAGES) {
      compound = data[stage].find(c => c.id === draggableId)
      if (compound) break
    }
    if (!compound || compound.stage === newStage) return

    // Optimistic update
    const newData = { ...data }
    for (const stage of STAGES) {
      newData[stage] = newData[stage].filter(c => c.id !== draggableId)
    }
    newData[newStage] = [...newData[newStage], { ...compound, stage: newStage, daysInStage: 0 }]
    setData(newData)

    // Server action
    startTransition(async () => {
      await moveCompound(draggableId, newStage as any)
      router.refresh()
    })
  }

  return (
    <NervFrame>
      <div className="dot-matrix">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-4 gap-2">
            {STAGES.map(stage => {
              const style = stageStyles[stage]
              const compounds = data[stage] || []
              return (
                <div key={stage} className="flex flex-col" style={{ borderLeft: `2px solid ${style.border}` }}>
                  <div
                    className="flex items-center justify-between px-2 py-1.5 mb-2"
                    style={{ background: style.headerBg }}
                  >
                    <span className={`text-[11px] uppercase tracking-[0.1em] font-medium ${style.headerText}`}>
                      {stage} [{String(compounds.length).padStart(2, '0')}]
                    </span>
                    <a
                      href={`/compounds/new?program=${programId}&stage=${stage}`}
                      className="text-lime text-[10px] hover:text-lime/80"
                    >
                      +
                    </a>
                  </div>
                  <Droppable droppableId={stage}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 px-1 space-y-1.5 min-h-[100px] transition-colors ${
                          snapshot.isDraggingOver ? 'bg-cyan/5' : ''
                        }`}
                      >
                        {compounds.length === 0 ? (
                          <div className="text-amber-dim text-[10px] uppercase tracking-[0.1em] text-center py-6">
                            — NO ACTIVE COMPOUNDS —
                            <div className="mt-2">
                              <a
                                href={`/compounds/new?program=${programId}&stage=${stage}`}
                                className="text-lime text-[10px] hover:underline"
                              >
                                [ + REGISTER ]
                              </a>
                            </div>
                          </div>
                        ) : (
                          compounds.map((c, index) => (
                            <Draggable key={c.id} draggableId={c.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={snapshot.isDragging ? 'shadow-[0_0_12px_rgba(232,145,58,0.4)]' : ''}
                                >
                                  <CompoundCard
                                    id={c.id}
                                    compoundId={c.compoundId}
                                    description={c.description}
                                    priority={c.priority}
                                    daysInStage={c.daysInStage}
                                    status={c.status}
                                    blockerCount={c.blockers?.length || 0}
                                    programId={programId}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              )
            })}
          </div>
        </DragDropContext>
      </div>
    </NervFrame>
  )
}
