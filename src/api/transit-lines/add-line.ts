import { Request, Response } from 'express'
import { lineService } from 'src/services/lineService'
import { TransitStop } from 'src/types/line'

interface AddLineRequest {
  lineId: string
}

interface AddLineBody {
  stops: TransitStop[]
}

export async function addLine(req: Request<AddLineRequest, {}, AddLineBody>, res: Response) {
  console.log('Add line request:', req.params, req.body)

  const { lineId } = req.params
  const { stops } = req.body

  const success = lineService.addLine(lineId, stops)
  console.log('Add line result:', success)

  if (success) {
    res.status(200).send({ message: 'Line added successfully' })
  } else {
    res.status(400).send({ error: 'Could not add line' })
  }
} 