'use client'

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { CompoundCard } from './nerv/compound-card'
import { NervFrame } from './nerv/nerv-frame'
import { moveCompound } from '@/lib/actions/compounds'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

const STAGES = ['DESIGN', 'MAKE', 'TEST', 'ANALYZE'] as const

const stageColors: Record<string, { dot: string; text: string; bg: string }> = {
  DESIGN: { dot: 'bg-accent', text: 'text-accent', bg: 'bg-accent-light' },
  MAKE: { dot: 'bg-green', text: 'text-green', bg: 'bg-green-light' },
  TEST: { dot: 'bg-blue', text: 'text-blue', bg: 'bg-blue-light' },
  ANALYZE: { dot: 'bg-yellow', text: 'text-yellow', bg: 'bg-yellow-light' },
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

    let compound: CompoundData | undefined
    for (const stage of STAGES) {
      compound = data[stage].find(c => c.id === draggableId)
      if (compound) break
    }
    if (!compound || compound.stage === newStage) return

    const newData = { ...data }
    for (const stage of STAGES) {
      newData[stage] = newData[stage].filter(c => c.id !== draggableId)
    }
    newData[newStage] = [...newData[newStage], { ...compound, stage: newStage, daysInStage: 0 }]
    setData(newData)

    startTransition(async () => {
      await moveCompound(draggableId, newStage as any)
      router.refresh()
    })
  }

  return (
    <NervFrame className="p-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4">
          {STAGES.map(stage => {
            const color = stageColors[stage]
            const compounds = data[stage] || []
            return (
              <div key={stage} className="flex flex-col">
                <div className="flex items-center justify-between px-1 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${color.dot}`} />
                    <span className={`text-sm font-medium text-text-primary`}>
                      {stage.charAt(0) + stage.slice(1).toLowerCase()}
                    </span>
                    <span className="text-xs text-text-tertiary bg-bg-tertiary px-1.5 py-0.5 rounded-full">
                      {compounds.length}
                    </span>
                  </div>
                  <a
                    href={`/compounds/new?program=${programId}&stage=${stage}`}
                    className="text-text-tertiary hover:text-accent text-lg leading-none transition-colors"
                  >
                    +
                  </a>
                </div>
                <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-2 min-h-[120px] rounded-lg p-1.5 transition-colors ${
                        snapshot.isDraggingOver ? 'bg-accent-light' : 'bg-bg-secondary'
                      }`}
                    >
                      {compounds.length === 0 ? (
                        <div className="text-text-tertiary text-xs text-center py-8">
                          <div className="mb-2">No compounds</div>
                          <a
                            href={`/compounds/new?program=${programId}&stage=${stage}`}
                            className="text-accent hover:underline"
                          >
                            + Add compound
                          </a>
                        </div>
                      ) : (
                        compounds.map((c, index) => (
                          <Draggable key={c.id} draggableId={c.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={snapshot.isDragging ? 'shadow-lg' : ''}
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
    </NervFrame>
  )
}
