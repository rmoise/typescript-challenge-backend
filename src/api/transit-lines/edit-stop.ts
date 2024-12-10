import { Request, Response } from 'express'
import { lineService } from 'src/services/lineService'
import { TransitStop } from 'src/types/line'

interface EditStopRequest {
  lineId: string
  stopId: string
}

// Allow partial updates of stop properties
type EditStopBody = Partial<Omit<TransitStop, 'id' | 'prevId' | 'nextId'>>

export async function editStop(req: Request<EditStopRequest, {}, EditStopBody>, res: Response) {
  console.log('Edit stop request:', req.params, req.body)

  const { lineId, stopId } = req.params
  const updates = req.body

  const success = lineService.editStop(lineId, stopId, updates)
  console.log('Edit stop result:', success)

  if (success) {
    res.status(200).send({ message: 'Stop updated successfully' })
  } else {
    res.status(400).send({ error: 'Could not update stop' })
  }
} 