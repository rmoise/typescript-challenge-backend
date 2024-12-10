import { Request, Response } from 'express'
import { lineService } from 'src/services/lineService'
import { TransitStop } from 'src/types/line'

interface AddStopRequest {
  lineId: string
  referenceId: string
}

interface AddStopBody {
  stop: TransitStop
  position: 'before' | 'after'
}

export async function addStop(req: Request<AddStopRequest, {}, AddStopBody>, res: Response) {
  console.log('Request params:', req.params)
  console.log('Request body:', req.body)

  const { lineId, referenceId } = req.params
  const { stop, position } = req.body

  const success = lineService.addStop(lineId, stop, referenceId, position)
  console.log('Add stop result:', success)

  if (success) {
    res.status(200).send({ message: 'Stop added successfully' })
  } else {
    res.status(400).send({ error: 'Could not add stop' })
  }
}
